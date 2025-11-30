import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录名（相当于 CommonJS 的 __dirname）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取命令行参数
const args = process.argv.slice(2);

let directory = 'blog'; // 默认目录
let title;

// 判断参数数量，支持两种格式：
// 1. npm run new "title" - 默认创建到 blog 目录
// 2. npm run new directory "title" - 创建到指定目录
if (args.length === 1) {
  title = args[0];
} else if (args.length >= 2) {
  directory = args[0];
  title = args[1];
} else {
  console.error("请提供博客标题！");
  console.error("用法: npm run new [目录] \"标题\"");
  console.error("示例: npm run new \"我的文章\" 或 npm run new others \"我的文章\"");
  process.exit(1);
}

// 格式化当前日期为 YYYY-MM-DD
const date = new Date().toISOString().split('T')[0];

// 处理标题：将空格，中英文冒号替换为短横线，并转换为小写
const formattedTitle = title.trim().replace(/\s+/g, '-').replace(/[:：]/g, '-').toLowerCase();

// 定义frontmatter内容，添加slug字段
const frontmatter = `---
title: "${title}"
authors: Jason
date: ${date}
description: "这里写描述"
tags: []
---
import LinkCard from "@components/LinkCard.astro";
import Callout from "@components/Callout.astro";
`;

// 文件名格式：YYYY-MM-DD-title.mdx
const fileName = `${date}-${formattedTitle}.mdx`;

// 目标路径：指定的目录
const targetDir = path.join(__dirname, '..', 'src', 'content', directory);
const filePath = path.join(targetDir, fileName);

// 检查目标目录是否存在
try {
  await fs.access(targetDir);
} catch (err) {
  console.error(`错误：目录 'src/content/${directory}' 不存在！`);
  console.error(`请确保目录存在后再试。`);
  process.exit(1);
}

// 写入文件（使用 async/await）
try {
  await fs.writeFile(filePath, frontmatter);
  console.log(`博客文件已创建：${filePath}`);
} catch (err) {
  console.error("无法创建博客文件：", err);
}