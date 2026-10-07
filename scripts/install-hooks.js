import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const hookPath = path.join(rootDir, ".githooks", "pre-commit");

await fs.chmod(hookPath, 0o755);

const result = spawnSync("git", ["config", "core.hooksPath", ".githooks"], {
  cwd: rootDir,
  encoding: "utf8",
});

if (result.status !== 0) {
  console.error(result.stderr?.trim() || "Git hook 安装失败");
  process.exit(1);
}

console.log("Git hooks 已安装");
