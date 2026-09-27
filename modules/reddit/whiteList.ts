import type { Context } from './context';
import type { RedditTasks } from './types';

export function validateWhiteList(value: unknown): RedditTasks {
  const reddits = (value as Partial<RedditTasks> | null)?.reddits;
  if (!Array.isArray(reddits) || !reddits.every((name) => typeof name === 'string' && /^[A-Za-z0-9_-]+$/.test(name))) {
    throw new Error('INVALID_WHITELIST');
  }
  return { reddits: [...new Set(reddits)] };
}

export async function loadWhiteList(ctx: Context): Promise<void> {
  ctx.state.whiteList = validateWhiteList(await ctx.storage.get('whiteList', { reddits: [] }));
}

export function setWhiteList(ctx: Context, value: RedditTasks): Promise<boolean> {
  return ctx.run('whiteList.save', undefined, async (ctx) => {
    if (ctx.state.disposed) return ctx.fail('DISPOSED');
    try {
      const validated = validateWhiteList(value);
      await ctx.storage.set('whiteList', validated);
      ctx.state.whiteList = validated;
      return true;
    } catch { return ctx.fail('WHITELIST_SAVE_FAILED'); }
  }, Boolean);
}
