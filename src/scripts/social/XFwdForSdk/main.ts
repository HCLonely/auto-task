/*
 * @Author       : HCLonely
 * @Date         : 2025-06-11 16:29:42
 * @LastEditTime : 2025-08-18 19:11:31
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/social/XFwdForSdk/main.ts
 * @Description  : XFwdForSdk
 */

// 参考：https://github.com/fa0311/x-xp-forwarded-for-generater

import { getWasmData } from './getWasmData';
import { debug } from '../../tools/debug';

const getFwdForSdk = async (): Promise<{ str: string, expiryTimeMillis: number}> => {
  debug('开始获取 XFwdForSdk');
  const wasmData = await getWasmData();
  debug('获取 wasmData 成功', { wasmData });
  // @ts-ignore
  const go = new Go();

  const wasmModule = await WebAssembly.instantiate(wasmData, {
    ...go.importObject,
    env: {
      ...go.importObject.env,
      memory: new WebAssembly.Memory({
        initial: 10
      }),
      table: new WebAssembly.Table({
        initial: 0,
        element: 'anyfunc'
      })
    }
  });
  debug('初始化 wasmModule 成功');
  // @ts-ignore
  go.run(wasmModule.instance);
  debug('运行 wasmModule 成功');
  // @ts-ignore
  const { str, expiryTimeMillis } = await globalThis.getForwardedForStr();
  debug('获取 XFwdForSdk 成功', { str, expiryTimeMillis });
  return {
    str,
    expiryTimeMillis: parseInt(expiryTimeMillis, 10)
  };
};

export { getFwdForSdk };
