# 项目社交模块接入

`src/scripts/social/` 负责项目环境接入，平台请求与任务实现位于 `src/modules/social/`。
`clients.ts` 中的 `createSteam()`、`createTwitter()` 等工厂注入项目依赖，返回原生模块实例；
网站直接调用实例的 `init()` / `do()` / `undo()` 和查询方法，不经过平台包装类或方法转发。
网站直接使用模块的 `SocialTaskResult`；逐任务结果通过可选链读取，不再复制转换结果。

运行时通过用户脚本头部的 `@require` 加载 `dist/auto-task.modules.js`，模块暴露为 `AutoTaskModules`。
源码保留 TypeScript 导入以进行类型检查；Rollup 将这些导入映射到对应的全局命名空间，不再将模块实现打包进主脚本。
`npm run rollup` 构建模块资源、网站资源及三个主脚本版本；模块资源经过兼容性转换，全依赖版本会内嵌这些资源。
网站资源通过 `AutoTaskWebsite.socialClients` 导出工厂，主脚本的 ASF 工厂调用由 Rollup 映射到该命名空间。

- `clients.ts` 集中创建 Steam、VK、Twitch、Twitter、Reddit、YouTube 和 SteamASF 实例，传入项目配置及各模块的 GM HTTP 适配器。SteamWeb 由 Steam 模块内部管理。
- 工厂只为 `dispose()` 增加幂等清理：先移除项目状态与页面监听，再释放原生模块；其他业务方法保持原样。
- `getYoutubeInfo()` 为设置界面和白名单提供临时查询，成功或失败后均释放实例。
- 独立模块的 `SocialAdapter` 保留给外部使用，项目不再依赖它。
- `moduleBridge.ts` 将状态事件转为国际化日志。批次与单个任务显示执行结果，内部请求事件仅写入调试日志；日志目标经过 HTML 转义。
- 页面离开、失败实例替换、临时查询结束时释放监听。配置或白名单变化后，下次网站任务执行会重新初始化模块。
- 网站请求工具仍供网站自身使用，社交模块不经过它的日志和重试逻辑。

## GM 存储与认证

模块命名空间为 `autoTask:<platform>`。Steam Web 为 `autoTask:steam:web`，ASF 为 `autoTask:steam:asf`。
脚本入口使用相同命名空间调用 Steam / Twitch 的页面认证处理器，保留自动开页、等待登录、回传和关闭认证页的流程。

兼容的认证与缓存继续使用 `<platform>Auth` / `<platform>Cache`；Steam Web 缓存使用 `steamCache`。
白名单读写映射至原 `whiteList` 中对应平台，保留其他平台的数据。
VK 转发缓存按账户保存在模块命名空间内，不将无法确认所属账户的旧 `vkCache` 用于删除转发。
模块持久化任务记录按页面 URL（去掉片段）隔离，避免跨赠品页撤销任务。

挂时长记录仍桥接原 `stopPlayTime`、`playedGames`、`taskLink` 三个 GM 键，兼容现有到期停止逻辑；
项目继续采用单份当前 ASF 配置，不提供多机器人独立挂时长记录。独立模块本身仍支持其原有隔离方式。
所有持久化均通过 GM API，不引入 localStorage 回退。

## Discord

已移除平台实现、配置、白名单选项、图标、专用翻译和显式权限声明。
网站仅保留识别并跳过 Discord 任务的分支，不再生成任务或自动绑定账户。
读取旧历史、选择任务和构建执行参数时也会过滤 Discord；不主动删除用户的旧 GM 数据。

## 验证

```sh
npm test
node tests/social-clients.cjs
node tests/module-failure.cjs
npm run rollup
node build-all-static.js
```

`npm test` 运行 ESLint 和 TypeScript 类型检查。`tests/social-clients.cjs` 验证原生实例、方法、监听清理及 GM 存储兼容；`tests/module-failure.cjs` 使用本机 Edge 验证错误日志。两者使用模拟 GM / HTTP，不操作真实账户。测试目录按项目约定被 Git 忽略，脚本只在本地存在时可运行。
真实平台登录状态、网页结构和接口可用性仍需在用户脚本环境中联调。
