# SteamASF 独立 TS 模块

面向 Tampermonkey 等浏览器用户脚本的 ASF IPC 客户端。将此目录复制到其他项目后，通过打包器引入 `index.ts` 即可使用。没有运行时第三方依赖，也不依赖 `steamWeb`、Auto-Task 日志/国际化/弹窗或项目全局类型。

项目 `src/scripts/social/` 现通过兼容包装接入本目录，详见 [项目接入说明](../../../src/scripts/social/README.md)。本模块继承原文件使用的 ASF 命令；服务端仍须支持这些命令及原实现所识别的回复格式。ASF IPC 认证通过 `Authentication` 请求头完成，不需要 SteamWeb 的开页认证流程。

## 接入示例

用户脚本最终产物需包含以下权限，将任务站点和 IPC 主机改为实际地址：

```js
// ==UserScript==
// @name         My ASF Tasks
// @namespace    my-asf-tasks
// @version      1.0.0
// @match        https://example.com/*
// @connect      127.0.0.1
// @connect      store.steampowered.com
// @connect      api.steampowered.com
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-end
// @noframes
// ==/UserScript==
```

```ts
import SteamASF, { createGMHttpClient } from './modules/social/steam/steamASF';

async function main() {
  const asf = new SteamASF({
    AsfIpcUrl: 'http://127.0.0.1:1242',
    AsfIpcPassword: 'your-ipc-password',
    AsfBotname: 'YourBot',
    steamWebApiKey: '', // 仅 checkPlayStatus 需要，可省略
    http: createGMHttpClient(GM_xmlhttpRequest),
    namespace: 'my-script:asf',
  });

  const unsubscribe = asf.on('status', (event) => {
    if (event.level === 'debug') return;
    console.log(event.operation, event.target, event.phase, event.code);
  });

  try {
    if (!await asf.init()) return;
    await asf.addToWishlist('123456');
    await asf.removeFromWishlist('123456');
  } finally {
    unsubscribe();
    asf.dispose();
  }
}

void main();
```

原构造参数名称保持不变，新增必填 `http`，可选 `gm` 和 `namespace`。`AsfBotname` 为空时沿用默认 `asf`。建议对需要明确账户身份的查询使用单个机器人名称。构造函数仅检查配置，不发送请求；`init()` 使用 `!stats` 检查 IPC，重复初始化复用成功状态，并发初始化共享 Promise。

与原实现一致，业务方法不强制要求先执行 `init()`；建议调用方先初始化以便及时发现连接问题。配置 URL 无效时构造函数抛出异常；运行时错误通过事件报告并返回相应失败值。

## 功能拆分与公共 API

| 文件 | 公共方法 | 返回值 |
| --- | --- | --- |
| `features/initialization.ts` | `init()` | `Promise<boolean>` |
| `features/groups.ts` | `joinGroup(groupName)`、`leaveGroup(groupName)`；保留 `joinOfficialGroup`、`leaveOfficialGroup` 原别名 | `Promise<boolean>` |
| `features/wishlist.ts` | `addToWishlist(gameId)`、`removeFromWishlist(gameId)` | `Promise<boolean>` |
| `features/followGame.ts` | `doFollowGame(gameId)` / `undoFollowGame(gameId)` | `Promise<boolean>` |
| `features/curator.ts` | `doCurator(curatorId)` / `undoCurator(curatorId)` | `Promise<boolean>` |
| `features/licenses.ts` | `addLicense('appid-12,34')`、`addLicense('subid-12,34')` | `Promise<boolean>` |
| `features/playtest.ts` | `requestPlayTestAccess(appId)` | `Promise<boolean>` |
| `features/playGames.ts` | `playGames('12,34')`、`stopPlayGames()` | `Promise<boolean>` |
| `features/playGames.ts` | `checkPlayStatus('12,34')` | `Promise<boolean \| 'skip'>` |
| `features/identity.ts` | `getSteamIdASF()`、`getSteamIdWeb()`、`getSteamId()` | `Promise<string>`，失败为空字符串 |
| `features/unsupported.ts` | `doForum()` / `undoForum()`、`doFavoriteWorkshop()` / `undoFavoriteWorkshop()`、`voteUpWorkshop()`、`likeAnnouncement()` | 始终返回 `false` 并发出 `ASF_UNSUPPORTED` |

`features/gameStatus.ts` 单独处理 `!CHECK`；`commands.ts` 处理共用命令结果判断；`cache.ts` 负责组 ID 缓存。入口类组合各功能，外部从 `index.ts` 使用。

`dispose()` 清理事件订阅并拒绝后续操作，不发送 `!resume`、不停止 ASF 中已经开始的游戏，也不撤销已发送命令。如需停止挂时长，先显式调用 `stopPlayGames()`。

## HTTP 与存储

`http` 为注入的 `HttpClient`。模块自带独立 `createGMHttpClient`，也可使用符合相同接口的已有 GM 请求封装。其请求/响应接口与 SteamWeb 模块兼容，可让两个客户端使用同一个请求函数。

请求选项支持 URL、GET/POST、请求头、字符串或 FormData 请求体、`responseType`、兼容别名 `dataType`、超时和重定向。响应结构：

```ts
{
  result: 'Success',
  status: 600,             // 传输状态
  statusText: 'Load',
  data: {
    status: 200,           // HTTP 状态
    statusText: 'OK',
    response: { Success: true, Message: 'OK', Result: '...' },
    responseText: '...',
    responseHeaders: {},
    finalUrl: 'http://127.0.0.1:1242/Api/Command/',
  },
}
```

GM 适配器默认超时 30 秒，不自动重试写操作。600 表示收到响应，601 超时，602 中止，603 网络错误，604 调用/解析错误。`result: 'Success'` 不代表业务成功；模块还检查 HTTP 状态、ASF 的 `Success`/`Message`/`Result` 及命令回复。

自定义请求函数须负责归一化响应及确保超时后结束 Promise。模块不会通过全局变量寻找 `httpRequest`，也不会调用原项目的请求工具。若使用 `GM.*` 异步 API，可注入绑定后的 API 方法。

组 ID 缓存只使用 GM 持久化，默认 `namespace` 为 `steamASF`。存储键还包含编码后的 IPC 命令地址与机器人名称；不会持久化 IPC 密码或 Steam API Key。缓存读取失败直接报告失败，不降级到 localStorage 或纯内存。查询得到的组映射写入 GM，加入/退出组后清理旧映射，缓存缺少目标时重新获取组列表。

## 状态事件

```ts
const off = asf.on('status', (event) => {
  // 使用 operationId 更新日志，使用 parentOperationId 关联子步骤。
  // 文案翻译、弹窗和日志持久化由外部脚本处理。
});
off();
```

事件类型为 `ASFStatusEvent`，字段与 SteamWeb 的事件结构一致：

- `operationId`、可选 `parentOperationId`：本次操作及父操作标识。
- `operation`：如 `wishlist.add`、`play.check`、`groups.resolveId`。
- `phase`：`start`、`progress`、`success`、`failure`、`skipped`。
- `level`：`debug`、`info`、`warning`、`error`。
- `code`：稳定事件码。
- `target`、`timestamp`、`details`：业务目标、毫秒时间戳和可选状态信息。

每个实际开始的操作都有唯一终态，子步骤失败不必然导致父操作失败，例如 `!CHECK` 不可用时仍会尝试愿望单命令。有效的“当前未运行游戏”返回 `false`，但事件终态是 `success`；请求或解析失败也返回 `false`，其事件终态为 `failure`。未设置 API Key 或无法确定单个机器人身份时返回 `'skip'`，终态为 `skipped`。

常用事件码：`OPERATION_STARTED`、`OPERATION_COMPLETED`、`OPERATION_FAILED`、`OPERATION_SKIPPED`、`TRANSPORT_FAILED`、`HTTP_FAILED`、`ASF_COMMAND_FAILED`、`ASF_RESULT_REJECTED`、`INVALID_ARGUMENT`、`INVALID_GAME_STATUS`、`ALREADY_SATISFIED`、`LICENSE_ADDED`、`LICENSE_FAILED`、`API_KEY_MISSING`、`BOT_ID_UNAVAILABLE`、`GAME_PLAYING`、`GAME_NOT_PLAYING`、`PLAYER_STATUS_UNAVAILABLE`、`ASF_UNSUPPORTED`、`DISPOSED`。

模块不输出日志、不显示弹窗；同步和异步监听器异常均被隔离。事件不附带 IPC 密码、API Key、完整 URL、原始请求/响应或异常原文。

## 与原实现相比修正的行为

- 批量许可证逐个验证，任何目标失败或缺少结果都返回 `false`，不再因某一行成功就判定整批成功。
- ID 比较使用完整数字标识，避免 `12` 误匹配 `123`；非法参数不发送命令。
- 未识别的 `!CHECK` 状态不作为“已经完成”的依据。
- ASF HTTP/封装失败不能被 `Result` 中的成功词覆盖。
- `checkPlayStatus` 解析玩家 JSON，只比较目标机器人的 `gameid`，不再匹配整个响应中的任意数字，也不使用浏览器的其他登录账号。
- 公开的 `getSteamId()` 仍保持 Web 优先、ASF 回退；ASF ID 回复不合法或包含多个不同 ID 时返回空字符串。

## 验证

在仓库根目录使用现有开发依赖运行：

```sh
node node_modules/typescript/bin/tsc -p modules/social/steam/steamASF/tsconfig.json
node node_modules/eslint/bin/eslint.js --config modules/social/steam/steamASF/eslint.config.mjs modules/social/steam/steamASF
node --test modules/social/steam/steamASF/tests/steamASF.test.cjs
```

测试使用模拟 HTTP/GM 响应，不连接真实 ASF，不操作 Steam 账户。命令回复的语言及格式仍需与实际 ASF 环境联调。
