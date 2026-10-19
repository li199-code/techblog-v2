个人博客codebase

## 技术栈

框架：astro。一款内容优先的静态站点生成器。相较于hexo/docusaurus，编译速度快，主题修改难度低，更适合个人博客。

主题：[astro-milidev](https://bartoszlenar.github.io/astro-milidev)

部署：github action 构建 astro 静态站点，并部署到 github pages。

## 本地运行

Astro 7 及当前依赖要求 Node.js >=22.19.0，推荐使用 Node.js 24 LTS。

```sh
npm install
npm run dev
```

构建验证：`npm run build`。

## 新建文章

```
npm run new <title>
```

## 首页分类内置顶

在文章的 frontmatter 中添加 `pinned: true`，即可让文章在首页所属分类（Blog 或 Daily）内优先显示：

```yaml
---
title: 文章标题
date: 2026-10-16
pinned: true
---
```

未设置或设置为 `false` 时不置顶。多篇置顶文章之间按 `lastUpdateDate`（没有则使用 `date`）倒序排列，普通文章也按同样的时间规则排列。置顶文章占用首页已有的展示名额（目前每类 5 篇）；草稿不会显示。分类归档、标签页、RSS 和文章上下篇导航仍按原有时间顺序排列。

首页和分类列表页（如 `/blog`、`/daily`）中，置顶文章的标题前会显示相同的金色图钉图标，鼠标悬停时提示“置顶”，并提供屏幕阅读器可读的“置顶文章”标注。分类列表页仍按原有时间顺序排列。

## RSS订阅地址

https://jasonleehere.com/feed.xml

## 组件用法备忘

<Callout>
  Don't forget to use [client
  directives](https://docs.astro.build/en/reference/directives-reference/#client-directives)
  to make framework components interactive.
</Callout>

<Callout type="warning"> 或者info
This doesn't work if the website is hosted with a base path (in `astro.config.mjs`).
</Callout>

<LinkCard
  title="NodeJs进阶开发、性能优化指南"
  link="https://juejin.cn/post/7095354780079357966?from=search-suggest#heading-4"
/>

# 提交前自动补全博客元数据

首次克隆仓库后执行：

```sh
npm run hooks:install
```

提交新增的 `src/content/blog/` 或 `src/content/daily/` 下的 `.md`、`.mdx` 文章时，pre-commit hook 会调用 AI，自动补全模板中的 `description` 和 `tags`，并将结果加入本次提交。已有的非空元数据不会被覆盖；修改已提交的文章不会触发补全。

检查、补全这两个目录的历史文章（包括空字段和模板占位值），结果只写入工作区，不自动暂存：

```sh
npm run blog:metadata -- --all --dry-run
npm run blog:metadata -- --all
```

默认优先尝试 `.env` 中已配置密钥的阿里云百炼，再依次尝试本地 Ollama（`http://localhost:11434/v1`，模型 `qwen2.5:1.5b`）、已配置密钥的 DeepSeek 和智谱 AI。也可以用以下变量固定使用任意兼容 OpenAI Chat Completions API 的服务（设置后不再回退）：

```dotenv
BLOG_AI_API_KEY=your-api-key
BLOG_AI_BASE_URL=https://api.deepseek.com
BLOG_AI_MODEL=deepseek-chat
```

PowerShell 中如需临时跳过 AI：

```powershell
$env:SKIP_BLOG_AI=1; git commit
```
