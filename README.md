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
