# Twitch 独立 TS 模块

入口为 `index.ts`，面向 Tampermonkey 等浏览器用户脚本。通过外部项目的 TS 打包器引入；没有运行时第三方依赖，不依赖 SteamWeb 模块或原项目的 Social、日志、国际化、弹窗、全局配置及全局类型。

项目 `src/scripts/social/` 现通过兼容包装接入本目录，详见 [项目接入说明](../../../scripts/social/README.md)。

## 接入示例

以下元数据加入最终用户脚本，任务站点按实际需求替换：

```js
// ==UserScript==
// @name         My Twitch Tasks
// @namespace    my-twitch-tasks
// @version      1.0.0
// @match        https://example.com/*
// @match        https://www.twitch.tv/*
// @match        https://twitch.tv/*
// @connect      gql.twitch.tv
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        unsafeWindow
// @run-at       document-end
// @noframes
// ==/UserScript==
```

```ts
import Twitch, { createGMHttpClient, handleTwitchAuthPage } from './src/modules/social/twitch';

async function main() {
  const namespace = 'my-script:twitch';

  // 放在任务站点判断之前，使自动打开的 Twitch 页面能够回传认证。
  if (await handleTwitchAuthPage({ namespace })) return;
  if (location.hostname !== 'example.com') return;

  const twitch = new Twitch({
    http: createGMHttpClient(GM_xmlhttpRequest),
    namespace,
    followEnabled: true,
    unfollowEnabled: true,
    channelDelayMs: 1000,
    authTimeoutMs: 120000,
  });

  const unsubscribe = twitch.on('status', (event) => {
    if (event.level !== 'debug') {
      console.log(event.operation, event.target, event.phase, event.code);
    }
  });

  try {
    if (!await twitch.init()) return;
    await twitch.setWhiteList({ channels: ['keep_this_channel'] });
    const result = await twitch.do({
      channelLinks: ['https://www.twitch.tv/example_channel'],
    });
    if (result !== false && typeof result === 'object') {
      console.log(result.success, result.results.channelLinks);
    }
  } finally {
    unsubscribe();
    twitch.dispose();
  }
}

void main();
```

任务页和认证页必须属于**同一个用户脚本**，并使用相同命名空间；不同脚本的 GM 存储不共享。构造不读取存储、不发送请求，`init()` 时才加载 GM 数据。

## 功能划分

| 文件 | 职责 |
| --- | --- |
| `index.ts` | 主入口、初始化编排、公开接口 |
| `auth/verifyToken.ts` | 验证 OAuth Token |
| `auth/integrity.ts` | 获取完整性 Token，最多重试一次响应中的 challenge |
| `auth/updateAuth.ts` | 更新认证后验证、持久化 |
| `auth/pageAuth.ts` | Twitch 页面认证信息读取、回传 |
| `auth/data.ts` | 认证数据校验、字段筛选 |
| `features/channel.ts` | 查询频道 ID、关注/取关 |
| `features/tasks.ts` | 批量任务、链接解析、节流、逐链接结果 |
| `storage.ts` | GM 数据加载与校验 |
| `events.ts`、`context.ts` | 实例状态、操作事件 |
| `graphql.ts` | GraphQL 请求构造及响应检查 |
| `adapters/` | GM 请求、存储、标签页适配 |

## API 与兼容性

- `init(): Promise<boolean>`：已初始化时直接成功；并发初始化共享 Promise。缓存认证必须通过 Token 验证和完整性检查，失败后仅尝试一次开页更新。
- `do({ channelLinks = [] }): Promise<SocialTaskResult>` / `undo({ channelLinks = [] }): Promise<SocialTaskResult>`：保留逐链接结果；未初始化或已释放时返回 `false`。
- `tasks: { channels: string[] }`：成功关注过的频道记录，保持原文件的历史记录语义，取关不移除记录。关注成功后写入 GM。历史持久化失败触发警告，不将已经成功的远程操作误报失败。
- `whiteList: { channels: string[] }`：白名单仅用于跳过取关，跳过视为成功。直接赋值或修改对象只更新当前实例；持久化使用 `setWhiteList()`。
- `setWhiteList(value): Promise<boolean>`：校验并写入 GM，支持初始化前调用。
- `on('status', listener)`：返回取消订阅函数。
- `dispose()`：取消认证/节流等待并清除订阅，之后实例不可继续使用，不撤销已完成操作。

批量返回示例：

```ts
{
  success: false,
  results: {
    channelLinks: {
      'https://twitch.tv/example': true,
      'invalid-link': false,
    },
  },
}
```

同一次批次内相同频道合并执行，但每个原始链接保留结果。只接受 HTTPS 的 `twitch.tv` / `www.twitch.tv` 单段频道路径，允许尾部 `/`、查询参数和片段，频道名转为小写。批次串行执行，频道之间默认等待 1000ms；失败的单个频道不阻止后续频道。

原 `globalOptions.doTask.twitch.channels` 和 `undoTask.twitch.channels` 分别对应 `followEnabled` 和 `unfollowEnabled`，默认均为 `true`。配置跳过沿用原行为，对传入链接返回成功，并发送 `CONFIG_SKIP`。

## 配置、HTTP 与存储

`http` 必填，既可传 `createGMHttpClient(GM_xmlhttpRequest)`，也可注入符合 `HttpClient` 类型的外部请求函数。`gm` 可注入 GM API 绑定，默认使用当前脚本的 `GM_*`。

HTTP 请求/响应结构与 SteamWeb 方案一致：`result`、传输 `status`、`statusText` 和可选 `data`；`data` 内包含实际 HTTP `status`、`response`、`responseText`、`responseHeaders`、`finalUrl`。Twitch 额外支持并传递 `anonymous`。JSON 边界类型为 `unknown`，由业务代码校验。

GM 请求默认超时 30 秒，不自动重试写入；统一响应头大小写和 JSON 解析。传输状态码：600 收到响应、601 超时、602 中止、603 网络失败、604 调用/解析失败。HTTP 200 不等于业务成功，GraphQL 错误和空返回体会被判为失败。外部请求函数需要自行保证 Promise 在失败或超时时结束。

默认 `namespace` 为 `twitch`，`authTimeoutMs` 为 120000，`channelDelayMs` 为 1000。存储只使用 GM，无 localStorage 或内存持久化降级：

| GM 键 | 内容 |
| --- | --- |
| `<namespace>:auth` | 已验证的认证字段 |
| `<namespace>:cache` | 频道名与 ID 缓存 |
| `<namespace>:tasks` | 成功关注历史 |
| `<namespace>:whiteList` | 取关白名单 |
| `<namespace>:auth:pending/reply` | 带请求标识的临时认证通信，结束后清理 |

独立实例建议使用不同命名空间；相同命名空间可在后续实例中复用数据，不提供跨实例同时写入的合并保证。原项目的 `twitchAuth`、`twitchCache`、`whiteList.twitch` 不会自动导入，避免改动旧脚本数据。

## 自动开页认证

保留原文件的数据来源：Twitch 的 `auth-token`、`login` Cookie，页面 `__twilightBuildID`、`commonOptions.headers` 和 Twitch 自己的 `local_storage_app_session_id`。这里仅**读取 Twitch 的现有页面状态**；模块自身的数据仍全部用 GM 持久化。

默认通过 `unsafeWindow` 读取页面全局变量。页面未登录或客户端数据尚未就绪时轮询等待，登录后导航重新执行同一脚本即可继续回传。认证带请求标识，忽略不匹配或不完整的回传，并处理标签页关闭、超时、打开失败和释放清理。

如果外部脚本已有可靠的认证采集逻辑，可以传入 `handleTwitchAuthPage({ namespace, readAuth: async () => auth })`；也可通过 `pageWindow` 显式提供页面窗口。`Auth` 要求 `authToken`、`clientId`、`clientVersion`、`deviceId`、`clientSessionId` 五个非空字符串。模块不会自行注入页面脚本或修改 Twitch 的网络函数。

页面全局变量与 persisted-query 哈希沿用原实现，可能受 Twitch 页面版本影响；缺少字段时会等待至超时，不将不完整认证判为成功。

## 状态事件

事件包含 `operationId`、`parentOperationId`、`operation`、`target`、`timestamp`、`phase`、`level`、`code`、可选 `details`。每个已开始操作有唯一终态；批次结果决定批次终态，单个频道失败不能被后续成功覆盖。

`phase`：`start` / `progress` / `success` / `failure` / `skipped`；`level`：`debug` / `info` / `warning` / `error`。父子关系示例：`do → channel.follow → channel.resolve`。

常用事件码：`AUTH_REQUIRED`、`AUTH_INVALID`、`INTEGRITY_FAILED`、`INTEGRITY_RETRY`、`AUTH_WAITING_FOR_PAGE`、`AUTH_UPDATED`、`AUTH_TIMEOUT`、`AUTH_TAB_CLOSED`、`AUTH_BUSY`、`INVALID_CHANNEL_LINK`、`CHANNEL_NOT_FOUND`、`GRAPHQL_ERROR`、`WHITELIST_SKIP`、`CONFIG_SKIP`、`TASKS_PERSIST_FAILED`。

模块不输出 console 日志或显示弹窗，文案由外部按事件码映射。监听器抛错或返回拒绝的 Promise 不影响业务执行。事件不包含 OAuth/完整性 Token、Cookie、challenge 内容、请求体、响应体或服务端错误原文。

## 验证

在仓库根目录运行：

```sh
node node_modules/typescript/bin/tsc -p src/modules/social/twitch/tsconfig.json
node node_modules/eslint/bin/eslint.js --config src/modules/social/twitch/eslint.config.mjs src/modules/social/twitch
node --test src/modules/social/twitch/tests/twitch.test.cjs
```

测试使用模拟 GM 和 Twitch 响应，不操作真实账户。实际 Twitch 页面变量、请求哈希与用户脚本管理器权限仍需在真实环境联调。
