/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/storage.ts
 * @Description  : Steam 状态持久化存储
 */

import type { Context } from './context';
import { createTasks } from './defaults';
import type { PlayState, SteamTasks } from './types';

/**
 * 读取模块持久化状态。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns 在操作完成后兑现的 Promise。
 */
export async function loadState(ctx: Context): Promise<void> {
  if (ctx.state.loaded) {
    return;
  }
  const savedTasks = await ctx.storage.get<Partial<SteamTasks>>('tasks', {});
  const savedWhiteList = await ctx.storage.get<Partial<SteamTasks>>('whiteList', {});
  ctx.state.tasks = createTasks(savedTasks);
  ctx.state.whiteList = createTasks({
    ...savedWhiteList,
    ...ctx.options.whiteList
  });
  ctx.state.loaded = true;
}
/**
 * 读取游戏时长任务的运行状态。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns Promise，完成后返回游戏时长任务的运行状态。
 */
export async function getPlayState(ctx: Context): Promise<PlayState> {
  const value = await ctx.storage.get<Partial<PlayState>>(playStateKey(ctx), {});
  return {
    stopPlayTime: Number.isFinite(value?.stopPlayTime) ? value.stopPlayTime! : 0,
    playedGames: Array.isArray(value?.playedGames) ? value.playedGames.filter((id) => {
      return typeof id === 'string';
    }) : [],
    taskLink: Array.isArray(value?.taskLink) ? value.taskLink.filter((url) => {
      return typeof url === 'string';
    }) : []
  };
}

/**
 * 生成游戏时长任务的存储键。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns 处理后的字符串。
 */
export function playStateKey(ctx: Context): string {
  return `playState:${encodeURIComponent(ctx.options.ASF.AsfIpcUrl)}:${encodeURIComponent(ctx.options.ASF.AsfBotname)}`;
}
