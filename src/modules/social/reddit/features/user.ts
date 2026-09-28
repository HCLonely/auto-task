/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/reddit/features/user.ts
 * @Description  : Reddit 用户关注与取消关注
 */

import type { Context } from '../context';
import { mutate } from './graphql';

/**
 * 查询用户标识。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @returns Promise，完成后返回处理后的字符串；未取得有效结果时返回 false。
 */
export function getUserId(ctx: Context, name: string): Promise<string | false> {
  return ctx.run('user.getId', name, async (ctx) => {
    try {
      const {
        result, data
      } = await ctx.request({
        url: `https://www.reddit.com/user/${encodeURIComponent(name)}`,
        method: 'GET'
      });
      if (result !== 'Success' || data?.status !== 200) {
        return ctx.fail('LOOKUP_FAILED');
      }
      const html = new DOMParser().parseFromString(data.responseText, 'text/html');
      const id = html.querySelector('follow-button[redditor-id]')?.getAttribute('redditor-id');
      return id && /^t2_[a-z0-9]+$/i.test(id) ? id : ctx.fail('USER_ID_MISSING');
    } catch {
      return ctx.fail('LOOKUP_FAILED');
    }
  }, Boolean);
}

/**
 * 根据操作方向关注用户或取消关注用户。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @param follow - 是否关注；为 false 时取消关注。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
async function executeUser(ctx: Context, name: string, follow: boolean): Promise<boolean> {
  const id = await getUserId(ctx, name);
  if (!id) {
    return false;
  }
  return mutate(ctx, 'UpdateProfileFollowState', {
    accountId: id,
    state: follow ? 'FOLLOWED' : 'NONE'
  });
}

/**
 * 关注用户。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function doUser(ctx: Context, name: string): Promise<boolean> {
  return executeUser(ctx, name, true);
}
/**
 * 取消关注用户。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function undoUser(ctx: Context, name: string): Promise<boolean> {
  return executeUser(ctx, name, false);
}
