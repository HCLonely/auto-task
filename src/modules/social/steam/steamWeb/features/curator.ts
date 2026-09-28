/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamWeb/features/curator.ts
 * @Description  : Steam 网页端 鉴赏家关注与取消关注
 */

import type { Context } from '../context';
import { encodeForm } from '../utils/html';

/**
 * 根据操作方向关注鉴赏家或取消关注鉴赏家。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param curatorId - Steam 鉴赏家标识。
 * @param doTask - 是否执行任务；为 false 时执行撤销操作；默认值为 `true`。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
async function executeCurator(ctx: Context, curatorId: string, doTask = true): Promise<boolean> {
  return ctx.run(doTask ? 'curator.doCurator' : 'curator.undoCurator', curatorId, async (ctx): Promise<boolean> => {
    if (ctx.state.disposed || !ctx.state.storeInitialized) {
      ctx.progress(ctx.state.disposed ? 'DISPOSED' : 'AUTH_REQUIRED', 'error');
      return false;
    }
    try {
      const stepStatus = ctx.step(doTask ? 'followingCurator' : 'unfollowingCurator', curatorId);
      const {
        result, data
      } = await ctx.request({
        url: 'https://store.steampowered.com/curators/ajaxfollow',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: encodeForm({
          clanid: curatorId,
          sessionid: ctx.state.auth.storeSessionID,
          follow: doTask
        }),
        dataType: 'json'
      });
      if (result !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (data?.response?.success?.success === 25) {
        stepStatus.error('curatorLimitNotice');
        return false;
      }
      if (data?.status !== 200 || data.response?.success?.success !== 1) {
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
