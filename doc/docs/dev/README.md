---
title: 参与开发
lang: zh-CN
---

## 如何参与开发

1. Fork 本仓库
2. 克隆仓库到本地
3. 运行 `npm ci` 按锁定文件安装依赖
4. 添加功能/修复 BUG
5. 运行`npm test`无报错
6. 提交 PR

## 环境、构建与测试

需要 Node.js 20.19+（20.x）、22.13+（22.x）或 >=24.0.0，以满足当前工具链要求；建议使用 Node.js 22.20+ 或 24.12+。以下命令均在项目根目录执行。脚本通过用户脚本管理器安装后在支持的网站上运行，不需要启动本地应用服务；地区恢复功能无需新增环境变量。

- `npm run lint`：运行 ESLint 检查；`npm run lint:fix` 自动修复支持的问题。
- `npm test`：运行 ESLint 和 TypeScript 类型检查。
- `npm run build`：检查并构建脚本及全资源版本。

### 依赖安全维护

根目录和 `doc/` 各自维护 `package-lock.json`，应分别运行 `npm ci` 和 `npm --prefix doc ci`。使用 `npm audit` 和 `npm --prefix doc audit` 检查全部依赖，包括构建工具；不要通过排除开发依赖隐藏漏洞。

运行时依赖同时存在于 `src/scripts/header.js` 的 CDN 地址和 `src/static/` 的全资源内嵌文件中。更新时需同步实际版本和第三方许可证。依赖变更后运行 `npm test`、`npm --ignore-scripts run build` 和 `npm --prefix doc run docs:build`；其中 `--ignore-scripts` 仅用于跳过构建后的发布文件同步，构建主体仍会执行。

### 样式资源构建

`npm run rollup` 会将 `src/style/auto-task.scss` 编译为 `dist/auto-task.css`，再由 `node build-all-static.js` 将 CSS 内嵌到三个全资源版本。若本地存在样式测试，可运行 `node --test tests/style-build.test.cjs` 验证产物。

发布时需将 CSS 与脚本一起提交到版本 tag 并发布。资源地址固定到 `package.json` 对应的 `v<version>` tag；本地安装测试需使用已包含该 CSS 的 tag 或临时可访问资源地址。

### 排错与 GiveeClub 地区恢复

GiveeClub 通过 `resetAreaAfterTasks: false` 延后批次结束后的地区恢复，用户点击 `button#submitEventActions` 时调用同一 Steam 实例的 `resetArea()`，恢复操作进入该实例队列。重复初始化不会重复注册监听，动态按钮及其内部元素点击均受支持，脚本模拟点击不会触发恢复。其他网站继续在批次结束后恢复。

若地区未恢复，检查是否实际点击了网站提交按钮，以及 Steam 商店授权是否有效，并查看脚本地区恢复状态日志。样式未加载时，检查对应版本 tag 中的 CSS 资源是否存在。

## API 文档

[查看 TSDoc API 文档](/tsdoc/)，可按模块查阅类型、方法、参数和返回值说明。

在项目根目录运行 `npm run docs:api` 可从源码注释重新生成文档。文档站启动和构建时也会自动生成；开发过程中修改源码注释后，需要再次运行该命令并刷新页面。

## 依赖关系图

<a href="/report.html" target="_blank">查看原页面</a>

<iframe src="/report.html" style="width: 100%;height: 500px;"></iframe>
