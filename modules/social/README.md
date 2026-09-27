# 独立社交模块

统一导入入口为 `modules/social/index.ts`。统一初始化、任务执行及状态监听使用 [`SocialManager`](social/README.md)；各平台也可通过自己的入口单独使用。

| 模块 | 入口与接入说明 |
| --- | --- |
| Social 基类、适配器、整合器 | [social](social/README.md) |
| Steam（管理 SteamWeb/ASF） | [steam](steam/README.md) |
| VK | [vk](vk/README.md) |
| Twitch | [twitch](twitch/README.md) |
| Twitter/X | [twitter](twitter/README.md) |
| Reddit | [reddit](reddit/README.md) |
| YouTube | [youtube](youtube/README.md) |

统一入口使用显式命名导出，避免各模块同名 `HttpClient`、`TaskOptions`、`createGMHttpClient` 等冲突。这些平台专用类型和适配器从各自入口导入。

项目 `src/scripts/social/` 已通过兼容包装使用这些模块，详见[项目接入说明](../../src/scripts/social/README.md)。外部用户脚本也可通过自己的 TS 打包器独立引入模块。

## 执行与撤销

所有平台批量入口统一为 `do(options)` 与 `undo(options)`，参数仅包含目标链接。
`SocialManager` 提供 `do(platform, options)` / `undo(platform, options)` 和 `doAll(options)` / `undoAll(options)`。
旧切换接口及参数类型已删除，不提供兼容别名。结果类型改为 `SocialTaskResult`（Steam / Twitter 同样使用 `Task` 命名）。
构造选项中的 `doTask` / `undoTask` 仍是两套独立的功能开关，不用于选择当前调用的方向。

```ts
await steam.do({ wishlistLinks: ['https://store.steampowered.com/app/123/'] });
await steam.undo({ wishlistLinks: ['https://store.steampowered.com/app/123/'] });
await steamWeb.doFollowGame('123');
await steamWeb.undoFollowGame('123');
```

同类操作继续共用功能文件及内部请求逻辑；公开单项接口使用 `doX` / `undoX`。
已有明确语义的 `joinGroup` / `leaveGroup`、`addToWishlist` / `removeFromWishlist` 等方法保留。
许可证、试玩申请等不可撤销操作不会新增虚假的反向接口。
