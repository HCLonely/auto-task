/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamASF/features/playGames.ts
 * @Description  : Steam ASF 游戏运行与停止管理
 */

import { execute, PLAYING, RESUMED, validIds } from '../commands';
import { Context, OperationError } from '../context';
import { getSteamIdASF } from './identity';

/**
 * 启动游戏运行或游戏时长任务。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param ids - 目标标识列表。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function playGames(ctx: Context, ids: string): Promise<boolean> {
  return ctx.run('play.start', ids, false, async (child) => {
    if (!validIds(ids)) {
      throw new OperationError('INVALID_ARGUMENT');
    }
    return execute(child, `!play ${child.bot} ${ids}`, PLAYING);
  });
}

/**
 * 停止正在执行的游戏运行任务。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function stopPlayGames(ctx: Context): Promise<boolean> {
  return ctx.run('play.stop', undefined, false, (child) => {
    return execute(child, `!resume ${child.bot}`, RESUMED);
  });
}

/**
 * 检查 ASF 游戏运行状态。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param ids - 目标标识列表。
 * @returns Promise，完成后返回处理结果（boolean | "skip"）。
 */
export function checkPlayStatus(ctx: Context, ids: string): Promise<'skip' | boolean> {
  return ctx.run<'skip' | boolean>('play.check', ids, false, async (child) => {
    if (!validIds(ids)) {
      throw new OperationError('INVALID_ARGUMENT');
    }
    if (!child.apiKey) {
      child.progress('API_KEY_MISSING');
      return 'skip';
    }
    // Browser login can belong to a different account; only the configured ASF bot is relevant.
    const steamId = await getSteamIdASF(child);
    if (!steamId) {
      child.progress('BOT_ID_UNAVAILABLE');
      return 'skip';
    }
    const query = new URLSearchParams({
      key: child.apiKey,
      steamids: steamId
    });
    const data = await child.request({
      url: `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?${query}`,
      method: 'GET',
      responseType: 'json'
    });
    const players: unknown = data.response?.response?.players;
    if (!Array.isArray(players)) {
      throw new OperationError('PLAYER_STATUS_INVALID');
    }
    const player = players.find((entry) => {
      return entry && typeof entry === 'object' && entry.steamid === steamId;
    });
    if (!player) {
      throw new OperationError('PLAYER_STATUS_UNAVAILABLE');
    }
    const playing = typeof player.gameid === 'string' && ids.split(',').includes(player.gameid);
    child.progress(playing ? 'GAME_PLAYING' : 'GAME_NOT_PLAYING');
    return playing;
  }, () => {
    return true;
  }); // A valid "not playing" answer is a successful query, not a request failure.
}
