/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/vk/features/groups.ts
 * @Description  : VK 群组加入与退出
 */

import type { Context } from '../context';
import type { GroupParams } from '../types';

/**
 * 根据操作方向加入群组或退出群组。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @param params - 操作参数集合。
 * @param doTask - 是否执行任务；为 false 时执行撤销操作；默认值为 `true`。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
function executeGroup(ctx: Context, name: string, params: GroupParams, doTask = true): Promise<boolean> {
  return ctx.run(doTask ? 'group.join' : 'group.leave', name, false, async (ctx) => {
    if (params.isMember === (doTask ? '1' : '0')) {
      return ctx.skip('ALREADY_IN_DESIRED_STATE');
    }
    const result = await ctx.api(`groups.${doTask ? 'join' : 'leave'}`, {
      group_id: params.groupId,
      source: '',
      track_code: ''
    }, 'web.api.vk.com', name);
    if (result !== 1) {
      return ctx.fail('INVALID_RESPONSE');
    }
    if (doTask) {
      ctx.record(name);
    }
    return true;
  });
}

/**
 * 加入群组。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @param params - 操作参数集合。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function doGroup(ctx: Context, name: string, params: GroupParams): Promise<boolean> {
  return executeGroup(ctx, name, params, true);
}
/**
 * 退出群组。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @param params - 操作参数集合。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function undoGroup(ctx: Context, name: string, params: GroupParams): Promise<boolean> {
  return executeGroup(ctx, name, params, false);
}
