# Vk 独立 TS 模块

面向 Tampermonkey 等浏览器用户脚本，入口为 `index.ts`。项目 `src/scripts/social/Vk.ts` 通过兼容包装接入本模块；模块自身不依赖原 `Social`、全局配置、jQuery、日志或国际化工具，也不依赖 SteamWeb 模块。不注册 `unsafeWindow.Vk`。

## 接入示例

通过外部项目的 TS 打包器导入，再将产物作为用户脚本运行：

```ts
import Vk, { createGMHttpClient } from './src/modules/social/vk';

async function main() {
  const vk = new Vk({
    http: createGMHttpClient(GM_xmlhttpRequest),
    namespace: 'my-script:vk',
    doTaskEnabled: true,
    undoTaskEnabled: true,
    intervalMs: 1000,
  });
  const unsubscribe = vk.on('status', (event) => {
    if (event.level !== 'debug') {
      console.log(event.operation, event.target, event.phase, event.code);
    }
  });
  try {
    if (!await vk.init()) return;
    await vk.setWhiteList({ names: ['keep_this_group'] });
    const result = await vk.do({
      nameLinks: [
        'https://vk.com/example_group',
        'https://vk.com/wall-123_456?action=like',
        'https://vk.com/wall-123_456',
      ],
    });
    // result === false 表示整体无法执行，否则读取 result.success / result.results。
    console.log(result);
  } finally {
    unsubscribe();
    vk.dispose();
  }
}
void main();
```

用户脚本元数据需要目标站点的 `@match`，以及以下权限：

```js
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @connect vk.com
// @connect vk.ru
// @connect login.vk.com
// @connect web.api.vk.com
// @connect web.api.vk.ru
```

与原 VK 实现一致，认证使用浏览器已登录的 Cookie 获取 Web Token，不额外打开认证标签页。未登录时产生 `AUTH_REQUIRED`；在浏览器登录 VK 后重新调用 `init()`。请求环境负责 Cookie 的携带与更新。

## 目录

| 文件 | 职责 |
| --- | --- |
| `index.ts` | 统一入口、初始化、批次排队、公共 API |
| `auth/session.ts` | 验证登录会话，提取账户 ID、API 版本和应用 ID |
| `auth/token.ts` | 更新 Web Token |
| `features/groups.ts` | 加入/退出群组 |
| `features/publicPages.ts` | 原有公共页面加入/退出内部功能 |
| `features/likes.ts` | 点赞/取消点赞 |
| `features/reposts.ts` | 转发/删除转发 |
| `features/wall.ts` | 查询帖子 |
| `features/tasks.ts` | 逐链接执行及结果汇总 |
| `utils/targets.ts` | 链接规范化、目标类型及参数解析 |
| `cache.ts`、`whiteList.ts` | GM 缓存及白名单持久化 |
| `events.ts`、`context.ts` | 状态事件及实例上下文 |
| `adapters/` | 独立 GM HTTP/存储适配器 |

## 公共 API 与兼容性

- `new Vk(options)`：仅配置依赖，不发请求。
- `init(): Promise<boolean>`：并发调用共享初始化工作。先验证会话以取得当前 API 参数，再更新 Token、加载缓存和白名单。
- `do({ nameLinks = [] }): Promise<SocialTaskResult>` / `undo({ nameLinks = [] }): Promise<SocialTaskResult>`：保留原逐链接返回结构。`false` 表示未初始化等整体失败；正常完成返回 `{ success, results: { nameLinks: { [原始链接]: boolean } } }`，空列表返回 `{ success: true, results: {} }`。
- `tasks: { names: string[] }`：保持原成功加入/转发任务记录方式；已存在的状态不记录为本次新增任务。该字段是执行中状态，不持久化。
- `whiteList: { names: string[] }`：保留可读写字段，适用于本次实例的白名单调整。初始化时合并 GM 白名单。需要跨刷新保存时使用 `setWhiteList()`。
- `setWhiteList({ names }): Promise<boolean>`：规范化并写入 GM；可传名称或完整 VK 链接。初始化后调用可直接替换当前持久化白名单。
- `on('status', listener)`：返回取消订阅函数。
- `dispose()`：清理监听器及 Token，阻止后续请求，不撤销已执行操作。

`undo()` 执行退出群组、取消点赞或删除转发。与原实现一致，只处理显式传入的链接，不自动回滚 `tasks.names`。白名单仅保护撤销操作。

原 `globalOptions.doTask.vk.names` 和 `undoTask.vk.names` 分别改为 `doTaskEnabled`、`undoTaskEnabled`，默认均为 `true`。关闭后按原行为将对应输入标记为成功跳过。

同一实例的批次及批次内操作依次执行，避免重复转发与缓存写入竞态；相邻任务默认间隔 1000ms，可通过 `intervalMs` 调整。批次内相同链接去重，返回结果仍使用原始链接作键。

`apiVersion`、`appId` 可显式指定；未指定时优先取登录页面中的值，缺失时保留原默认值 `5.282` 和 `6287487`。支持 `vk.com`、`vk.ru` 及其 `www` 形式的 HTTPS 链接。

## 存储与状态事件

持久化仅使用 GM，不提供 localStorage 或内存存储降级。可用 `gm` 选项注入绑定后的 GM API，默认直接调用 `GM_*`。GM 读取失败则初始化失败。

- `<namespace>:cache:<userId>`：原帖子名称到当前账户转发帖子 ID 的映射。
- `<namespace>:whiteList`：白名单。
- `namespace` 默认 `vk`。不会自动读写旧脚本的 `vkCache` 或全局 `whiteList`，避免相互干扰。

状态事件包括 `operationId`、`parentOperationId`、`operation`、`phase`、`level`、`code`、`target`、`timestamp`、`details`。每个已开始操作产生唯一终态；`phase` 为 `start/progress/success/failure/skipped`。外部根据 `code` 映射中文日志，并按 `operationId` 更新记录。

主要事件码：`AUTH_REQUIRED`、`HTTP_REQUEST_FAILED`、`VK_API_ERROR`、`INVALID_RESPONSE`、`INVALID_LINK`、`TARGET_NOT_SUPPORTED`、`POST_NOT_FOUND`、`REPOST_ID_NOT_CACHED`、`WHITELIST_SKIP`、`TASK_DISABLED`、`ALREADY_IN_DESIRED_STATE`、`DISPOSED`。API 失败仅提供数值错误码，不附带 VK 的原始错误对象，因为它可能包含 Token。模块不输出日志或弹窗，监听器抛错不影响业务结果。

## HTTP 注入

`http` 必填，类型为 `HttpClient`。默认推荐 `createGMHttpClient(GM_xmlhttpRequest)`，也可传入符合 `types.ts` 契约的自定义请求函数。

接口与 SteamWeb 模块的传输接口结构一致，但本模块自带实现，可单独复制使用。支持表单字符串、FormData、JSON/text、超时与重定向。响应外层 `status = 600` 表示收到响应，实际 HTTP 状态为 `data.status`；601/602/603/604 分别表示超时/中止/网络失败/调用或解析错误。文本模式向 GM 省略 `responseType`。

适配器默认 30 秒超时，无自动重试，避免重复提交转发等操作。自定义请求函数同样必须保证超时或错误后 Promise 能结束。

## 原实现的功能边界

原文件虽然在注释中提及关注用户，但没有对应实现；公共页面识别代码也已注释。本模块保留公共页面操作文件，不自动启用原本关闭的识别流程，未知页面返回 `TARGET_NOT_SUPPORTED`。没有新增用户关注 API。

帖子查询仍沿用原 `wall.get` 接口及最近 10 条的范围，未找到返回 `POST_NOT_FOUND`。删除转发必须有当前账户对应的缓存 ID；不会猜测要删除的帖子。原接口和网页提取规则尚需实际 VK 用户脚本环境联调。

新模块修正了原实现的部分失败语义：群组/点赞不再仅凭 HTTP 200 判为成功；缺少账户 ID 或 Token 时初始化失败；页面 API 参数缺失时保留默认值；缺少转发缓存不发删除请求；批次事件终态与汇总结果一致。

## 验证

在仓库根目录执行：

```sh
node node_modules/typescript/bin/tsc -p src/modules/social/vk/tsconfig.json
node node_modules/eslint/bin/eslint.js --config src/modules/social/vk/eslint.config.mjs src/modules/social/vk
node --test src/modules/social/vk/tests/vk.test.cjs
```

测试使用模拟 HTTP/GM 响应，不操作真实 VK 账户。
