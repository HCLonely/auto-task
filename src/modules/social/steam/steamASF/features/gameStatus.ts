/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamASF/features/gameStatus.ts
 * @Description  : Steam ASF 游戏拥有状态检查
 */

import { containsId, requireId } from '../commands';
import { Context, OperationError } from '../context';
import type { GameStatus } from '../types';

/**
 * 检查账号的游戏拥有状态。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param gameId - Steam 游戏标识。
 * @returns Promise，完成后返回游戏拥有状态。
 */
export function checkGame(ctx: Context, gameId: string): Promise<GameStatus> {
  return ctx.run<GameStatus>('gameStatus.check', gameId, {}, async (child) => {
    requireId(gameId);
    const reply = await child.command(`!CHECK ${child.bot} ${gameId}`);
    const rows = reply.split('\n').filter((line) => {
      return containsId(line.split('|').slice(0, -3).join('|'), gameId);
    });
    if (rows.length !== 1) {
      throw new OperationError('INVALID_GAME_STATUS');
    }
    const fields = rows[0].split('|').map((field) => {
      return field.trim();
    });
    if (fields.length <= 3) {
      throw new OperationError('INVALID_GAME_STATUS');
    }
    if (!fields.slice(-3).every((field) => {
      return ['√', '×', '✗', '✘', 'X', 'x', '-'].includes(field);
    })) {
      throw new OperationError('INVALID_GAME_STATUS');
    }
    // Original CHECK format: owned | wishlist | followed. Owned counts as satisfied for wishlist tasks.
    return {
      wishlist: fields.at(-3) === '√' || fields.at(-2) === '√',
      followed: fields.at(-1) === '√'
    };
  });
}
