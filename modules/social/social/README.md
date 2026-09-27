# Social 独立基类与适配器

项目 `src/scripts/social/` 通过兼容包装接入本目录，详见 [项目接入说明](../../../src/scripts/social/README.md)。本目录不引用 `src`，不依赖 GM、HTTP、日志工具、全局任务类型或第三方运行库。

| 导出 | 用途 |
| --- | --- |
| `Social`（默认导出） | 抽象基类，保留 `init`、`do` / `undo` 与结果/任务参数辅助方法 |
| `SocialAdapter` | 将现有独立模块包装为 `Social`，不修改模块本身 |

已有模块继续支持单独复制使用，无需依赖本目录。`SocialModule` 定义适配器所需的结构接口；初始化、任务执行、状态监听和清理由各模块实例负责。

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
```
