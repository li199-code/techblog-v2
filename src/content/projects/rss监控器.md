---
title: RSS 监控器
tags: [RSS]
date: 2026-01-11
categories: 项目
authors: Jason
---

一个智能 RSS 订阅监控、摘要生成和通知系统。它能自动从指定的 RSS 源拉取更新，利用大语言模型（LLM）生成内容摘要，并将新动态通过飞书（Feishu）等渠道发送通知。

前置条件，自建rsshub，然后参考不同网站的路由格式，获得一个可用的rss链接。rsshub的好处是配置简单，功能强大。

[项目地址](https://gitee.com/li199-code/rss_monitor)

## ✨ 功能特性

- **RSS 源管理**: 通过 Web 界面方便地添加、删除和管理 RSS 订阅源。
- **自动化抓取**: 内置定时任务，周期性地检查并获取 RSS 源的最新文章。
- **AI 内容摘要**: 集成大语言模型（LLM），自动为新增的文章生成核心内容摘要。
- **变更检测**: 监控文章内容的变化，并对更新进行提醒。
- **飞书集成**: 将新文章及其摘要实时推送到指定的飞书群组或联系人。
- **Web 用户界面**: 提供一个现代化的 React 前端，用于轻松配置监控任务和查阅历史记录。
- **数据持久化**: 使用数据库存储 RSS 源、文章、日志等信息。

## 🛠️ 技术栈

- **后端**: Node.js, Express.js
- **前端**: React, Vite
- **数据库**: SQLite (或其他兼容 `knex` 的数据库)
- **通知渠道**: 飞书 Webhook

## 🚀 快速开始

### 环境准备

- Node.js (推荐 v18 或更高版本)
- npm 或 pnpm

### 后端设置

1.  **进入后端目录并安装依赖**:
    ```bash
    cd backend
    npm install
    ```

2.  **配置环境变量**:
    复制 `.env.example` 文件并重命名为 `.env`。
    ```bash
    cp .env.example .env
    ```
    然后编辑 `.env` 文件，填入必要的配置，例如数据库路径、飞书 Webhook 地址以及 LLM 的 API Key。

3.  **初始化数据库**:
    执行数据库迁移脚本来创建所需的表结构。
    ```bash
    npx knex migrate:latest
    ```

4.  **启动后端服务**:
    ```bash
    npm start
    ```
    服务默认将在 `http://localhost:3000` 上运行。

### 前端设置

1.  **进入前端目录并安装依赖**:
    ```bash
    cd frontend
    npm install
    ```

2.  **启动前端开发服务**:
    ```bash
    npm run dev
    ```
    应用将在 `http://localhost:5173` (或另一个可用端口) 上运行。

3.  **访问应用**:
    打开浏览器并访问前端应用的地址即可开始使用。

## 部署

关于如何将此项目部署到生产环境，请参考 `DEPLOY.md` 文件和 `deploy.sh` 脚本。

## 项目结构

```
rss_monitor/
├── backend/         # 后端 Node.js/Express 应用
│   ├── src/
│   │   ├── api/     # API 路由、控制器和中间件
│   │   ├── core/    # 核心业务逻辑（抓取、摘要、通知）
│   │   ├── database/# 数据库连接、迁移和模型
│   │   └── ...
│   └── server.js    # 服务入口
├── frontend/        # 前端 React/Vite 应用
│   ├── src/
│   │   ├── components/ # UI 组件
│   │   ├── pages/      # 页面级组件
│   │   ├── services/   # API 请求服务
│   │   └── ...
│   └── vite.config.js # Vite 配置
├── deploy.sh        # 部署脚本
└── ...
```
