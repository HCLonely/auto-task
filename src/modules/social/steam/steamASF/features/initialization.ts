/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamASF/features/initialization.ts
 * @Description  : Steam ASF 连接与授权初始化
 */

import type { Context } from '../context';

/**
 * 初始化运行环境与授权状态。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function initialize(ctx: Context): Promise<boolean> {
  if (ctx.state.initializing) {
    return ctx.state.initializing;
  }
  const work = ctx.run('init', undefined, false, async (child) => {
    if (child.state.initialized) {
      return true;
    }
    await child.command('!stats');
    child.state.initialized = true;
    return true;
  });
  ctx.state.initializing = work.finally(() => {
    ctx.state.initializing = undefined;
  });
  return ctx.state.initializing;
}
