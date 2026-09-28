# Steam 整合模块

独立浏览器用户脚本 TS 模块，统一编排 `steamWeb` 与 `steamASF`。从 `index.ts` 导入 `Steam`，由外部打包器构建成用户脚本。整合层及两个子模块均没有运行时第三方依赖。

项目 `src/scripts/social/` 现通过兼容包装接入本目录，详见 [项目接入说明](../../../scripts/social/README.md)。整合层不依赖 `Social`、`globalOptions`、日志 UI、国际化、jQuery 或项目全局类型。

## 使用示例

最终用户脚本应包含下面的权限。将 `example.com` 和 IPC 主机替换为实际地址；只用 Web 时可省略 IPC 主机权限，只用 ASF 时可省略开页认证相关权限和 Steam 页面匹配。

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
// @connect      api.steampowered.com
// @connect      127.0.0.1
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

```ts
import Steam, { createGMHttpClient, handleSteamAuthPage } from './src/modules/social/steam';

async function main() {
  const namespace = 'my-script:steam';
  // 必须在任务站点判断之前调用，并使用与 Steam 实例相同的命名空间。
  if (await handleSteamAuthPage({ namespace })) return;
  if (location.hostname !== 'example.com') return;

  const steam = new Steam({
    http: createGMHttpClient(GM_xmlhttpRequest),
    namespace,
    ASF: {
      AsfEnabled: true,
      AsfIpcUrl: 'http://127.0.0.1:1242',
      AsfIpcPassword: 'your-ipc-password',
      AsfBotname: 'YourBot',
      steamWeb: true,
      preferASF: true,
      steamWebApiKey: '',
    },
    whiteList: { wishlists: ['123456'] },
    doTask: { groups: true, wishlists: true },
    undoTask: { groups: true, wishlists: true },
  });

  const off = steam.on('status', (event) => {
    if (event.level === 'debug') return;
    console.log(event.source, event.operation, event.phase, event.code);
  });

  try {
    if (!await steam.init('all')) return;
    const result = await steam.do({
      groupLinks: ['https://steamcommunity.com/groups/example/'],
      wishlistLinks: ['https://store.steampowered.com/app/123456/'],
    });
    if (result !== false && typeof result === 'object') {
      console.log(result.success, result.results);
    }
  } finally {
    // do() / undo() 已等待所有任务和 Web 地区恢复完成。
    off();
    steam.dispose();
  }
}

void main();
```

只使用 Web 时最少配置为 `new Steam({ http: createGMHttpClient(GM_xmlhttpRequest) })`。

Web 认证页与任务页须属于同一个用户脚本。整合入口导出的 `handleSteamAuthPage` 自动使用 `<namespace>:web`；若直接使用子模块的同名函数，则须自行传入该子命名空间。

## 配置

| 参数 | 默认值与含义 |
| --- | --- |
| `http` | 必填；注入统一 `HttpClient`，供整合层、Web、ASF 共用 |
| `gm` | 当前脚本的 `GM_*`；支持显式传入绑定后的同步/异步 GM API |
| `namespace` | `steam`；建议不同账户/任务系统使用不同命名空间 |
| `ASF` | 原 ASF 配置名称保持不变，见下表 |
| `doTask` | 默认全部任务类型启用；传入局部覆盖，直接是 Steam 配置，不需要外层 `steam` |
| `undoTask` | 默认启用可撤销任务；投票、公告、许可证、试玩请求没有撤销操作 |
| `whiteList` | ID/组名白名单，局部覆盖持久化白名单 |
| `autoChangeRegion` | `true`；传给 SteamWeb |
| `authTimeoutMs` | `120000`；传给 SteamWeb |
| `taskDelayMs` | `1000` 毫秒；任务间隔，可设为 `0` |
| `playRetryDelayMs` | `3000` 毫秒；挂机启动失败后的重试间隔 |
| `taskUrl` | 当前页面 URL；记录到挂机来源页面列表，可显式传入 |

| ASF 配置 | 默认值 |
| --- | --- |
| `AsfEnabled` | `false` |
| `AsfIpcUrl` / `AsfIpcPassword` | 空字符串；启用 ASF 时配置有效 IPC URL |
| `AsfBotname` | `asf` |
| `steamWeb` | `false` |
| `preferASF` | `false` |
| `steamWebApiKey` | 空字符串；挂机状态查询使用 |

执行器选择继承原策略：ASF 未启用时始终使用 Web；ASF 已启用且 `steamWeb=false` 时只用 ASF；两者启用时按 `preferASF` 确定顺序。需要任务落在同一账户时，应让 Web 登录账号与 ASF 机器人账号一致。

`doTask` / `undoTask` 支持 `groups`、`officialGroups`、`wishlists`、`follows`、`forums`、`workshops`、`workshopVotes`、`curators`、`announcements`、`licenses`、`playtests`、`playTime`。开发商/发行商关注与原实现一样由 `curators` 控制。

## 任务输入与结果

`do()` / `undo()` 保留原参数名称：

| 参数 | 输入示例 |
| --- | --- |
| `groupLinks` | `https://steamcommunity.com/groups/example/` |
| `officialGroupLinks` | `https://steamcommunity.com/games/123/` |
| `wishlistLinks` / `followLinks` / `playtestLinks` | `https://store.steampowered.com/app/123/` |
| `forumLinks` | `https://steamcommunity.com/app/123/discussions/` |
| `workshopLinks` / `workshopVoteLinks` | `https://steamcommunity.com/sharedfiles/filedetails/?id=123` |
| `curatorLinks` | `https://store.steampowered.com/curator/123/` |
| `curatorLikeLinks` | 商店的 `developer/<name>`、`publisher/<name>`、`franchise/<name>` 链接 |
| `announcementLinks` | 商店 `news/app/<id>/view/<id>` 或社区 `games/<id>/announcements/detail/<id>` 链接 |
| `licenseLinks` | `appid-123,456`、`subid-123,456` |
| `playTimeLinks` | `30-https://store.steampowered.com/app/123/`，前缀为分钟数 |

以上参数均为字符串数组。`doTask` 默认 `true`，设为 `false` 撤销指定链接；不会自动撤销未提供链接的全部历史任务。重复链接在同一分类内去重，非法链接逐项标记失败。

正常完成返回原有详细结果结构：

```ts
{
  success: true,
  results: {
    wishlistLinks: {
      'https://store.steampowered.com/app/123/': true,
    },
  },
}
```

未初始化、持久化读取失败等整体异常返回 `false`。单项失败不阻止后续任务，整体 `success` 为全部结果的合取。配置禁用的任务、白名单保护的撤销操作按原语义返回成功，事件为跳过。地区恢复失败会使整体 `success=false`，不会改写已经成功的逐链接结果。

批次内部顺序执行，默认间隔 1 秒；同一实例的批次和初始化进入队列，避免任务与地区恢复交叉。成功后停止尝试其他执行器；失败后按优先级回退。已知 ASF 不支持的论坛、工坊、投票、公告直接路由到 Web；挂时长只使用 ASF。

## 公共 API 与持久化

保留 `init(type = 'all')`、`do(options)` / `undo(options)`、`getCuratorId(path, name)`、`tasks`、`whiteList`。新增：

- `on('status', listener)`：统一订阅，返回取消订阅函数。
- `setWhiteList(partial)`：更新部分白名单并写入 GM，返回 `Promise<boolean>`。
- `getPlayState()`：返回挂机记录或 `false`。
- `stopPlayGames()`：显式停止 ASF 挂机，并在成功后清空对应记录。
- `resetArea()`：显式等待 Web 地区恢复，通常由 `do()` / `undo()` 自动完成。
- `dispose()`：取消订阅并释放子模块；不自动停止 ASF 已在运行的游戏。

`init('store')` / `init('community')` 为 Web 初始化指定能力，ASF 使用同一个 IPC 初始化。至少一个执行器初始化成功即返回 `true`；其他执行器失败不会跳过后续执行器，也不会被永久删除，后续可以重试。只有已经初始化对应能力的执行器参与任务。

所有持久化仅使用 GM，无 localStorage/内存存储降级。整合层存储键包括：

- `<namespace>:tasks`：成功任务记录，撤销成功后移除。
- `<namespace>:whiteList`：撤销保护列表。
- `<namespace>:curator:<path>:<encodedName>`：鉴赏家 ID 缓存。
- `<namespace>:playState:<encodedIpcUrl>:<encodedBotName>`：挂机截止时间、游戏 ID 和来源页面。

Web 使用 `<namespace>:web`，ASF 使用 `<namespace>:asf`，子模块内部继续按各自规则区分缓存与认证通信。新模块不自动读取或覆盖原脚本的 `steamCache`、`whiteList`、`stopPlayTime` 等全局存储键；需要迁移时由外部明确传入白名单等数据。

先调用 `init()` 加载持久化数据，再读取/直接编辑 `tasks`、`whiteList`。直接编辑仅改变当前实例；白名单持久化请使用 `setWhiteList()`。任务记录和白名单的数组独立创建，不共享引用。

## 挂机流程与到期处理

同一批挂机链接按最大分钟数执行：解析游戏和 Demo ID、尝试入库、发送 ASF `!play`、检查状态，必要时重试一次。只有启动命令成功，且状态为成功或因无 API Key 无法检查时，才记录挂机结果。状态跳过会触发 `PLAY_STATUS_UNVERIFIED`。

沿用原有截止时间计算：当前时间加上“请求分钟数 + 10 分钟”，并保留更晚的已有截止时间。记录结构：

```ts
interface PlayState {
  stopPlayTime: number; // Unix 毫秒时间戳，0 表示没有待处理记录
  playedGames: string[];
  taskLink: string[];
}
```

原来的到期弹窗/开页逻辑位于 `src/index.ts`，不属于 `Steam.ts`。独立模块不弹窗、不自动打开任务来源页，也不依赖该旧入口；外部可以在脚本启动或自己的定时流程中接管：

```ts
const state = await steam.getPlayState();
if (state && state.stopPlayTime > 0 && state.stopPlayTime <= Date.now()) {
  // 此前应先 steam.init()，外部决定是否需要询问用户。
  const stopped = await steam.stopPlayGames();
  const remaining = await steam.getPlayState();
  if (stopped && remaining && remaining.stopPlayTime === 0) {
    // 外部按需使用 state.taskLink 恢复任务页面。
  }
}
```

`stopPlayGames()` 对应 ASF 的整体恢复命令。若挂机记录中存在 `whiteList.playTime` 保护的游戏，则按白名单跳过语义返回 `true`，跳过整个停止操作并保留记录，避免顺带停止受保护游戏；可通过剩余记录和 `WHITELIST_SKIPPED` 事件区分。挂机记录用于后续恢复流程，页面关闭后不会由本模块持续计时或保证自动停止。

## 状态事件

`SteamEvent` 沿用子模块的 `operationId`、`parentOperationId`、`operation`、`phase`、`level`、`code`、`target`、`timestamp`、`details`，额外提供：

```ts
source: 'steam' | 'steamWeb' | 'steamASF'
```

子模块事件统一转发并关联到发起它的整合层操作。每次已开始操作有唯一终态，重试、回退和请求进度不冒充最终成功。使用 `source === 'steam' && (operation === 'do' || operation === 'undo')` 的终态判断整个批次，使用逐链接结果展示每项状态。

常用整合层事件码：`NEED_INIT`、`INVALID_LINK`、`TASK_DISABLED`、`WHITELIST_SKIPPED`、`EXECUTOR_ATTEMPT`、`EXECUTOR_FALLBACK`、`EXECUTOR_INIT_FAILED`、`NO_EXECUTOR_SUCCEEDED`、`REGION_RESET_FAILED`、`ASF_REQUIRED`、`PLAY_STATUS_UNVERIFIED`、`PLAY_SCHEDULE_RECORDED`。

模块不输出 console 日志、不显示弹窗，监听器异常不会中断任务。原始请求头、响应体、认证密码和 API Key 不附加到事件中；业务链接可出现在 `target`。

## 文件结构与验证

```text
src/modules/social/steam/
  index.ts       统一入口、初始化与公共导出
  types.ts       配置、任务、结果与事件类型
  defaults.ts    默认配置、独立任务数组
  context.ts     实例状态、队列、子模块实例与事件关联
  events.ts      统一事件订阅
  executors.ts   初始化、按能力路由、回退、地区恢复
  links.ts       Steam 链接解析
  tasks.ts       批次编排、逐项结果与白名单
  lookups.ts     鉴赏家及 Demo 查询
  storage.ts     GM 状态读写
  playTime.ts    挂机编排与记录
  steamWeb/      独立 Web 子模块
  steamASF/      独立 ASF 子模块
  tests/         整合回归测试
```

在仓库根目录使用现有开发依赖运行：

```sh
node node_modules/typescript/bin/tsc -p src/modules/social/steam/tsconfig.json
node node_modules/eslint/bin/eslint.js --config src/modules/social/steam/eslint.config.mjs src/modules/social/steam
node --test src/modules/social/steam/tests/steam.test.cjs src/modules/social/steam/steamWeb/tests/steamWeb.test.cjs src/modules/social/steam/steamASF/tests/steamASF.test.cjs
```

整合测试实例化实际 Web/ASF 客户端，注入模拟 HTTP/GM 环境。没有连接真实 Steam 或 ASF 服务。子模块的请求约定与限制参见 [SteamWeb 说明](steamWeb/README.md) 和 [SteamASF 说明](steamASF/README.md)。
