# Twitter 独立 TS 模块

面向 Tampermonkey 等浏览器用户脚本。将此目录复制到外部项目，通过 `index.ts` 引入并打包即可。运行时不依赖 Auto-Task、Social 基类、jQuery、全局配置、其他独立模块或第三方 npm 包。

项目 `src/scripts/social/` 现通过兼容包装接入本目录，详见 [项目接入说明](../../src/scripts/social/README.md)。默认接口标识、浏览器 Bearer 和事务 ID 算法沿用源文件；没有对真实 X 账户执行测试或验证这些接口当前是否可用。

## 接入示例

将以下授权添加到最终用户脚本元数据中，`example.com` 替换为任务站点：

```js
// ==UserScript==
// @name         My Twitter Tasks
// @namespace    my-twitter-tasks
// @version      1.0.0
// @match        https://example.com/*
// @connect      x.com
// @connect      raw.githubusercontent.com
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_cookie
// @run-at       document-end
// @noframes
// ==/UserScript==
```

```ts
import Twitter, { createGMHttpClient } from './modules/twitter';

async function main() {
  const twitter = new Twitter({
    http: createGMHttpClient(GM_xmlhttpRequest),
    namespace: 'my-script:twitter',
    verifyId: '783214',
    taskDelayMs: 1000,
    doTask: { users: true, retweets: true },
    undoTask: { users: true, retweets: true },
  });

  const unsubscribe = twitter.on('status', (event) => {
    if (event.level === 'debug') return;
    console.log(event.operationId, event.operation, event.target, event.phase, event.code);
  });

  try {
    if (!await twitter.init()) return;
    const result = await twitter.do({
      userLinks: ['https://x.com/example'],
      retweetLinks: ['https://x.com/example/status/123456'],
    });
    if (result && typeof result === 'object') {
      console.log(result.success, result.results);
    }
  } finally {
    unsubscribe();
    twitter.dispose();
  }
}
void main();
```

**`init()` 沿用原来的验证方式，会尝试关注 `verifyId` 指定的账号。** 默认值为源配置中的 `783214`；可以显式传入自己的账号 ID。验证产生的关注不会记入 `tasks.users`，也不会自动撤销。

认证通过 `GM_cookie.list` 读取 `https://x.com/settings/account` 对应的登录 Cookie。源文件实际没有自动打开 X 页面获取 Cookie 的逻辑，因此本模块也不提供 Steam 式标签页回传；没有登录时返回 `AUTH_REQUIRED`，需要在浏览器登录后再次 `init()`。Cookie API 不可用、返回错误或超时也会返回失败。

## 目录

```text
index.ts                  主入口、初始化和公共方法
types.ts                  独立类型
context.ts / events.ts    实例状态和事件
defaults.ts               接口默认配置
cache.ts                  用户 ID 的 GM 缓存
requests.ts               请求签名与一次 CSRF 刷新重试
auth/cookies.ts           Cookie 读取、凭证更新
auth/verify.ts            凭证验证
auth/initialization.ts    初始化流程
features/users.ts        用户 ID 查询、关注与取关
features/retweets.ts      转推与撤销转推
features/tasks.ts         批量任务、配置开关、逐项结果
transaction/index.ts      事务 ID 字典加载及生成器工厂
transaction/encode.ts     从原 XTID 迁入的本地编码算法
adapters/gmHttp.ts        GM HTTP 适配器
adapters/gmStorage.ts     GM 存储与 Cookie API 绑定
utils/links.ts            X/Twitter 链接解析
tests/twitter.test.cjs    模拟回归测试
```

## 公共 API

| 方法或属性 | 说明 |
| --- | --- |
| `new Twitter(options)` | 必须传入 `http`；构造时不读存储、不发请求 |
| `init(): Promise<boolean>` | 读取 GM 缓存/白名单、读取 Cookie、准备事务 ID、验证凭证；并发初始化共享 Promise |
| `userName2id(name): Promise<string \| false>` | 保留原方法，支持 `@name`，缓存按小写用户名索引；先初始化 |
| `do({ userLinks, retweetLinks })` / `undo({ userLinks, retweetLinks })` | 保留逐链接结果结构，执行使用 `do()`，撤销使用 `undo()` |
| `tasks` | `{ users, retweets, likes }`；成功执行的任务记录，去重；验证关注除外 |
| `whiteList` | 保留可读写属性；初始化后可以直接调整当前实例白名单 |
| `doUser(name)` / `undoUser(name)` | 新开放的单用户操作，返回 `Promise<boolean>` |
| `doRetweet(id)` / `undoRetweet(id)` | 新开放的单推文操作，返回 `Promise<boolean>` |
| `setWhiteList(partial): Promise<boolean>` | 合并白名单并写入 GM，后续实例可读取 |
| `on('status', listener)` | 返回取消订阅函数 |
| `dispose()` | 结束 Cookie/批量延时等待、清理监听器；实例不能再执行任务 |

`do()` / `undo()` 返回 `false`（未初始化/异常等）或 `{ success, results: { userLinks?: { [原链接]: boolean }, retweetLinks?: { [原链接]: boolean } } }`。单项失败会使整体 `success` 为 `false`，不会中断剩余链接。配置禁用的操作、撤销时命中白名单的操作按原行为记为 `true`，同时产生 `skipped` 事件。

任务记录与原实现一致：只记录成功添加的用户和转推，撤销操作不删除记录，撤销批次只处理显式传入的链接。`likes` 仅保留数据字段；原文件没有点赞实现。

## 配置

| 参数 | 默认值 | 用途 |
| --- | --- | --- |
| `http` | 必填 | `HttpClient`，可用本模块 `createGMHttpClient(GM_xmlhttpRequest)` |
| `gm` | 当前脚本 GM API | 可注入 `getValue/setValue/deleteValue/listCookies` |
| `namespace` | `twitter` | GM 存储前缀 |
| `verifyId` | `783214` | 初始化时尝试关注的验证账号 |
| `doTask / undoTask` | users、retweets 均为 true | 替代原 `globalOptions`，控制批量任务；直接单项方法不受批量开关限制 |
| `whiteList` | GM 已保存白名单或空数组 | 覆盖传入的类别，并在初始化时持久化；未传类别保留已有值 |
| `taskDelayMs` | `1000` | 批量任务有效链接执行后的间隔，0 表示不等待 |
| `cookieTimeoutMs` | `30000` | Cookie API 的等待上限 |
| `getTransactionId` | 内置生成器 | 注入 `(method, path) => Promise<string>`，完全替代字典下载及内置生成 |
| `transactionPairsUrl` | 源文件的 GitHub raw 字典地址 | 自定义事务 ID 配对数据地址 |
| `api` | 源文件的接口参数 | 可覆盖 Bearer、GraphQL query ID、用户查询 features/fieldToggles |

只使用 GM 持久化，键为 `<namespace>:auth`、`<namespace>:cache`、`<namespace>:whiteList`。不读取或覆盖原脚本的 `twitterAuth/twitterCache/whiteList`，不提供 localStorage 或内存存储降级。任务记录、事件及执行状态保留在当前实例；初始化每次从 Cookie 更新凭证，GM 中保存的旧 Token 不直接视为已认证。不同并发实例建议使用不同命名空间。

直接赋值 `whiteList` 只修改当前实例；需要保存时使用 `setWhiteList()`。直接修改数组建议在 `init()` 完成后进行，因为初始化需要加载持久化数据。

## HTTP 与事务 ID

请求及响应类型与 SteamWeb 的注入形式一致，但本模块自带类型和适配器，不依赖 Steam 模块。`HttpResponse.result = 'Success'` 仅表示收到响应；`status = 600` 是传输状态，`data.status` 才是 HTTP 状态码。

GM 适配器默认超时 30 秒，解析 JSON、规范化响应头大小写并保留重复 `set-cookie`。601/602/603/604 分别表示超时/中止/网络错误/调用或解析错误。适配器不自动重试写入。

只有明确收到 HTTP 403、API 错误码 353 且响应 Cookie 包含新 `ct0` 时，请求层才进行一次重试；它先同步 GM 存储和内存凭证，再重新生成事务 ID 和请求头。凭证验证失败后初始化最多重新读取一次 Cookie，并再次验证，不能仅凭 Cookie 存在就初始化成功。

默认事务 ID 字典通过**同一个注入 HTTP 函数**读取，替代原来的直接 `fetch`。字典只作为 JSON 数据解析，编码在本地执行。使用外部生成器时可去掉 `raw.githubusercontent.com` 的 `@connect`。如更改字典地址，应相应调整用户脚本授权。

## 事件与日志

`operationId` 关联同一次操作，`parentOperationId` 关联批量任务、认证和查询子步骤；`target` 为用户名、推文 ID 或链接。

每次开始的操作都有一个终态：`success`、`failure` 或 `skipped`；其他事件是 `start` 或 `progress`。常用 `operation` 为 `init`、`auth.cookies`、`auth.verify`、`users.lookup/follow/unfollow`、`retweets.create/delete`、`tasks.do` / `tasks.undo`。

常用 `code`：`AUTH_REQUIRED`、`COOKIE_API_UNAVAILABLE`、`COOKIE_READ_FAILED`、`COOKIE_TIMEOUT`、`AUTH_RETRYING`、`CSRF_REFRESHED`、`RETRYING`、`INVALID_USERNAME`、`INVALID_TWEET_ID`、`INVALID_LINK`、`WHITELIST_SKIP`、`OPTION_DISABLED`、`REQUEST_OR_RESPONSE_FAILED`、`UNEXPECTED_ERROR`、`DISPOSED`。

模块不输出 console 日志、不弹窗。外部按 `code` 映射中文文案，并根据 `phase/level` 决定显示方式。事件仅携带业务目标和状态码，不携带 Cookie、Bearer、CSRF Token、事务 ID、原始请求/响应或异常原文。监听器抛错或返回被拒绝的 Promise 不影响业务结果。

## 验证

在仓库根目录运行，使用现有开发依赖，无需安装新依赖：

```sh
node node_modules/typescript/bin/tsc -p modules/twitter/tsconfig.json
node node_modules/eslint/bin/eslint.js --config modules/twitter/eslint.config.mjs modules/twitter
node --test modules/twitter/tests/twitter.test.cjs
```

测试全部使用模拟 GM/HTTP 和本地编码数据，不关注真实账号、不转发真实推文。实际接口及用户脚本管理器的 Cookie 支持需在目标环境联调。
