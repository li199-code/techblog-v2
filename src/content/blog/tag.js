const fs = require('fs');
const path = require('path');

// 需要修改的文件夹路径
const folderPath = '.';

// 正则表达式匹配 tags 数组格式
const tagArrayRegex = /^tags:\s*\[([^\]]*)\]/m;

// 正则表达式匹配带有 `- ` 前缀的标签
const tagPrefixRegex = /^\s*-\s+/;

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('无法读取文件夹:', err);
    return;
  }

  // 过滤出 Markdown 文件
  const markdownFiles = files.filter(file => path.extname(file) === '.md');

  markdownFiles.forEach(file => {
    const filePath = path.join(folderPath, file);
    
    // 读取文件内容
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`无法读取文件 ${filePath}:`, err);
        return;
      }

      // 查找并替换 tags 数组内容
      const updatedData = data.replace(tagArrayRegex, (match, tagContent) => {
        // 将 tags 字符串解析成数组，并去除 `- ` 前缀
        const tags = tagContent.split(',').map(tag => {
          const trimmedTag = tag.trim();
          // 如果标签前面有 `- `，则去除
          return tagPrefixRegex.test(trimmedTag) ? trimmedTag.replace(tagPrefixRegex, '') : trimmedTag;
        });

        // 重新组装成 `tags: [xx, yy]` 格式
        return `tags: [${tags.join(', ')}]`;
      });

      // 如果文件内容有变化，则写入文件
      if (updatedData !== data) {
        fs.writeFile(filePath, updatedData, 'utf8', err => {
          if (err) {
            console.error(`无法写入文件 ${filePath}:`, err);
            return;
          }
          console.log(`已更新文件: ${filePath}`);
        });
      }
    });
  });
});
