# SteamWeb 独立 TS 模块

面向 Tampermonkey 等浏览器用户脚本。入口为 `index.ts`，通过外部项目的 TypeScript 打包器引入，不需要独立 npm 包或运行时第三方依赖。

项目 `src/scripts/social/` 现通过兼容包装接入本目录，详见 [项目接入说明](../../../src/scripts/social/README.md)。模块不依赖 Auto-Task 的日志、国际化、弹窗、jQuery 或全局类型声明。

## 接入

用户脚本需同时匹配任务页面、Steam 商店和社区页面。以下元数据加入外部脚本的最终产物；将 `example.com` 替换为任务站点。

```js
// ==UserScript==
// @name         My Steam Tasks
// @namespace    my-steam-tasks
// @version      1.0.0
// @match        https://example.com/*
// @match        https://store.steampowered.com/*
// @match        https://steamcommunity.com/*
// @connect      store.steampowered.com
// @connect      steamcommunity.com
// @connect      login.steampowered.com
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @run-at       document-end
// @noframes
// ==/UserScript==
```

外部脚本的 TS 入口示例（导入路径按项目位置调整）：

```ts
import SteamWeb, {
  createGMHttpClient,
  handleSteamAuthPage,
  type SteamStatusEvent,
} from './modules/steam/steamWeb';

async function main() {
  const namespace = 'my-script:steam';

  // 同一个用户脚本在新开的 Steam 页面中执行回传处理。
  // 必须放在任务站点判断之前，命名空间必须与 SteamWeb 一致。
  if (await handleSteamAuthPage({ namespace })) return;
  if (location.hostname !== 'example.com') return;

  const steam = new SteamWeb({
    http: createGMHttpClient(GM_xmlhttpRequest),
    namespace,
    autoChangeRegion: true,
    authTimeoutMs: 120_000,
  });

  const unsubscribe = steam.on('status', (event: SteamStatusEvent) => {
    if (event.level === 'debug') return;
    // 外部可按 operationId 更新同一条日志，按 code 映射中文文案。
    console.log(event.operation, event.target, event.phase, event.code);
  });

  try {
    if (!await steam.init('store')) return;
    await steam.addToWishlist('123456');
    await steam.removeFromWishlist('123456');
  } finally {
    // 应在所有业务操作结束后调用；可按返回值判断恢复是否成功。
    await steam.resetArea();
    unsubscribe();
    steam.dispose();
  }
}

void main();
```

独立用户脚本之间的 GM 存储并不共享。因此任务执行端和认证页面端必须属于**同一个用户脚本**，仅安装两个不同脚本并使用同名存储键无法完成回传。页面尚未登录时，处理函数等待登录状态变化或页面跳转；重新加载后的脚本继续处理同一条未过期请求。

## 配置与持久化

| 配置 | 默认值 | 说明 |
| --- | --- | --- |
| `http` | 必填 | 符合 `HttpClient` 的异步请求函数 |
| `gm` | 当前脚本的 `GM_*` API | 可显式注入 GM API，便于不同用户脚本管理器接入 |
| `namespace` | `steamWeb` | 持久化缓存及认证通信前缀 |
| `autoChangeRegion` | `true` | 沿用原功能的地区自动切换；设为 `false` 则跳过自动切换 |
| `authTimeoutMs` | `120000` | 标签页认证等待时间，必须为正的有限数值 |

持久化只通过 GM 完成，不提供 localStorage 或内存存储降级。缓存键为 `<namespace>:cache`；认证临时键为 `<namespace>:auth:<store/community>:pending/reply`，完成后清理。

认证会话和执行中状态由每个实例独立持有；缓存加载后保留实例内工作副本，每次更新写入 GM。独立任务建议使用不同命名空间；相同命名空间可在后续实例复用缓存，但不提供跨实例缓存合并。不要并行启动多个使用相同命名空间的认证流程；已发现未过期流程时会返回 `AUTH_BUSY`。

默认适配 `GM_*`。如需 `GM.*` 异步接口，向 `gm` 传入对应方法的绑定函数，向 `createGMHttpClient` 传入绑定后的 `GM.xmlHttpRequest`；对应 API 仍须由用户脚本管理器支持。

## 公共方法

除事件订阅与 `dispose()` 外，以下方法均返回 `Promise<boolean>`。失败原因从事件获取。

| 功能文件 | 公共方法 | 所需初始化 |
| --- | --- | --- |
| `index.ts` | `init('all' \| 'store' \| 'community')`、`initStore()`、`initCommunity(initStoreResult?)` | 无 |
| `features/groups.ts` | `joinGroup(groupName)`、`leaveGroup(groupName)` | community |
| `features/officialGroups.ts` | `joinOfficialGroup(gameId)`、`leaveOfficialGroup(gameId)` | community |
| `features/wishlist.ts` | `addToWishlist(gameId)`、`removeFromWishlist(gameId)` | store |
| `features/followGame.ts` | `doFollowGame(gameId)` / `undoFollowGame(gameId)` | store |
| `features/forum.ts` | `doForum(gameId)` / `undoForum(gameId)` | community |
| `features/workshop.ts` | `doFavoriteWorkshop(id)` / `undoFavoriteWorkshop(id)`、`voteUpWorkshop(id)` | community |
| `features/curator.ts` | `doCurator(curatorId)` / `undoCurator(curatorId)` | store |
| `features/announcement.ts` | `likeAnnouncement('appid/viewid')` | store |
| `features/licenses.ts` | `addLicense('appid-123')`、`addLicense('subid-123,456')` | store |
| `features/playtest.ts` | `requestPlayTestAccess(appId)` | store |
| `features/region.ts` | `resetArea()` | store |

`do*()` 执行加入/关注/订阅/收藏，`undo*()` 执行对应反向操作。ID 使用字符串。`init('community')` 不强制初始化商店；`init('all')` 要求商店与社区都成功。同一实例的并发商店/社区初始化分别共享正在执行的 Promise。

构造函数不发请求。业务方法要求对应初始化已成功，否则返回 `false` 并触发 `AUTH_REQUIRED`。认证顺序为页面检查、必要的 Token 刷新、标签页回退。与原文件一致，不提供账户密码登录。

`dispose()` 取消当前认证等待、清理订阅，实例之后不可继续使用；它不撤销已完成操作，也不代替 `resetArea()`。正在执行的 HTTP 请求可能已经到达 Steam。

`features/` 与 `auth/` 中导出的函数供模块内部组合，公共接入使用 `index.ts` 的 `SteamWeb` 类。原文件注释中提及但没有实现的方法，不作为本模块 API。

## 状态事件

```ts
const off = steam.on('status', (event) => {
  if (event.phase === 'failure') {
    // 外部决定错误提示、日志格式、重试或 UI 行为。
  }
});
off();
```

| 字段 | 含义 |
| --- | --- |
| `operationId` | 本次操作标识；每次实际执行生成新标识 |
| `parentOperationId` | 子步骤所属操作，如愿望单操作中的地区切换 |
| `operation` | 如 `wishlist.add`、`auth.refreshToken`、`region.resetArea` |
| `phase` | `start`、`progress`、`success`、`failure`、`skipped` |
| `level` | `debug`、`info`、`warning`、`error` |
| `code` | 稳定事件码，供调用方翻译 |
| `target` | AppId、组名等业务目标 |
| `timestamp` | Unix 毫秒时间戳 |
| `details` | 可选的步骤目标、请求方法、HTTP/传输状态码 |

每个已开始操作产生唯一终态，步骤更新始终是 `progress`。子步骤失败后可能由父操作回退恢复成功，因此应根据目标操作的终态判断最终结果。并发初始化复用的实际工作只产生一组初始化事件。取消订阅或 `dispose()` 后不再接收后续事件。

通用事件码：`OPERATION_STARTED`、`OPERATION_COMPLETED`、`OPERATION_FAILED`、`UNEXPECTED_ERROR`、`AUTH_REQUIRED`、`DISPOSED`、`HTTP_REQUEST_STARTED`、`HTTP_REQUEST_COMPLETED`、`REQUEST_OR_RESPONSE_FAILED`、`RETRYING`。

认证事件码包括 `AUTH_WAITING_FOR_PAGE`、`AUTH_UPDATED`、`AUTH_BUSY`、`AUTH_TIMEOUT`、`AUTH_TAB_CLOSED`、`AUTH_TAB_FAILED`、`AUTH_CANCELLED`、`AUTH_CLEANUP_FAILED`、`INVALID_TOKEN_RESPONSE`。业务步骤沿用原翻译键作为事件码，例如 `addingToWishlist`、`owned`、`curatorLimitNotice`、`noSubid`；模块不输出翻译后的文案。

模块不输出 console 日志、不显示弹窗；同步或异步监听器异常都被隔离。事件不会附带认证数据、Cookie、原始请求体/响应体或异常原文。

## HTTP 接口

```ts
import type { HttpClient } from './modules/steam/steamWeb';

const http: HttpClient = async (options) => {
  // 在此调用自己的 GM 封装，并将响应归一化为 HttpResponse。
  // 必须处理超时及失败，使 Promise 最终结束。
  return myNormalizedGMRequest(options);
};

const steam = new SteamWeb({ http });
```

`HttpRequestOptions` 支持 `url`、`method`、`headers`、`data`、`responseType`、`dataType`（兼容别名）、`timeout`、`redirect`。请求体为字符串或 `FormData`。

响应结构保留原请求封装的层次：

```ts
{
  result: 'Success',
  status: 600,              // 传输状态；不是 HTTP 状态码
  statusText: 'Load',
  data: {
    status: 200,            // HTTP 状态码
    statusText: 'OK',
    responseText: '...',
    response: { success: true },
    finalUrl: 'https://store.steampowered.com/...',
    responseHeaders: {},
  },
}
```

`Success` 仅表示收到响应，HTTP 错误和 Steam 业务错误仍由功能模块检查。GM 适配器默认超时 30 秒；状态码为 600 收到响应、601 超时、602 中止、603 网络错误、604 调用/解析错误。它统一响应头名称为小写，支持重复响应头及 JSON 字符串解析。

适配器不自动重试请求，避免超时后重复提交写入。认证逻辑自身有一次刷新重试。Cookie 的携带和响应更新由 GM 请求环境完成；核心模块不写浏览器 Cookie，也不提供全局请求函数。不同管理器对请求头和重定向的支持由实际 GM API 决定。

## 检查与回归测试

在仓库根目录运行，使用现有开发依赖：

```sh
node node_modules/typescript/bin/tsc -p modules/steam/steamWeb/tsconfig.json
node node_modules/eslint/bin/eslint.js --config modules/steam/steamWeb/eslint.config.mjs modules/steam/steamWeb
node --test modules/steam/steamWeb/tests/steamWeb.test.cjs
node modules/steam/steamWeb/tests/run-browser.cjs
```

浏览器测试默认使用 Windows Edge，也可通过 `STEAMWEB_TEST_BROWSER` 指定 Chromium/Edge 可执行文件。浏览器以无界面方式运行，测试页和独立浏览器配置写入系统临时目录。

所有测试使用模拟 GM/Steam 响应，覆盖认证、事件、持久化、错误返回、真实浏览器 DOM 解析和地区恢复，不操作真实 Steam 账户。接口请求及页面匹配规则继承原实现，实际 Steam 网站行为仍需在用户脚本环境中联调。
