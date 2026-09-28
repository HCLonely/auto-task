/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamWeb/features/workshop.ts
 * @Description  : Steam 网页端 创意工坊收藏与点赞
 */

import { setCache } from '../cache';
import type { Context } from '../context';
import { encodeForm } from '../utils/html';

/**
 * 根据操作方向收藏创意工坊项目或取消收藏创意工坊项目。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param id - 目标标识。
 * @param doTask - 是否执行任务；为 false 时执行撤销操作；默认值为 `true`。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
async function executeFavoriteWorkshop(ctx: Context, id: string, doTask = true): Promise<boolean> {
  return ctx.run(doTask ? 'workshop.doFavoriteWorkshop' : 'workshop.undoFavoriteWorkshop', id, async (ctx): Promise<boolean> => {
    if (ctx.state.disposed || !ctx.state.communityInitialized) {
      ctx.progress(ctx.state.disposed ? 'DISPOSED' : 'AUTH_REQUIRED', 'error');
      return false;
    }
    try {
      const appid = await getWorkshopAppId(ctx, id);
      if (!appid) {
        return false;
      }
      const stepStatus = ctx.step(doTask ? 'favoritingWorkshop' : 'unfavoritingWorkshop', id);
      const {
        result, data
      } = await ctx.request({
        url: `https://steamcommunity.com/sharedfiles/${doTask ? '' : 'un'}favorite`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: encodeForm({
          id,
          appid,
          sessionid: ctx.state.auth.communitySessionID
        })
      });
      if (result !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (data?.status !== 200 || data.responseText) {
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
 * 查询创意工坊项目所属的应用标识。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param id - 目标标识。
 * @returns Promise，完成后返回处理后的字符串；未取得有效结果时返回 false。
 */
export async function getWorkshopAppId(ctx: Context, id: string): Promise<false | string> {
  return ctx.run('workshop.getWorkshopAppId', id, async (ctx): Promise<false | string> => {
    try {
      const stepStatus = ctx.step('gettingWorkshopAppId', id);
      const cachedAppId = ctx.state.cache.workshop[id];
      if (cachedAppId) {
        stepStatus.success('STEP_COMPLETED');
        return cachedAppId;
      }
      const {
        result, data
      } = await ctx.request({
        url: `https://steamcommunity.com/sharedfiles/filedetails/?id=${id}`,
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
      const matchedAppId = data.responseText.match(/<input type="hidden" name="appid" value="([\d]+?)" \/>/)?.[1];
      if (!matchedAppId) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      await setCache(ctx, 'workshop', id, matchedAppId);
      return matchedAppId;
    } catch (error) {
      ctx.reportError();
      return false;
    }
  });
}

/**
 * 为创意工坊项目点赞。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param id - 目标标识。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export async function voteUpWorkshop(ctx: Context, id: string): Promise<boolean> {
  return ctx.run('workshop.voteUpWorkshop', id, async (ctx): Promise<boolean> => {
    if (ctx.state.disposed || !ctx.state.communityInitialized) {
      ctx.progress(ctx.state.disposed ? 'DISPOSED' : 'AUTH_REQUIRED', 'error');
      return false;
    }
    try {
      const stepStatus = ctx.step('votingUpWorkshop', id);
      const {
        result, data
      } = await ctx.request({
        url: 'https://steamcommunity.com/sharedfiles/voteup',
        method: 'POST',
        responseType: 'json',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: encodeForm({
          id,
          sessionid: ctx.state.auth.communitySessionID
        })
      });
      if (result !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (data?.status !== 200 || data.response?.success !== 1) {
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
 * 收藏创意工坊项目。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param id - 目标标识。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function doFavoriteWorkshop(ctx: Context, id: string): Promise<boolean> {
  return executeFavoriteWorkshop(ctx, id, true);
}
/**
 * 取消收藏创意工坊项目。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param id - 目标标识。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function undoFavoriteWorkshop(ctx: Context, id: string): Promise<boolean> {
  return executeFavoriteWorkshop(ctx, id, false);
}
