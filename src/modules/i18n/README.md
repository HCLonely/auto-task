# i18n 模块

翻译逻辑和中英文语言包均位于此目录，不依赖项目配置、DOM 或 GM API。
运行 `npm run rollup` 生成 `dist/auto-task.i18n.js`（UMD），支持 CommonJS 和油猴 `@require`。

## Node.js require

在项目根目录运行：

```js
const { createI18n } = require('./src/modules/i18n');
const __ = createI18n('zh');
console.log(__('logSuccess'));
```

也可直接 `require('./dist/auto-task.i18n.js')`。目录入口指向构建产物，首次使用前需构建。

## 用户脚本 @require

```js
// @require https://github.com/HCLonely/auto-task/raw/main/dist/auto-task.i18n.js

const __ = AutoTaskI18n.createI18n('zh');
console.log(__('initSuccess', 'Steam'));
```

项目头部已加入该依赖，并在网站模块之前加载；全依赖版本会按相同顺序内嵌。

## API

- `createI18n(language?: string | (() => string))`：返回 `(key, ...args) => string` 翻译函数，默认英语。每个实例独立。
- `default`：默认英语翻译函数。
- 支持 `zh`、`en`，其他语言回退到英语。
- `%0`、`%1` 等占位符按参数索引替换，缺少参数替换为空字符串。
- 缺少翻译时输出警告并返回原始键。

传入回调可实时读取语言设置：

```js
let language = 'en';
const __ = createI18n(() => language);
language = 'zh';
console.log(__('logSuccess'));
```

`src/scripts/tools/i18n.ts` 是项目适配层，通过回调读取共享的 `globalOptions.other.language`，原有调用无需修改。

验证：`npm run test`、`npm run rollup`、`node build-all-static.js`、`node --test src/modules/i18n/i18n.test.cjs`。
