/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/vk/features/likes.ts
 * @Description  : VK 动态点赞与取消点赞
 */

import type { Context } from '../context';
import { getWall } from './wall';

/**
 * 根据操作方向为动态点赞或取消动态点赞。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @param doTask - 是否执行任务；为 false 时执行撤销操作；默认值为 `true`。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
function executeLikeWall(ctx: Context, name: string, doTask = true): Promise<boolean> {
  return ctx.run(doTask ? 'wall.like' : 'wall.unlike', name, false, async (ctx) => {
    const item = await getWall(ctx, name);
    if (!item) {
      return false;
    }
    if (item.likes?.user_likes === undefined) {
      return ctx.fail('INVALID_RESPONSE');
    }
    if (Boolean(item.likes.user_likes) === doTask) {
      return ctx.skip('ALREADY_IN_DESIRED_STATE');
    }
    const values: Record<string, string | number> = {
      type: item.type,
      owner_id: item.owner_id,
      item_id: item.id,
      track_code: item.track_code || '',
      ref: 'group'
    };
    if (doTask) {
      values.reaction_id = 0;
    }
    const result = await ctx.api(`likes.${doTask ? 'add' : 'delete'}`, values, 'web.api.vk.com', name);
    if (!result || typeof result !== 'object' || !('likes' in result) || typeof result.likes !== 'number') {
      return ctx.fail('INVALID_RESPONSE');
    }
    return true;
  });
}

/**
 * 为动态点赞。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function doLikeWall(ctx: Context, name: string): Promise<boolean> {
  return executeLikeWall(ctx, name, true);
}
/**
 * 取消动态点赞。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function undoLikeWall(ctx: Context, name: string): Promise<boolean> {
  return executeLikeWall(ctx, name, false);
}
