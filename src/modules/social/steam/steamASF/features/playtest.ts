/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamASF/features/playtest.ts
 * @Description  : Steam ASF 游戏测试资格申请
 */

import { execute, requireId } from '../commands';
import type { Context } from '../context';

/**
 * 申请游戏测试资格。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param id - 目标标识。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function requestPlayTestAccess(ctx: Context, id: string): Promise<boolean> {
  return ctx.run('playtest.request', id, false, async (child) => {
    requireId(id);
    return execute(child, `!REQUESTACCESS ${child.bot} ${id}`);
  });
}
