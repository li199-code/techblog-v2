import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录名（相当于 CommonJS 的 __dirname）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取命令行参数，如博客标题
const [title] = process.argv.slice(2);

// 检查是否提供了标题
if (!title) {
  console.error("请提供博客标题！");
  process.exit(1);
}

// 格式化当前日期为 YYYY-MM-DD
const date = new Date().toISOString().split('T')[0];

// 处理标题：将空格替换为短横线，并转换为小写
const formattedTitle = title.trim().replace(/\s+/g, '-').toLowerCase();

// 定义frontmatter内容，添加slug字段
const frontmatter = `---
title: "${title}"
authors: Jason
date: ${date}
description: "这里写描述"
tags: []
---
import LinkCard from "../../components/LinkCard.astro";

{/* truncate */}
`;

// 文件名格式：YYYY-MM-DD-title.mdx
const fileName = `${date}-${formattedTitle}.mdx`;

// 目标路径：/blog 文件夹
const filePath = path.join(__dirname, '..', 'src', 'content', 'blog', fileName);

// 写入文件（使用 async/await）
try {
  await fs.writeFile(filePath, frontmatter);
  console.log(`博客文件已创建：${filePath}`);
} catch (err) {
  console.error("无法创建博客文件：", err);
}