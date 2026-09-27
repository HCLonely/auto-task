# 项目社交模块接入

`src/scripts/social/` 是项目兼容层，平台请求与任务实现位于根目录 `modules/`。
网站分派器继续使用 `new Steam()`、`new Vk()` 等原有入口及 `init()` / `do()` / `undo()`；
返回值仍为布尔值或包含 `success`、逐链接 `results` 的对象。

- `Social.ts` 的 `ProjectSocial` 继承独立 `SocialAdapter`，接入状态监听并统一释放资源；默认导出保留给尚未迁移、当前禁用的 Instagram。
- Steam、VK、Twitch、Twitter、Reddit、YouTube 包装负责传入项目配置和各模块提供的 GM HTTP 适配器。SteamWeb、SteamASF 保留兼容入口。
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
npx tsc --noEmit
npm test
npm run rollup
node build-all-static.js
```

`npm test` 包含 ESLint、模块测试以及项目桥接测试。测试使用模拟 GM / HTTP，不操作真实账户。
真实平台登录状态、网页结构和接口可用性仍需在用户脚本环境中联调。
