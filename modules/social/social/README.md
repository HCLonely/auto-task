# Social 独立基类与模块整合器

项目 `src/scripts/social/` 现通过兼容包装接入本目录，详见 [项目接入说明](../../src/scripts/social/README.md)。本目录不引用 `src`，不依赖 GM、HTTP、日志工具、全局任务类型或第三方运行库。

提供三层接口：

| 导出 | 用途 |
| --- | --- |
| `Social`（默认导出） | 抽象基类，保留 `init`、`do` / `undo` 与结果/任务参数辅助方法 |
| `SocialAdapter` | 将现有独立模块包装为 `Social`，不修改模块本身 |
| `SocialManager` | 初始化、执行、事件汇总及生命周期管理 |

已有模块继续支持单独复制使用，无需依赖本目录。新模块可以继承 `Social`，也可以直接实现 `SocialModule` 结构接口后接入整合器。

## 统一使用

```ts
import { SocialManager, Steam, Vk } from './modules';
import { createGMHttpClient } from './modules/social/vk';
import { handleSteamAuthPage } from './modules/social/steam';

async function main() {
  // 如需 Steam 自动开页认证，仍需让同一用户脚本在 Steam 页面运行此处理器。
  if (await handleSteamAuthPage({ namespace: 'my-script:steam' })) return;
  if (location.hostname !== 'example.com') return;

  const http = createGMHttpClient(GM_xmlhttpRequest);
  const social = new SocialManager({
    steam: new Steam({ http, namespace: 'my-script:steam' }),
    vk: new Vk({ http, namespace: 'my-script:vk' }),
  });

  social.on('status', (event) => {
    if (event.level === 'debug') return;
    console.log(event.platform, event.operation, event.phase, event.code);
  });

  try {
    const initialized = await social.initAll({ steam: 'store' });
    if (!initialized.success) {
      // 可按 initialized.results 分别处理，成功的平台仍可独立执行。
      return;
    }
    const batch = await social.doAll({
      steam: { wishlistLinks: ['https://store.steampowered.com/app/123/'] },
      vk: { nameLinks: ['https://vk.com/example_group'] },
    });
    console.log(batch.success, batch.results.steam, batch.results.vk);

    // 特定能力通过原实例调用，白名单/任务配置等原生 API 均保留。
    await social.get('steam').resetArea();
    await social.get('vk').setWhiteList({ names: ['keep_this_group'] });
  } finally {
    social.dispose({ disposeModules: true });
  }
}
void main();
```

HTTP 注入、GM 权限、Cookie 权限、认证页面处理和持久化配置仍由各模块管理，整合层不更改这些行为。不需要 Steam 时，不必导入其处理器。用户脚本权限取实际使用模块的要求，参见各模块 README。

当前六个平台均可直接注册：

```ts
const social = new SocialManager({
  steam: steamInstance,
  vk: vkInstance,
  twitch: twitchInstance,
  twitter: twitterInstance,
  reddit: redditInstance,
  youtube: youtubeInstance,
});
```

整合器接收已创建实例，构造时只订阅事件，不执行网络请求。注册键由调用方决定，实例不可重复注册在同一个整合器下。

Steam 应注册 `modules/social/steam` 的 `Steam` 类；SteamWeb/SteamASF 是执行器，没有批量 `do` / `undo` 接口，由 Steam 模块继续管理。

## 初始化与执行

- `init(platform, options?)`：初始化一个平台，返回 `boolean | 'skip'`。参数由平台类型约束，如 Steam 接受 `'store'`、`'community'`、`'all'`，VK 不接受这些参数。
- `initAll(options?)`：按注册顺序初始化所有注册平台，返回 `{ success, results: { [platform]: boolean | 'skip' } }`。`'skip'` 视为非失败。
- `do(platform, options)` / `undo(platform, options)`：原样返回该平台的布尔结果或逐链接结果。
- `doAll(payload)` / `undoAll(payload)`：仅执行 payload 显式指定的平台，按输入键顺序执行，返回 `{ success, results: { [platform]: 原平台结果 } }`。未提供或值为 `undefined` 的平台不执行。
- `get(platform)`：返回具体类型的原实例，可调用平台特有方法。

同一平台通过整合器发起的初始化和任务排队执行；不同平台单独发起的调用可并行。通过 `get()` 发起的原生调用不经过整合器队列，需要调用方安排顺序。

不会自动初始化或自动重试写操作。调用方应先 `init`。单个平台返回失败或抛异常不会阻止后续平台执行；抛异常转换为 `false` 和 `MODULE_EXCEPTION`，不输出可能含凭据的异常原文。汇总成功需要所有已执行平台成功，保留全部逐链接结果。

## 事件与清理

`on('status', listener)` 返回取消订阅函数。事件保留原来的操作 ID、父操作 ID、状态码、目标及时间戳，额外增加：

- `platform`：注册键，如 `steam`、`vk`。
- `origin: 'module'`：原模块事件。Steam 的 `source: 'steam' | 'steamWeb' | 'steamASF'` 保留。
- `origin: 'manager'`：整合器调用事件，操作名为 `social.init` 或 `social.do` / `social.undo`。可仅订阅这类事件以输出简洁的整体结果。

两类事件有各自的操作 ID，整合器不会重写原模块的父子关系。每个开始的整合器调用在正常订阅期间有一个终态；监听器同步抛错或异步拒绝不影响任务。

`dispose()` 默认只解除事件订阅、禁止后续调度，传入的模块仍归调用方所有。`dispose({ disposeModules: true })` 同时调用各模块的 `dispose()`，即使其中一个清理失败也继续处理其余模块。

已排队但未执行的调用返回 `false`；已经发送的网络操作不能撤销。清理后不再转发事件，也不执行地区恢复、停止游戏等业务操作；需要这些操作时先调用对应原生方法。

## 基类与公共辅助函数

`Social<Params, Init, Tasks>` 提供以下受保护方法，与原类职责一致：

- `createTaskResult()`：创建 `{ success: true, results: {} }`。
- `setTaskResult(result, type, value, success)`：添加逐项结果，累计整体成功状态。
- `getRealParams(name, links, doTask, link2param)`：转换链接；撤销时合并 `tasks[name]`；去重。

同名纯函数也从 `modules/social/social` 导出，供不使用继承的模块复用。纯函数版 `getRealParams(links, doTask, recorded, link2param)` 显式接收已记录任务。

与旧基类相比，类型均为模块内显式导出，`tasks` 通过公共抽象 getter 暴露，补充 `on`/`dispose` 结构契约；辅助函数不再调用日志/弹窗，转换器异常交由调用方处理，不伪装为空任务成功。

```ts
import { SocialAdapter, Social } from './modules/social/social';

const wrapped = new SocialAdapter(vkInstance);
wrapped instanceof Social; // true
await wrapped.init();
await wrapped.do({ nameLinks: ['https://vk.com/example'] });
// wrapped.client 仍保留 Vk 原生类型和方法。
```

## 验证

```sh
node node_modules/typescript/bin/tsc -p modules/social/social/tsconfig.json
node node_modules/eslint/bin/eslint.js --config modules/social/social/eslint.config.mjs modules/social/social modules/social/index.ts
node --test modules/social/social/tests/social.test.cjs
```

类型测试检查六个平台的兼容性及错误参数拒绝。运行测试覆盖继承与适配、结果聚合、失败隔离、执行顺序、事件、清理，以及 Steam/VK 真实模块通过模拟 HTTP/GM 联合运行。不会操作真实账户。
