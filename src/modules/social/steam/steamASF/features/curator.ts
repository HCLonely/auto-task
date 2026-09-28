/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamASF/features/curator.ts
 * @Description  : Steam ASF 鉴赏家关注与取消关注
 */

import { execute, requireId } from '../commands';
import type { Context } from '../context';

/**
 * 根据操作方向关注鉴赏家或取消关注鉴赏家。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param curatorId - Steam 鉴赏家标识。
 * @param doTask - 是否执行任务；为 false 时执行撤销操作；默认值为 `true`。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
function executeCurator(ctx: Context, curatorId: string, doTask = true): Promise<boolean> {
  return ctx.run(doTask ? 'curator.follow' : 'curator.unfollow', curatorId, false, async (child) => {
    requireId(curatorId);
    return execute(child, `!${doTask ? '' : 'UN'}FOLLOWCURATOR ${child.bot} ${curatorId}`);
  });
}

/**
 * 关注鉴赏家。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param curatorId - Steam 鉴赏家标识。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function doCurator(ctx: Context, curatorId: string): Promise<boolean> {
  return executeCurator(ctx, curatorId, true);
}
/**
 * 取消关注鉴赏家。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param curatorId - Steam 鉴赏家标识。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function undoCurator(ctx: Context, curatorId: string): Promise<boolean> {
  return executeCurator(ctx, curatorId, false);
}
