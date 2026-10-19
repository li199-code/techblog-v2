import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const placeholderDescriptions = new Set(["", "这里写描述", "暂无描述"]);

function runGit(args, options = {}) {
  const result = spawnSync("git", args, {
    cwd: rootDir,
    encoding: "utf8",
    ...options,
  });

  if (result.status !== 0) {
    throw new Error(result.stderr?.trim() || `git ${args.join(" ")} 执行失败`);
  }

  return result.stdout;
}

async function loadDotEnv() {
  let content;
  try {
    content = await fs.readFile(path.join(rootDir, ".env"), "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const match = line.match(
      /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/,
    );
    if (!match || process.env[match[1]] !== undefined) continue;

    let value = match[2].trim();
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1);
    } else {
      value = value.replace(/\s+#.*$/, "");
    }
    process.env[match[1]] = value;
  }
}

function getNewStagedArticleFiles() {
  const output = runGit([
    "diff",
    "--cached",
    "--name-only",
    "--diff-filter=A",
    "-z",
    "--",
    "src/content/blog/*.mdx",
    "src/content/blog/*.md",
    "src/content/daily/*.mdx",
    "src/content/daily/*.md",
  ]);

  return output.split("\0").filter(Boolean);
}

async function getAllArticleFiles() {
  const files = [];
  for (const collection of ["blog", "daily"]) {
    const directory = path.join(rootDir, "src", "content", collection);
    const entries = await fs.readdir(directory, {
      recursive: true,
      withFileTypes: true,
    });
    for (const entry of entries) {
      if (entry.isFile() && /\.mdx?$/.test(entry.name)) {
        files.push(
          path
            .relative(rootDir, path.join(entry.parentPath, entry.name))
            .split(path.sep)
            .join("/"),
        );
      }
    }
  }
  return files.sort();
}

function getFilesWithUnstagedChanges(files) {
  if (files.length === 0) return [];
  const output = runGit(["diff", "--name-only", "-z", "--", ...files]);
  return output.split("\0").filter(Boolean);
}

function parseFrontmatter(source, file) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`${file} 没有有效的 YAML frontmatter`);

  const frontmatter = match[1];
  const titleMatch = frontmatter.match(/^title:[ \t]*(.+)$/m);
  const descriptionMatch = frontmatter.match(/^description:[ \t]*([^\r\n]*)/m);
  const tagsMatch = frontmatter.match(/^tags:[ \t]*([^\r\n]*)/m);
  const description = descriptionMatch
    ? descriptionMatch[1]
        .trim()
        .replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, "$1$2")
    : "";
  const rawTags = tagsMatch?.[1].trim() ?? "";

  return {
    fullMatch: match[0],
    frontmatter,
    title:
      titleMatch?.[1].trim().replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, "$1$2") ||
      path.basename(file, path.extname(file)),
    needsDescription:
      !descriptionMatch || placeholderDescriptions.has(description),
    needsTags: !tagsMatch || rawTags === "" || /^\[\s*\]$/.test(rawTags),
  };
}

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate =
    fenced?.[1] ?? text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  const value = JSON.parse(candidate.trim());

  if (typeof value.description !== "string" || !Array.isArray(value.tags)) {
    throw new Error("AI 返回内容缺少 description 或 tags");
  }

  const description = value.description.replace(/\s+/g, " ").trim();
  const tags = [
    ...new Set(value.tags.map((tag) => String(tag).trim()).filter(Boolean)),
  ].slice(0, 5);
  if (!description || tags.length === 0)
    throw new Error("AI 返回了空的 description 或 tags");
  return { description, tags };
}

function getProviders() {
  const ollamaProvider = {
    name: "本地 Ollama",
    apiKey: process.env.OLLAMA_API_KEY || "ollama",
    baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434/v1",
    model: process.env.OLLAMA_MODEL || "qwen2.5:1.5b",
  };

  if (process.env.BLOG_AI_API_KEY) {
    return [
      {
        name: "自定义服务",
        apiKey: process.env.BLOG_AI_API_KEY,
        baseUrl: process.env.BLOG_AI_BASE_URL || "https://api.deepseek.com",
        model: process.env.BLOG_AI_MODEL || "deepseek-chat",
      },
    ];
  }

  return [
    {
      name: "阿里云百炼",
      apiKey: process.env.ALIBABA_API_KEY,
      baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
      model: "qwen-plus",
    },
    ollamaProvider,
    {
      name: "DeepSeek",
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseUrl: process.env.BLOG_AI_BASE_URL || "https://api.deepseek.com",
      model: process.env.BLOG_AI_MODEL || "deepseek-chat",
    },
    {
      name: "智谱 AI",
      apiKey: process.env.ZHIPUAI_API_KEY,
      baseUrl: "https://open.bigmodel.cn/api/paas/v4",
      model: "glm-4-flash",
    },
  ].filter((provider) => provider.apiKey);
}

async function requestMetadata(provider, { title, body }) {
  const baseUrl = provider.baseUrl.replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    signal: AbortSignal.timeout(45_000),
    headers: {
      Authorization: `Bearer ${provider.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: provider.model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            '你是中文博客编辑。根据文章生成准确、自然的摘要和标签，忠实于正文，不添加文章未提及的事实。摘要用一到两句中文，不夸大、不使用‘本文将’等套话，建议 30 到 80 个汉字。标签生成 2 到 5 个，保持简短；技术名词可使用常见英文写法。只返回 JSON：{"description":"...","tags":["..."]}。',
        },
        {
          role: "user",
          content: `标题：${title}\n\n正文：\n${body.slice(0, 24000)}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const details = (await response.text())
      .replaceAll(provider.apiKey, "[REDACTED]")
      .replace(/api key:\s*[^,\s\"}]+/gi, "api key: [REDACTED]")
      .slice(0, 500);
    throw new Error(
      `${provider.name} 请求失败 (${response.status})：${details}`,
    );
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI 响应中没有可用内容");
  return extractJson(content);
}

async function generateMetadata(article) {
  const providers = getProviders();
  if (providers.length === 0) {
    throw new Error(
      "未找到 BLOG_AI_API_KEY、DEEPSEEK_API_KEY、ZHIPUAI_API_KEY 或 ALIBABA_API_KEY，请在 .env 中配置",
    );
  }

  const failures = [];
  for (const provider of providers) {
    try {
      console.log(`调用 ${provider.name}（${provider.model}）...`);
      return await requestMetadata(provider, article);
    } catch (error) {
      failures.push(error.message);
      if (providers.length > 1)
        console.warn(`${error.message}\n尝试下一个 AI 服务...`);
    }
  }

  throw new Error(failures.join("\n"));
}

function updateFrontmatter(source, parsed, generated) {
  const eol = source.includes("\r\n") ? "\r\n" : "\n";
  let frontmatter = parsed.frontmatter;

  if (parsed.needsDescription) {
    const line = `description: ${JSON.stringify(generated.description)}`;
    frontmatter = /^description:.*$/m.test(frontmatter)
      ? frontmatter.replace(/^description:[^\r\n]*/m, () => line)
      : `${frontmatter}${eol}${line}`;
  }

  if (parsed.needsTags) {
    const line = `tags: ${JSON.stringify(generated.tags)}`;
    frontmatter = /^tags:.*$/m.test(frontmatter)
      ? frontmatter.replace(/^tags:[^\r\n]*/m, () => line)
      : `${frontmatter}${eol}${line}`;
  }

  return source.replace(
    parsed.fullMatch,
    () => `---${eol}${frontmatter}${eol}---${eol}`,
  );
}

async function main() {
  const args = process.argv.slice(2);
  if (args.some((arg) => !["--all", "--dry-run"].includes(arg))) {
    throw new Error(
      "用法：node scripts/fill-blog-metadata.js [--all] [--dry-run]",
    );
  }
  const all = args.includes("--all");
  const dryRun = args.includes("--dry-run");
  if (process.env.SKIP_BLOG_AI === "1") {
    console.log("已跳过博客 AI 元数据生成（SKIP_BLOG_AI=1）");
    return;
  }

  const files = all ? await getAllArticleFiles() : getNewStagedArticleFiles();
  if (files.length === 0) return;

  const unstagedFiles = all ? [] : getFilesWithUnstagedChanges(files);
  if (unstagedFiles.length > 0) {
    throw new Error(
      `以下新文章还有未暂存的修改，请先执行 git add：\n${unstagedFiles.join("\n")}`,
    );
  }

  if (!dryRun) await loadDotEnv();
  let pending = 0;
  let completed = 0;
  const failures = [];
  for (const file of files) {
    try {
      const absolutePath = path.join(rootDir, file);
      const source = await fs.readFile(absolutePath, "utf8");
      const parsed = parseFrontmatter(source, file);

      if (!parsed.needsDescription && !parsed.needsTags) {
        continue;
      }

      pending++;
      if (dryRun) {
        console.log(
          `待补全：${file} (${[parsed.needsDescription && "description", parsed.needsTags && "tags"].filter(Boolean).join(", ")})`,
        );
        continue;
      }

      console.log(`正在为博客生成 description 和 tags：${file}`);
      const body = source.slice(parsed.fullMatch.length).trim();
      const generated = await generateMetadata({ title: parsed.title, body });
      const updated = updateFrontmatter(source, parsed, generated);
      await fs.writeFile(absolutePath, updated, "utf8");
      if (!all) runGit(["add", "--", file]);
      completed++;
      console.log(
        `已生成${all ? "" : "并暂存"}：${generated.description} [${generated.tags.join(", ")}]`,
      );
    } catch (error) {
      if (!all) throw error;
      failures.push(file);
      console.error(`补全失败：${file}\n${error.message}`);
    }
  }
  console.log(
    `检查 ${files.length} 篇，待补全 ${pending} 篇${dryRun ? "（仅预览）" : `，成功 ${completed} 篇，失败 ${failures.length} 篇`}。`,
  );
  if (failures.length > 0)
    throw new Error(`以下文章未完成，可重新运行重试：\n${failures.join("\n")}`);
}

main().catch((error) => {
  console.error(`\n博客 AI 元数据生成失败：${error.message}`);
  console.error("修复后重新提交；如需临时跳过，可设置 SKIP_BLOG_AI=1。\n");
  process.exit(1);
});
