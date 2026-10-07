个人博客codebase

## 技术栈

框架：astro。一款内容优先的静态站点生成器。相较于hexo/docusaurus，编译速度快，主题修改难度低，更适合个人博客。

主题：[astro-milidev](https://bartoszlenar.github.io/astro-milidev)

部署：github action 构建 astro 静态站点，并部署到 github pages。

## 新建文章

```
npm run new <title>
```

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

提交新增的 `src/content/blog/*.mdx` 时，pre-commit hook 会调用 AI，自动补全模板中的 `description` 和 `tags`，并将结果加入本次提交。已有的非空元数据不会被覆盖。

默认依次尝试 `.env` 中已配置的阿里云百炼、DeepSeek 和智谱 AI 密钥。也可以用以下变量固定使用任意兼容 OpenAI Chat Completions API 的服务（设置后不再回退）：

```dotenv
BLOG_AI_API_KEY=your-api-key
BLOG_AI_BASE_URL=https://api.deepseek.com
BLOG_AI_MODEL=deepseek-chat
```

PowerShell 中如需临时跳过 AI：

```powershell
$env:SKIP_BLOG_AI=1; git commit
```
