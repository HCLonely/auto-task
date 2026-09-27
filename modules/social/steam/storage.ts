import type { Context } from './context';
import { createTasks } from './defaults';
import type { PlayState, SteamTasks } from './types';

export async function loadState(ctx: Context): Promise<void> {
  if (ctx.state.loaded) return;
  const savedTasks = await ctx.storage.get<Partial<SteamTasks>>('tasks', {});
  const savedWhiteList = await ctx.storage.get<Partial<SteamTasks>>('whiteList', {});
  ctx.state.tasks = createTasks(savedTasks);
  ctx.state.whiteList = createTasks({ ...savedWhiteList, ...ctx.options.whiteList });
  ctx.state.loaded = true;
}
export async function getPlayState(ctx: Context): Promise<PlayState> {
  const value = await ctx.storage.get<Partial<PlayState>>(playStateKey(ctx), {});
  return {
    stopPlayTime: Number.isFinite(value?.stopPlayTime) ? value.stopPlayTime! : 0,
    playedGames: Array.isArray(value?.playedGames) ? value.playedGames.filter((id) => typeof id === 'string') : [],
    taskLink: Array.isArray(value?.taskLink) ? value.taskLink.filter((url) => typeof url === 'string') : []
  };
}

export function playStateKey(ctx: Context): string {
  return `playState:${encodeURIComponent(ctx.options.ASF.AsfIpcUrl)}:${encodeURIComponent(ctx.options.ASF.AsfBotname)}`;
}
