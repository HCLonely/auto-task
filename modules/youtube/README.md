# Youtube 独立 TS 模块

面向 Tampermonkey 等浏览器用户脚本，入口为 `index.ts`。通过调用方的 TS 打包器引入，没有运行时第三方依赖，不引用项目原文件或 Steam 模块。

项目 `src/scripts/social/` 现通过兼容包装接入本目录，详见 [项目接入说明](../../src/scripts/social/README.md)。模块保留 `Youtube` 命名导出、`init()`、`do()` / `undo()`、独立 `getInfo()`、`tasks` 和 `whiteList`，并提供默认导出。

**认证行为沿用原实现：`init()` 通过尝试订阅验证频道检查凭证，可能实际订阅该频道。** 默认验证频道沿用原配置 `UCrXUsMBcfTVqwAS7DKg9C0Q`，可通过 `verifyChannel` 改为自己的频道。验证操作不计入任务记录。该模块没有自动打开认证标签页的流程；原 YouTube 实现使用 `GM_cookie.list` 获取凭证。

## 接入示例

在最终用户脚本中配置以下权限，将任务站点替换为实际站点：

```js
// ==UserScript==
// @name         My YouTube Tasks
// @namespace    my-youtube-tasks
// @version      1.0.0
// @match        https://example.com/*
// @match        https://www.youtube.com/*
// @connect      www.youtube.com
// @connect      accounts.google.com
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_cookie
// @run-at       document-end
// ==/UserScript==
```

```ts
import Youtube, { createGMHttpClient } from './modules/youtube';

async function main() {
  // YouTube 的匹配用于 Cookie API 权限，任务仅在目标站点启动。
  if (location.hostname !== 'example.com') return;
  const youtube = new Youtube({
    http: createGMHttpClient(GM_xmlhttpRequest),
    namespace: 'my-script:youtube',
    verifyChannel: '你的频道ID',
    doTask: { channels: true, likes: true },
    undoTask: { channels: true, likes: true },
    taskDelayMs: 1000,
  });

  const unsubscribe = youtube.on('status', (event) => {
    if (event.level === 'debug') return;
    // 外部负责中文文案、日志展示和更新；模块本身不输出日志。
    console.log(event.operation, event.target, event.phase, event.code);
  });

  try {
    if (!await youtube.init()) return;
    const result = await youtube.do({
      channelLinks: ['https://www.youtube.com/channel/目标频道ID'],
      videoLinks: ['https://www.youtube.com/watch?v=目标视频ID'],
    });
    console.log(result);
  } finally {
    unsubscribe();
    youtube.dispose();
  }
}

void main();
```

需要浏览器已有 YouTube 登录状态，以及用户脚本管理器支持读取 `__Secure-3PAPISID` 的 Cookie API。管理器没有对应能力时，注入 `cookies` 适配函数；失败会返回 `false` 和事件，不降级使用 `document.cookie`。

## 目录与职责

```text
index.ts                 类入口、初始化编排、公共导出
types.ts                 请求、配置、事件和返回值类型
context.ts               实例状态及操作生命周期
events.ts                事件订阅与异常隔离
auth/cookies.ts          更新 Cookie 凭证
auth/verify.ts           验证凭证
auth/signature.ts        SAPISIDHASH 签名与请求上下文
features/info.ts         获取及解析频道/视频页面参数
features/channels.ts     订阅、取消订阅
features/videos.ts       点赞、取消点赞
features/batch.ts        任务开关、批量调度、逐链接结果
adapters/gmHttp.ts       可独立使用的 GM HTTP 适配器
adapters/gmStorage.ts    GM 持久化
adapters/gmCookies.ts    GM Cookie 回调适配与超时
utils/links.ts           YouTube 链接规范化
utils/json.ts            页面嵌套 JSON 提取，不执行页面脚本
```

## 配置

| 配置 | 默认值 | 说明 |
| --- | --- | --- |
| `http` | 必填 | 异步 `HttpClient`；推荐 `createGMHttpClient(GM_xmlhttpRequest)` |
| `gm` | 当前脚本的 `GM_*` | 可注入同步或异步的 `getValue/setValue/deleteValue` |
| `cookies` | GM Cookie 适配器 | `(url) => Promise<Cookie[]>` |
| `sha1` | Web Crypto | 可注入同步或异步 SHA-1 函数，返回 40 位十六进制摘要 |
| `namespace` | `youtube` | GM 存储前缀 |
| `verifyChannel` | 原 YouTube 官方验证频道 ID | 支持频道 ID 或 HTTPS YouTube 频道链接 |
| `whiteList` | GM 中保存的白名单 | `{ channels: 频道ID[], likes: 视频ID[] }`；构造参数优先 |
| `doTask` / `undoTask` | 两类任务均启用 | `{ channels: boolean, likes: boolean }`，分别控制执行和撤销 |
| `taskDelayMs` | `1000` | 批量任务启动间隔；保持原来的间隔启动、允许请求重叠行为 |
| `cookieTimeoutMs` | `30000` | 默认 GM Cookie 适配器的超时时间 |

认证保存到 `<namespace>:auth`，白名单保存到 `<namespace>:whiteList`。失效认证先删除，新认证验证成功后再保存。GM 持久化失败不会退回内存或 localStorage。旧项目中的 `youtubeAuth` 和全局 `whiteList` 不会被自动读取或修改。

`tasks` 与原类一致，是当前实例的运行记录，不跨会话保存；它记录成功执行的规范化链接并去重。白名单内存修改立即影响当前实例，调用 `await youtube.saveWhiteList()` 将修改写入 GM；也可直接 `saveWhiteList({ channels, likes })`。构造时指定的白名单在初始化时保存。

签名默认使用 `crypto.subtle`，应在 HTTPS 等安全上下文运行。不再依赖原项目的全局 `sha1` 函数。

## 公共方法和返回值

- `init(): Promise<boolean>`：并发调用共享初始化 Promise。
- `do({ channelLinks = [], videoLinks = [] }): Promise<SocialTaskResult>` / `undo({ channelLinks = [], videoLinks = [] }): Promise<SocialTaskResult>`：返回逐链接结果；未初始化或整体执行异常时返回 `false`。
- `doChannel({ link })` / `undoChannel({ link }): Promise<boolean>`：单个频道操作。
- `doLikeVideo({ link })` / `undoLikeVideo({ link }): Promise<boolean>`：单个视频操作。
- `youtube.getInfo(link, 'channel' | 'likeVideo'): Promise<YoutubeInfo>`：使用实例请求和事件，无需初始化。
- `getInfo(link, type, { http?, onStatus? }?): Promise<YoutubeInfo>`：保留原两参数调用，默认使用 GM 请求；第三参数可注入请求与监听器。
- `saveWhiteList(value?): Promise<boolean>`：保存白名单。
- `on('status', listener)`：返回取消订阅函数。
- `dispose()`：禁用实例、结束批量任务间隔等待、清理事件订阅；不撤销已提交请求和任务。

`getInfo` 成功返回 `{ params }`，登录失效返回 `{ needLogin: true }`，其他失败返回 `{}`。构造函数只配置依赖，不读取 Cookie、不请求网站。

批量返回形状与原实现相同，以**调用方传入的原始链接**作为结果键：

```ts
{
  success: false,
  results: {
    channelLinks: { 'https://www.youtube.com/channel/UCxxx': true },
    videoLinks: { 'https://youtu.be/xxx': false },
  },
}
```

白名单仅阻止取消订阅/取消点赞，跳过项按兼容约定返回 `true`，事件终态为 `skipped`。任务开关关闭时也如此。批量操作不会自动加入历史任务，撤销哪些链接仍由参数指定。

## 状态事件

字段包括 `operationId`、`parentOperationId`、`operation`、`target`、`phase`、`level`、`code`、`timestamp` 和可选 `details`。

`phase` 为 `start/progress/success/failure/skipped`。每次实际操作有开始和唯一终态；批量任务、页面信息查询、认证更新分别具有独立标识及父子关联。同步或异步监听器异常不改变任务结果。

常用操作：`init`、`auth.verify`、`auth.verifyChannel`、`auth.updateCookie`、`info.get`、`channel.subscribe/unsubscribe`、`video.like/unlike`、`tasks.do` / `tasks.undo`、`whiteList.save`。

常用事件码：`AUTH_REQUIRED`、`COOKIE_READ_FAILED`、`VERIFY_BY_SUBSCRIPTION`、`INVALID_VERIFY_CHANNEL`、`INFO_PARAMS_MISSING`、`CHANNEL_ID_MISSING`、`VIDEO_ID_MISSING`、`LIKE_PARAMS_MISSING`、`HTTP_FAILED`、`AUTH_OR_OPERATION_REJECTED`、`WHITELIST_SKIPPED`、`OPTION_DISABLED`、`DISPOSED`。

模块不输出 console 日志或显示弹窗。事件不包含 Cookie、授权头、API Key、访客标识、原始请求体或响应体；目标链接去除任意查询参数，仅保留路径或视频 ID。凭证过期仍会通过返回值和事件告知调用方；需要重新认证时创建新实例并调用 `init()`。

## HTTP 与 Cookie 适配

HTTP 使用与 Steam 模块兼容的接口，但此目录可以独立复制使用，不依赖 Steam 模块。`HttpResponse.status` 是传输状态（600–604）；真正的 HTTP 状态位于 `data.status`。`result: 'Success'` 表示收到响应，业务成功还需功能模块检查。

GM HTTP 适配器支持文本、JSON、请求头、字符串/FormData 请求体和超时，默认超时 30 秒，不自动重试写请求。外部可直接传入自己的 `HttpClient`，按 `types.ts` 归一化结果，并确保 Promise 在请求失败和超时时也结束。

`createGMCookieReader(GM_cookie.list.bind(GM_cookie), timeoutMs)` 将回调式 Cookie API 转为 Promise，处理回调错误、同步异常和回调未返回。自定义 `cookies` 函数应自行处理超时。需要适配 `GM.*` 异步接口时，传入对应的绑定函数。

## 与原实现的明确差异

- 移除 `Social`、`globalOptions`、日志、国际化和全局 SHA-1 依赖。
- 构造时显式传入 HTTP，原全局任务开关和验证频道改为实例配置。
- 取消点赞不再错误地要求 `likeParams`；点赞仍要求该参数。
- 配置 JSON 支持嵌套对象和字符串转义；Google 跳转链接按参数解析。
- 请求链接限定为支持的 HTTPS YouTube 域名，短链接统一为 watch 链接。
- 保留原接口路径和响应判断方式，不声称这些非公开接口已通过真实账户验证。

## 验证

在仓库根目录使用现有开发依赖运行：

```sh
node node_modules/typescript/bin/tsc -p modules/youtube/tsconfig.json
node node_modules/eslint/bin/eslint.js --config modules/youtube/eslint.config.mjs modules/youtube
node --test modules/youtube/tests/youtube.test.cjs
node modules/youtube/tests/run-browser.cjs
```

浏览器测试默认使用 Windows Edge；可通过 `YOUTUBE_TEST_BROWSER` 指定 Chromium/Edge 可执行文件。测试使用临时独立浏览器配置、模拟 GM 和 HTTP，验证浏览器 Web Crypto 与默认 GM 接入，不使用真实账户执行订阅或点赞。
