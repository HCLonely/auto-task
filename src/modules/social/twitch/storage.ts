import { pickAuth, validAuth } from './auth/data';
import type { Context } from './context';
import { object } from './graphql';

export function channels(value: unknown): string[] {
  return Array.isArray(value) ? [...new Set(value.filter((v): v is string => {
    return typeof v === 'string' && /^[a-zA-Z0-9_]+$/.test(v);
  }).map((v) => {
    return v.toLowerCase();
  }))] : [];
}
export async function loadState(ctx: Context): Promise<void> {
  if (ctx.state.loaded) {
    return;
  }
  const [auth, cache, tasks, whiteList] = await Promise.all([
    ctx.storage.get<unknown>('auth', null), ctx.storage.get<unknown>('cache', {}),
    ctx.storage.get<unknown>('tasks', {}), ctx.storage.get<unknown>('whiteList', {})
  ]);
  ctx.state.auth = validAuth(auth) ? pickAuth(auth) : undefined;
  ctx.state.cache = Object.assign(Object.create(null), Object.fromEntries(Object.entries(object(cache))
    .filter(([key, value]) => {
      return /^[a-z0-9_]+$/.test(key) && typeof value === 'string' && /^\d+$/.test(value);
    })));
  if (!ctx.state.tasksOverridden && ctx.state.tasks.channels.length === 0) {
    ctx.state.tasks = {
      channels: channels(object(tasks).channels)
    };
  }
  if (!ctx.state.whiteListOverridden && ctx.state.whiteList.channels.length === 0) {
    ctx.state.whiteList = {
      channels: channels(object(whiteList).channels)
    };
  }
  ctx.state.loaded = true;
}
