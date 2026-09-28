# Auto-Task

[![License](https://img.shields.io/github/license/HCLonely/auto-task?label=License)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](package.json)

一个功能强大的自动化任务处理脚本，专门用于处理各种赠Key站的任务。

## ✨ 特性

- 🚀 支持多个主流赠Key平台
- 🔄 自动化完成各类社交平台任务
- 🛠 支持 Steam、Twitter 等平台的任务处理
- 📦 提供多个版本以满足不同需求
- 🌍 支持多语言界面
- 🔧 高度可配置的任务处理选项

## 📦 安装

提供多个版本以满足不同需求：

- **正式版**：标准版本，适合大多数用户
- **兼容版**：当正式版出现兼容性问题时的备选方案

普通版、压缩版和兼容版通过 `@resource` 加载项目样式；对应的 `.all.user.js` 全资源版本将样式和依赖内嵌，适合资源加载受限时使用。脚本仍保留原有六种产物。

## 🚀 快速开始

1. 安装所需的用户脚本管理器（如 Tampermonkey）
2. 选择并安装适合您需求的版本
3. 访问支持的赠Key网站
4. 点击页面上出现的自动任务按钮开始处理任务

## 🛠 开发相关

### 环境要求

- Node.js: >=18.0.0
- npm 或 yarn

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 构建命令

```bash
# 运行 ESLint 检查
npm run lint

# 修复 ESLint 问题
npm run lint:fix

# 构建项目
npm run build
```

## 📖 使用文档

- [使用说明](https://auto-task-doc.js.org/guide/)
- [English Document](https://auto-task-doc.js.org/en/guide/)

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目。

## 📄 开源协议

本项目采用 [MIT 协议](LICENSE) 开源。

---

[![Repobeats analytics image](https://repobeats.axiom.co/api/embed/e5c7c311a4d91763154bfbee13c9186759c29ae4.svg "Repobeats analytics image")](https://github.com/HCLonely/auto-task/pulse)

---
如果这个项目对您有帮助，请考虑给它一个 Star ⭐️

### 样式资源构建

`npm run rollup` 会将 `src/style/auto-task.scss` 编译为 `dist/auto-task.css`，再由 `node build-all-static.js` 将 CSS 内嵌到三个全资源版本。可运行 `node --test tests/style-build.test.cjs` 验证产物。

发布时需将 CSS 与脚本一起提交到版本 tag 并发布。资源地址固定到 `package.json` 对应的 `v<version>` tag；本地安装测试需使用已包含该 CSS 的 tag 或临时可访问资源地址。
