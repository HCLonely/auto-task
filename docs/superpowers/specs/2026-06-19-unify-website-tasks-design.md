# Website 任务模型统一设计

## 目标

将 `src/scripts/website/` 中站点模块的 `undoneTasks`、`socialTasks` 和站点自有 `tasks` 统一为 `tasks` 数组。

统一后：

- `done` 表示任务是否已经完成。
- `social` 表示任务所属社交平台或执行域。
- `type` 表示该平台下的任务子类型。
- `link` 表示任务链接或可用于执行任务的标识。
- 不同站点可以按需要保留 `id`、`title`、`data`、`minutes` 等额外属性。

本次改动覆盖网站任务模型、基类执行适配、历史记录展示和相关 TypeScript 类型，不直接重构 `src/scripts/social/` 中的社交模块。

## 统一数据模型

```ts
interface WebsiteTask {
  done: boolean;
  social: string;
  type: string;
  link: string;
  id?: string | number;
  title?: string;
  data?: string;
  minutes?: number;
  [key: string]: unknown;
}

interface WebsiteStoredTasks {
  tasks: WebsiteTask[];
  time: number;
}
```

字段约定：

- `done: false`：执行任务时处理。
- `done: true`：撤销任务时处理。
- `social` 使用小写语义名称，例如 `steam`、`twitter`、`extra`。
- `type` 使用不带 `Links` 后缀的语义名称，例如 `wishlist`、`group`、`channel`。
- `link` 保存规范化后的任务链接；没有普通 URL 的任务可保存原始协议字符串或稳定标识。
- 播玩时间使用 `minutes`，不再编码为 `"分钟-link"`。
- `id`、`title`、`data` 及其他属性仅在站点执行或验证逻辑需要时保留。

## 总体架构

各站点的 `classifyTask()` 直接生成 `WebsiteTask[]`。`Website` 基类根据操作筛选任务：

```ts
const selectedTasks = this.tasks.filter(
  (task) => action === 'do' ? !task.done : task.done
);
```

基类在调用现有社交模块前，将扁平任务临时聚合为其当前需要的参数，例如：

```ts
[
  { done: false, social: 'steam', type: 'wishlist', link: appLink }
]
```

转换为：

```ts
{
  wishlistLinks: [appLink]
}
```

这样能够完成网站层数据模型统一，同时避免本次改动扩大到全部社交模块。

## 基类修改

### `src/scripts/website/Website.ts`

- 删除 `undoneTasks` 和 `socialTasks`。
- 增加统一属性：

```ts
tasks: WebsiteTask[] = [];
```

- `initSocial(action)` 根据 `done` 筛选任务，再按 `social` 判断需要初始化的社交模块。
- `toggleTask(action)` 使用同一任务数组，不再在两个嵌套对象之间选择。
- 增加将扁平任务聚合为旧社交模块参数的内部方法。
- `uniqueTasks()` 改为数组去重。
- 默认去重键为 `social + type + link`。
- 如果任务执行语义依赖额外属性，去重时允许站点提供额外键。
- `extra` 任务按类型分组后交给站点的 `extraDoTask()`。
- `playtime` 任务在交给 Steam 模块时临时转换为当前的 `"minutes-link"` 格式。

### 类型映射

基类负责以下通用映射：

| `social` | `type` | 现有社交模块参数 |
|---|---|---|
| `steam` | `group` | `groupLinks` |
| `steam` | `officialGroup` | `officialGroupLinks` |
| `steam` | `wishlist` | `wishlistLinks` |
| `steam` | `follow` | `followLinks` |
| `steam` | `forum` | `forumLinks` |
| `steam` | `workshop` | `workshopLinks` |
| `steam` | `workshopVote` | `workshopVoteLinks` |
| `steam` | `curator` | `curatorLinks` |
| `steam` | `curatorLike` | `curatorLikeLinks` |
| `steam` | `announcement` | `announcementLinks` |
| `steam` | `license` | `licenseLinks` |
| `steam` | `playtime` | `playTimeLinks` |
| `discord` | `server` | `serverLinks` |
| `reddit` | `post` | `redditLinks` |
| `twitch` | `channel` | `channelLinks` |
| `twitter` | `user` | `userLinks` |
| `twitter` | `retweet` | `retweetLinks` |
| `twitter` | `like` | `likeLinks` |
| `vk` | `user` | `nameLinks` |
| `vk` | `like` | `nameLinks`，执行前在链接中保留对应动作参数 |
| `youtube` | `channel` | `channelLinks` |
| `youtube` | `like` | `likeLinks` |

未知的 `social/type` 组合不会静默执行，应记录调试信息或未知任务警告。

## 存储兼容

GM 存储采用渐进迁移：

- 读取时兼容旧的嵌套任务结构和新的任务数组。
- 旧结构在内存中转换为 `WebsiteTask[]`。
- 旧存储中的任务代表可撤销的历史任务，因此转换后默认使用 `done: true`。
- 写入时只保存新格式：

```ts
{
  tasks: WebsiteTask[],
  time: number
}
```

- 不修改现有存储键名，例如 `fawTasks-*`、`gasTasks-*`、`khTasks-*`。
- 历史页面同时支持读取新旧结构。

## 历史记录

### `src/scripts/website/History.ts`

- `TasksData` 改为统一存储类型，并保留旧格式输入兼容。
- `#generateTaskHtml()` 直接遍历任务数组。
- 使用 `task.social`、`task.type` 和 `task.link` 生成展示内容。
- 旧嵌套数据先转换后展示。
- 保存的任务历史默认是 `done: true` 的可撤销任务。
- 对没有普通 URL 的任务，以文本形式显示，不生成无效超链接。

## 站点迁移

### `Freeanywhere.ts`

- 删除 `socialTasks` 和 `undoneTasks`。
- 原用于验证的 `tasks: fawTaskInfo[]` 改名为 `verifyTasks`。
- 页面任务统一保存 `done`、`social`、`type`、`link`，并保留 `id`、`title`、`data`。
- 映射：
  - `steam_game_sub` → `steam/follow`
  - `steam_game_wishlist` → `steam/wishlist`
  - `steam_group_sub` → `steam/group`
  - `steam_curator_sub` → `steam/curator`
  - `site_visit` → `extra/website`
  - `vk_community_sub` → `vk/user`
  - `vk_post_like` → `vk/like`
  - `youtube_channel_sub` → `youtube/channel`
  - `steam_game_playtime` → `steam/playtime`，增加 `minutes`
- `site_visit` 保留站点任务 `id`，`extraDoTask()` 使用该 ID。
- 验证流程使用 `verifyTasks`。
- 实现时保留工作区中已有的 `GamesForFarmApi` 相关未提交修改。

### `FreeRu.ts`

- 删除旧任务对象和嵌套默认模板。
- 每个访问链接转换为：

```ts
{ done: false, social: 'extra', type: 'visit', link }
```

- `extraDoTask()` 接收对应任务并使用 `link`。

### `GiveawayHopper.ts`

- API 原始任务数组改名为 `rawTasks`，避免与统一属性冲突。
- API 任务映射到统一数组，并保留 `id`、`title`、`category`、原始类型、`hash` 等站点属性。
- `done` 来源于 `isDone`。
- 映射：
  - Steam `JoinGroup` → `steam/group`
  - Discord `JoinServer` → `discord/server`
- `group_id`、`invite_code` 可作为额外属性保留。
- 验证流程继续使用 `rawTasks` 或统一任务中的 `id`。

### `Giveawaysu.ts`

- 删除嵌套默认任务模板和两个旧属性。
- 每个页面任务直接生成一个统一任务对象。
- 映射：
  - Steam：`group`、`announcement`、`curator`、`curatorLike`、`forum`、`workshopVote`、`playtest`、`wishlist`、`follow`
  - Discord：`server`
  - Twitch：`channel`
  - Reddit：`post`
  - YouTube：`channel`、`like`
  - VK：`user`
- 保留 `title`、`icon` 等识别信息。
- 消除 `socialTasks = undoneTasks` 导致的对象共享。

### `GiveeClub.ts`

- 与 `Giveawaysu` 使用同一统一任务模型，不再依赖旧嵌套模板。
- `done` 来源于 `.btn-success`。
- 除 `Giveawaysu` 的映射外，支持：
  - `steam/playtime`，使用 `minutes`
  - `twitter/user`
  - `twitter/retweet`
- 保留原始 `taskType`、`title`、`appId`。

### `Givekey.ts`

- 删除旧两个任务对象。
- 验证 ID 数组从 `tasks` 改名为 `verifyTaskIds`。
- 任务保留 `id`、`title` 和页面完成状态。
- 映射：
  - `vk/user`
  - `steam/group`
  - `steam/wishlist`
  - `steam/curator`
  - `steam/curatorLike`
  - `twitter/user`
  - `discord/server`
- 验证流程使用 `verifyTaskIds`。

### `Gleam.ts`

- 删除嵌套默认任务模板和旧任务属性。
- `done` 根据任务当前是否仍显示待完成标识判断。
- 映射：
  - Twitter：`user`、`retweet`
  - Twitch：`channel`
  - Discord：`server`
  - YouTube：`channel`
  - Steam：`group`、`curator`、`playtime`、`wishlist`、`follow`
  - Gleam 特殊任务：`extra/gleam`
- 播玩时间保存为 `minutes`。
- 保留任务标题。

### `Keyhub.ts`

- 删除旧任务对象。
- 映射：
  - `steam/group`
  - `steam/officialGroup`
  - `steam/wishlist`
  - `steam/curator`
  - `discord/server`
  - `extra/video`
- 视频任务保留原始 JavaScript 链接，并将执行参数存入 `data`。
- 原顶层 `links` 转换为 `extra/visit`。
- `extraDoTask()` 根据 `type` 和 `data` 执行。

### `Keylol.ts`

- 删除嵌套默认任务模板及旧索引类型。
- 根据按钮的 `data-social`、`data-type` 和 `data-link` 直接生成任务对象。
- `done` 根据操作设置：
  - `do` → `false`
  - `undo` → `true`
- 现有 `groupLinks` 等按钮类型转换为 `group` 等语义类型。
- 后续生成按钮时直接写语义化 `data-type`，减少运行时转换。

### `Opquests.ts`

- 删除 `undoneTasks` 和嵌套默认对象。
- 该站不支持撤销，分类任务均为 `done: false`。
- 映射：
  - Steam：`group`、`wishlist`、`follow`、`playtime`、`curatorLike`
  - Twitter：`user`、`retweet`
  - Discord：`server`
- 播玩时间保存为 `minutes`。
- `classifyTask('undo')` 继续明确返回不支持。

### `Prys.ts`

- 删除旧任务对象。
- `done` 来源于步骤的 `Success` 状态。
- 映射：
  - `steam/wishlist`
  - `steam/follow`
  - `steam/curator`
  - `steam/group`
- GID 重定向完成后直接写入最终 group 链接。
- 不保留当前代码未使用的 `youtube/channel` 默认空结构。

## 类型声明调整

- `src/types/Website.d.ts` 定义 `WebsiteTask`、`WebsiteStoredTasks` 和旧结构兼容类型。
- 删除各站点重复的 `*SocialTasks`。
- 各站点声明文件只保留原始 API、验证任务和站点特有数据类型。
- `GFF_API.d.ts` 不因本任务主动调整；实现时保留用户现有未提交修改。

## 错误处理

- 缺少必要 `link` 且没有可替代 ID 的任务不加入执行队列，并记录调试信息。
- 未识别任务继续使用现有国际化警告。
- 旧存储转换失败时返回空任务数组并记录错误，不覆盖原存储。
- 未知 `social/type` 不传入社交模块。
- 单个任务解析失败不应清空同页面已经识别的任务。

## 验证策略

项目当前没有独立单元测试框架，因此使用类型检查、Lint、构建和针对转换函数的轻量测试进行验证。

最低验证项：

1. 新旧存储格式都可转换为统一任务数组。
2. `do` 只执行 `done: false`。
3. `undo` 只执行 `done: true`。
4. 各通用 `social/type` 能正确聚合为现有社交模块参数。
5. `playtime` 的 `minutes` 能正确转换。
6. `extra` 任务能按站点类型执行。
7. `History` 能显示新旧两种存储格式。
8. `npm run lint` 通过。
9. `npm run tsc` 通过。
10. `npm run rollup` 通过。

## 实施边界

- 不重构 `src/scripts/social/` 的公开任务输入模型。
- 不改变按钮名称和用户操作流程。
- 不删除旧 GM 存储键。
- 不覆盖 `Freeanywhere.ts` 和 `GFF_API.d.ts` 中用户已有的未提交修改。
- 不在本次任务中处理与任务模型无关的站点缺陷。
