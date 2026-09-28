# Reddit 独立 TS 模块

面向 Tampermonkey 等浏览器用户脚本。通过 `index.ts` 引入，由外部项目打包为用户脚本；没有运行时第三方依赖，也不依赖 SteamWeb 模块。

项目 `src/scripts/social/` 现通过兼容包装接入本目录，详见 [项目接入说明](../../../scripts/social/README.md)。模块替代了原来的 `Social`、`globalOptions`、日志、国际化及错误弹窗依赖。

## 接入示例

将以下权限加入外部脚本最终产物的元数据，`@match` 使用实际任务站点：

```js
// ==UserScript==
// @name         My Reddit Tasks
// @namespace    my-reddit-tasks
// @version      1.0.0
// @match        https://example.com/*
// @connect      www.reddit.com
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @noframes
// ==/UserScript==
```

```ts
import Reddit, { createGMHttpClient } from './src/modules/social/reddit';

async function main() {
  const reddit = new Reddit({
    http: createGMHttpClient(GM_xmlhttpRequest),
    namespace: 'my-script:reddit',
    doTaskEnabled: true,
    undoTaskEnabled: true,
    intervalMs: 1000,
  });

  const off = reddit.on('status', (event) => {
    if (event.level === 'debug') return;
    // 外部负责按 code 翻译，并按 operationId 更新日志。
    console.log(event.operation, event.target, event.phase, event.code);
  });

  try {
    if (!await reddit.init()) return;

    // subreddit 使用名称，用户使用 u_用户名；只阻止取消操作。
    await reddit.setWhiteList({ reddits: ['keep_this_subreddit', 'u_keep_this_user'] });

    const result = await reddit.do({
      redditLinks: [
        'https://www.reddit.com/r/example/',
        'https://www.reddit.com/user/example_user/',
      ],
    });

    if (typeof result !== 'boolean') {
      console.log(result.success, result.results.redditLinks);
    }

    // 取订/取关使用 undo()，传入相同链接。
  } finally {
    off();
    reddit.dispose();
  }
}

void main();
```

原 Reddit 实现当前仅通过 `GM_cookie.list` 读取 `csrf_token`，没有调用打开认证标签页的流程。本模块沿用这一方式，不需要 SteamWeb 那样的页面回传函数。浏览器应已有 Reddit 会话；取得 CSRF Token 只是请求前提，不代表已验证登录成功，最终仍检查业务响应。

用户脚本管理器必须提供 Cookie API。默认 Cookie 读取最长等待 10 秒；不支持、缺少 Token、回调错误或超时都会使 `init()` 返回 `false`。不会改用 `document.cookie`，不会自动打开登录页。

## 目录

```text
index.ts                 Reddit 类、初始化、公共接口
types.ts                 完整独立类型，不依赖项目全局声明
context.ts               实例状态、事件关联、请求调用
events.ts                状态订阅及监听器异常隔离
whiteList.ts             GM 白名单加载和保存
auth/session.ts          CSRF Token 获取
features/subreddit.ts    查询版块 ID、订阅与取消订阅
features/user.ts         查询用户 ID、关注与取消关注
features/graphql.ts      共同的 GraphQL 请求和结果检查
features/tasks.ts       链接批处理、白名单、结果汇总
utils/links.ts           Reddit 链接解析
adapters/gmHttp.ts       可选的 GM 请求适配器
adapters/gmCookie.ts     GM Cookie 读取适配器
adapters/gmStorage.ts    GM 持久化适配器
tests/                   模拟测试和真实浏览器 DOM 测试
```

## 配置与公共 API

| 配置 | 默认值 | 用途 |
| --- | --- | --- |
| `http` | 必填 | 外部注入的 `HttpClient`，可使用 `createGMHttpClient()` |
| `gm` | 当前脚本的 `GM_getValue/GM_setValue` | GM 持久化 API |
| `cookies` | GM Cookie 读取适配器 | 可注入基于管理器 Cookie API 的 `CookieReader` |
| `namespace` | `reddit` | GM 存储键前缀 |
| `cookieTimeoutMs` | `10000` | 默认 Cookie 适配器的超时，自定义读取器自行负责超时 |
| `intervalMs` | `1000` | 同一批任务的项目间等待时间，可设为 0 |
| `doTaskEnabled` | `true` | 原 `globalOptions.doTask.reddit.reddits` 的替代项 |
| `undoTaskEnabled` | `true` | 原 `globalOptions.undoTask.reddit.reddits` 的替代项 |

`init(): Promise<boolean>`：从 GM 载入白名单并获取 Token；并发调用共享同一次初始化。构造实例不发请求。初始化成功后再次调用直接返回成功；登录会话变更后可创建新实例重新获取 Token。

`do({ redditLinks = [] }): Promise<SocialTaskResult>` / `undo({ redditLinks = [] }): Promise<SocialTaskResult>`：保留返回值风格。未初始化、已释放或参数异常返回 `false`；正常批处理返回：

```ts
{
  success: true, // 所有项目成功或按配置/白名单跳过
  results: {
    redditLinks: {
      'https://www.reddit.com/r/example/': true,
    },
  },
}
```

空批次返回 `{ success: true, results: {} }`。部分失败仍继续处理其余项目，聚合 `success` 为 `false`。关闭对应执行开关时保持原行为，将输入链接标记为成功跳过。

同一实例的批次排队执行，批次内串行处理、项目间等待；完全相同的重复链接在该批次只执行一次。支持 `www.reddit.com`、`reddit.com`、`old.reddit.com` 的 `/r/`、`/user/`、`/u/` 链接；查询参数不进入名称。其他域名、非法协议和空名称返回失败。

`tasks: RedditTasks`：保留可读写属性，记录本实例成功执行加入/关注的任务名称。与原实现一致，取消操作不删除历史记录，不把它当成当前订阅列表；`redditLinks: []` 不会自动撤销历史任务。

`whiteList: RedditTasks`：初始化时从 `<namespace>:whiteList` 加载。保留可读写属性，直接赋值/修改仅改变当前实例；需要持久化时调用 `await setWhiteList({ reddits: [...] })`，返回 `Promise<boolean>`。建议在 `init()` 后调整，避免初始化加载覆盖尚未保存的修改。白名单匹配不区分大小写，用户使用 `u_` 前缀。

持久化只用 GM，不提供 localStorage 或内存存储降级。任务历史、Token 和执行状态是实例内运行状态，不写入 GM。新模块不读取原 Auto-Task 的共享 `whiteList` 键；需要迁移时，外部脚本自行读取 `whiteList.reddit`，在初始化后交给 `setWhiteList()`。不同用户脚本的 GM 存储彼此独立；并行的独立实例建议采用不同命名空间。

`on('status', listener)`：注册监听器并返回取消订阅函数。

`dispose()`：释放订阅、结束任务间等待、阻止后续请求，并清空实例 Token。已提交的 HTTP 请求不会被撤销；正在读取 Cookie 时等待适配器正常结束或超时。

## 状态事件

| 字段 | 说明 |
| --- | --- |
| `operationId` | 每次实际执行的唯一标识 |
| `parentOperationId` | 所属父操作，例如批次中的订阅操作 |
| `operation` | `init`、`auth.session`、`do` / `undo`、`subreddit.subscribe`、`subreddit.unsubscribe`、`user.follow`、`user.unfollow`、`subreddit.getId`、`user.getId`、`whiteList.save` |
| `phase` | `start`、`progress`、`success`、`failure`、`skipped` |
| `level` | `debug`、`info`、`warning`、`error` |
| `code` | 稳定事件码，供外部翻译 |
| `target` | 版块名或用户任务名 |
| `timestamp` | Unix 毫秒时间戳 |
| `details` | 可选请求方法、HTTP 和传输状态码 |

每个开始操作有唯一终态；步骤更新使用 `progress`。父操作可以在子操作失败后继续处理其他链接，最终以父操作终态及 `do()` / `undo()` 返回的逐项结果为准。取消订阅或释放实例后不再收到后续事件。

常用事件码：`AUTH_REQUIRED`、`CSRF_TOKEN_MISSING`、`COOKIE_READ_FAILED`、`INITIALIZATION_FAILED`、`CONFIG_SKIPPED`、`WHITELIST_SKIPPED`、`WHITELIST_SAVE_FAILED`、`INVALID_LINK`、`INVALID_ARGUMENT`、`LOOKUP_FAILED`、`SUBREDDIT_ID_MISSING`、`USER_ID_MISSING`、`REQUEST_FAILED`、`HTTP_ERROR`、`GRAPHQL_ERROR`、`MUTATION_NOT_CONFIRMED`、`DISPOSED`。

通用生命周期使用 `OPERATION_STARTED`、`OPERATION_COMPLETED`、`OPERATION_SKIPPED`、`OPERATION_FAILED`；请求过程使用 `HTTP_REQUEST_STARTED/COMPLETED`。模块不输出日志或弹窗，监听器同步抛错/异步拒绝不会改变业务结果；事件不携带 Cookie、Token、请求体、响应原文或异常原文。

## HTTP 与 Cookie 注入

`http` 采用与 SteamWeb 同样的请求结构，但实现和类型均位于本模块内，可以单独复制使用。支持 GET/POST、请求头、字符串或 FormData 请求体、JSON/文本响应、超时和重定向选项。

```ts
import Reddit, { createGMHttpClient, createGMCookieReader } from './src/modules/social/reddit';

const reddit = new Reddit({
  http: createGMHttpClient(GM_xmlhttpRequest),
  cookies: createGMCookieReader((details, callback) => GM_cookie.list(details, callback)),
});
```

也可以传入已有 GM 封装，只需符合 `HttpClient`：返回 `result`、传输 `status/statusText` 以及 `data` 中的 HTTP `status/statusText`、`responseText`、已解析的 `response`、`finalUrl`、`responseHeaders`。`result: 'Success'` 只代表收到响应，不代表 HTTP 或业务成功。注入函数必须最终结束 Promise，并自行实现超时。

内置 GM 请求默认超时 30 秒，不自动重试写入。传输状态码：600 收到响应、601 超时、602 中止、603 网络错误、604 调用或解析错误。文本请求省略 GM 的 `responseType`，JSON 请求显式指定 `json`。

本次同时修复了原代码中 `ok` 判断反向、GraphQL 请求未指定 JSON 响应、缺少用户 ID 仍可能提交、用非文本字段解析 HTML 等问题。成功须有对应 mutation 的 `ok === true` 且没有 GraphQL 错误；未知响应结构返回失败，不把 HTTP 200 当作成功。

## 验证

在仓库根目录使用现有开发依赖运行：

```sh
node node_modules/typescript/bin/tsc -p src/modules/social/reddit/tsconfig.json
node node_modules/eslint/bin/eslint.js --config src/modules/social/reddit/eslint.config.mjs src/modules/social/reddit
node --test src/modules/social/reddit/tests/reddit.test.cjs
node src/modules/social/reddit/tests/run-browser.cjs
```

浏览器测试默认使用 Windows Edge，可通过 `REDDIT_TEST_BROWSER` 指定 Chromium/Edge。测试以无界面模式运行，临时页面和独立配置存放在系统临时目录。所有测试模拟 GM/Reddit 响应，不向真实账户执行操作；真实 Reddit 接口和用户脚本环境仍需联调。
