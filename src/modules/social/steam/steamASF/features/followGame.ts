/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamASF/features/followGame.ts
 * @Description  : Steam ASF 游戏关注与取消关注
 */

import { execute, requireId } from '../commands';
import type { Context } from '../context';
import { checkGame } from './gameStatus';

/**
 * 根据操作方向关注游戏或取消关注游戏。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param gameId - Steam 游戏标识。
 * @param doTask - 是否执行任务；为 false 时执行撤销操作。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
function executeFollowGame(ctx: Context, gameId: string, doTask: boolean): Promise<boolean> {
  return ctx.run(doTask ? 'game.follow' : 'game.unfollow', gameId, false, async (child) => {
    requireId(gameId);
    const status = await checkGame(child, gameId);
    if (status.followed === doTask) {
      child.progress('ALREADY_SATISFIED');
      return true;
    }
    return execute(child, `!${doTask ? '' : 'UN'}FOLLOWGAME ${child.bot} ${gameId}`);
  });
}

/**
 * 关注游戏。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param gameId - Steam 游戏标识。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function doFollowGame(ctx: Context, gameId: string): Promise<boolean> {
  return executeFollowGame(ctx, gameId, true);
}
/**
 * 取消关注游戏。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param gameId - Steam 游戏标识。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function undoFollowGame(ctx: Context, gameId: string): Promise<boolean> {
  return executeFollowGame(ctx, gameId, false);
}
