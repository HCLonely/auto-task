/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamWeb/features/forum.ts
 * @Description  : Steam 网页端 论坛订阅与取消订阅
 */

import { setCache } from '../cache';
import type { Context } from '../context';
import { encodeForm } from '../utils/html';

/**
 * 根据操作方向订阅论坛或取消订阅论坛。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param gameId - Steam 游戏标识。
 * @param doTask - 是否执行任务；为 false 时执行撤销操作；默认值为 `true`。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
async function executeForum(ctx: Context, gameId: string, doTask = true): Promise<boolean> {
  return ctx.run(doTask ? 'forum.doForum' : 'forum.undoForum', gameId, async (ctx): Promise<boolean> => {
    if (ctx.state.disposed || !ctx.state.communityInitialized) {
      ctx.progress(ctx.state.disposed ? 'DISPOSED' : 'AUTH_REQUIRED', 'error');
      return false;
    }
    try {
      const forumId = await getForumId(ctx, gameId);
      if (!forumId) {
        return false;
      }
      const stepStatus = ctx.step(`${doTask ? '' : 'un'}subscribingForum`, gameId);
      const [id, feature] = forumId.split('_');
      const {
        result, data
      } = await ctx.request({
        url: `https://steamcommunity.com/forum/${id}/General/${doTask ? '' : 'un'}subscribe/${feature || '0'}/`,
        method: 'POST',
        responseType: 'json',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: encodeForm({
          sessionid: ctx.state.auth.communitySessionID
        })
      });
      if (result !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (data?.status !== 200 || (data.response?.success !== 1 && data.response?.success !== 29)) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      stepStatus.success('STEP_COMPLETED');
      return true;
    } catch (error) {
      ctx.reportError();
      return false;
    }
  });
}

/**
 * 查询 Steam 论坛标识。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param gameId - Steam 游戏标识。
 * @returns Promise，完成后返回处理后的字符串；未取得有效结果时返回 false。
 */
export async function getForumId(ctx: Context, gameId: string): Promise<false | string> {
  return ctx.run('forum.getForumId', gameId, async (ctx): Promise<false | string> => {
    try {
      const stepStatus = ctx.step('gettingForumId', gameId);
      const cachedForumId = ctx.state.cache.forum[gameId];
      if (cachedForumId) {
        stepStatus.success('STEP_COMPLETED');
        return cachedForumId;
      }
      const {
        result, data
      } = await ctx.request({
        url: `https://steamcommunity.com/app/${gameId}/discussions/`,
        method: 'GET'
      });
      if (result !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (data?.status !== 200) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      const matchedForumId = data.responseText?.match(/General_([\d]+(_[\d]+)?)/)?.[1];
      if (!matchedForumId) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      await setCache(ctx, 'forum', gameId, matchedForumId);
      stepStatus.success('STEP_COMPLETED');
      return matchedForumId;
    } catch (error) {
      ctx.reportError();
      return false;
    }
  });
}

/**
 * 订阅论坛。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param gameId - Steam 游戏标识。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function doForum(ctx: Context, gameId: string): Promise<boolean> {
  return executeForum(ctx, gameId, true);
}
/**
 * 取消订阅论坛。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param gameId - Steam 游戏标识。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function undoForum(ctx: Context, gameId: string): Promise<boolean> {
  return executeForum(ctx, gameId, false);
}
