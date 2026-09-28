/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamASF/features/unsupported.ts
 * @Description  : Steam ASF 不支持操作的结果处理
 */

import type { Context } from '../context';

/**
 * 返回不支持当前操作的结果。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function unsupported(ctx: Context, name: string): Promise<boolean> {
  return ctx.run(name, undefined, false, async (child) => {
    child.progress('ASF_UNSUPPORTED', undefined, 'warning');
    return false;
  });
}
