/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamWeb/features/followGame.ts
 * @Description  : Steam 网页端 游戏关注与取消关注
 */

import type { Context } from '../context';
import { encodeForm, parseHTML } from '../utils/html';
import { changeArea } from './region';

/**
 * 根据操作方向关注游戏或取消关注游戏。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param gameId - Steam 游戏标识。
 * @param doTask - 是否执行任务；为 false 时执行撤销操作。
 * @param retried - 是否已经重试；默认值为 `false`。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
async function executeFollowGame(ctx: Context, gameId: string, doTask: boolean, retried = false): Promise<boolean> {
  return ctx.run(doTask ? 'followGame.doFollowGame' : 'followGame.undoFollowGame', gameId, async (ctx) => {
    if (ctx.state.disposed || !ctx.state.storeInitialized) {
      ctx.progress(ctx.state.disposed ? 'DISPOSED' : 'AUTH_REQUIRED', 'error');
      return false;
    }
    try {
      ctx.progress(doTask ? 'followingGame' : 'unfollowingGame');
      const {
        result, data
      } = await ctx.request({
        url: 'https://store.steampowered.com/explore/followgame/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: encodeForm({
          sessionid: ctx.state.auth.storeSessionID,
          appid: gameId,
          ...(!doTask ? {
            unfollow: '1'
          } : {})
        })
      });
      if (result === 'Success' && data?.status === 200 && data.responseText.trim() === 'true') {
        return true;
      }
      const followed = await isFollowedGame(ctx, gameId);
      if (!retried && ctx.state.area === 'CN' && followed === 'areaLocked') {
        const changed = await changeArea(ctx);
        if (typeof changed !== 'string' || changed === 'skip' || changed === 'CN') {
          return false;
        }
        return executeFollowGame(ctx, gameId, doTask, true);
      }
      return typeof followed === 'boolean' && followed === doTask;
    } catch {
      ctx.reportError();
      return false;
    }
  });
}

/**
 * 返回 null 表示查询失败，与查询成功但尚未关注的 false 区分。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param gameId - Steam 游戏标识。
 * @returns Promise，完成后返回是否已关注；查询失败时返回 null。
 */
export async function isFollowedGame(ctx: Context, gameId: string): Promise<boolean | 'areaLocked' | null> {
  return ctx.run('followGame.isFollowedGame', gameId, async (ctx) => {
    try {
      const {
        result, data
      } = await ctx.request({
        url: `https://store.steampowered.com/app/${gameId}`,
        method: 'GET'
      });
      if (result !== 'Success' || data?.status !== 200) {
        return null;
      }
      if (data.responseText.includes('id="error_box"')) {
        return 'areaLocked';
      }
      const page = parseHTML(data.responseText);
      const control = page.querySelector('.queue_control_button.queue_btn_follow');
      if (!control) {
        return null;
      }
      const active = control.querySelector<HTMLElement>('.btnv6_blue_hoverfade.btn_medium.queue_btn_active');
      return Boolean(active && !active.hidden && active.style.display !== 'none');
    } catch {
      ctx.reportError();
      return null;
    }
  }, (value) => {
    return typeof value === 'boolean';
  });
}

/**
 * 关注游戏。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param gameId - Steam 游戏标识。
 * @param retried - 是否已经重试；默认值为 `false`。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function doFollowGame(ctx: Context, gameId: string, retried = false): Promise<boolean> {
  return executeFollowGame(ctx, gameId, true, retried);
}
/**
 * 取消关注游戏。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param gameId - Steam 游戏标识。
 * @param retried - 是否已经重试；默认值为 `false`。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function undoFollowGame(ctx: Context, gameId: string, retried = false): Promise<boolean> {
  return executeFollowGame(ctx, gameId, false, retried);
}
