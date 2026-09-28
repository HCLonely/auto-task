/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamASF/features/wishlist.ts
 * @Description  : Steam ASF 愿望单添加与移除
 */

import { execute, requireId } from '../commands';
import type { Context } from '../context';
import { checkGame } from './gameStatus';

/**
 * 按操作方向更新游戏愿望单。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param gameId - Steam 游戏标识。
 * @param add - 是否添加；为 false 时移除。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
function updateWishlist(ctx: Context, gameId: string, add: boolean): Promise<boolean> {
  return ctx.run(add ? 'wishlist.add' : 'wishlist.remove', gameId, false, async (child) => {
    requireId(gameId);
    const status = await checkGame(child, gameId);
    if (status.wishlist === add) {
      child.progress('ALREADY_SATISFIED');
      return true;
    }
    return execute(child, `!${add ? 'ADD' : 'REMOVE'}WISHLIST ${child.bot} ${gameId}`);
  });
}
/**
 * 将游戏添加到愿望单。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param gameId - Steam 游戏标识。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function addToWishlist(ctx: Context, gameId: string): Promise<boolean> {
  return updateWishlist(ctx, gameId, true);
}
/**
 * 将游戏从愿望单移除。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param gameId - Steam 游戏标识。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function removeFromWishlist(ctx: Context, gameId: string): Promise<boolean> {
  return updateWishlist(ctx, gameId, false);
}
