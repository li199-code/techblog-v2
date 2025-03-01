---
title: expressjs 框架的使用体验
summary: expressjs是nodejs体系内最流行的框架，本文是对它的一个主观使用感受记录。
tags: [expressjs, 框架]
abbrlink: 13a2dd29
date: 2024-07-17 14:11:55
---

expressjs 的官网介绍：一款快速的、无预设的、极简的 web 框架。Nodejs 的很多框架正是基于 expressjs。作为一个极简框架，我打算在一篇文章中介绍它和我的使用感受。

## hello-world

项目创建这一步就体现了 expressjs slogan 中的极简。其他框架都要借助`npx`或者`npm install xxx -g`等脚手架工具，生成一个完整（庞大）的项目。然而，express 只需要简单的`npm init -y`来初始化项目，然后`npm install express`，执行完后目录中只有 index.js, node_modules, package.json，非常的清爽。同时这也体现了无预设的特性，既不规定开发者要按什么规范来组织代码文件架构，不干涉技术选型。可以说，掌握了 expressjs，就掌握了 web 后端开发的众多核心概念。

## .env 文件的创建

一直以来关于 nodejs 项目的环境变量，我都有一个误解，就是要真的跑到 os 的环境变量管理窗口去添加。实际上，只需要遵守下列步骤就可以了：

- 项目根目录创建`.env`文件，填上变量，并在代码中使用`process.env.xxx`来引用
- `package.json`的启动命令中，加上参数`--env-file=.env`
- 重启项目

## 指定模块定义方式

两种模块定义方式，commonjs 和 ES6，可以在`package.json`加一个 type 字段，如：`type: module"。默认的是 commonjs。

## 最佳实践

因为 express 本身不规定任何开发模式，所以遵守最佳实践是很重要的。有几个必要的文件夹：

- routes: 存放路由
- middleware: 中间件
- controller：handle function

上面这些组件可以在主文件中被导入并使用。
