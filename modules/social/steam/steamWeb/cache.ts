import type { Context } from './context';
import type { CacheType, SteamCache } from './types';

export async function loadCache(ctx: Context): Promise<void> {
  if (ctx.state.cacheLoaded) return;
  if (!ctx.state.cacheLoading) {
    ctx.state.cacheLoading = (async () => {
      const saved = await ctx.storage.get<Partial<SteamCache>>('cache', {});
      for (const type of Object.keys(ctx.state.cache) as CacheType[]) {
        const entries = saved && typeof saved[type] === 'object' ? saved[type] : {};
        ctx.state.cache[type] = Object.assign(Object.create(null), Object.fromEntries(
          Object.entries(entries || {}).filter(([, value]) => typeof value === 'string')
        ));
      }
      ctx.state.cacheLoaded = true;
    })().finally(() => { ctx.state.cacheLoading = undefined; });
  }
  await ctx.state.cacheLoading;
}

export async function setCache(ctx: Context, type: CacheType, name: string, id: string): Promise<void> {
  ctx.state.cache[type][name] = id;
  const write = ctx.state.cacheWrites.then(() => ctx.storage.set('cache', ctx.state.cache));
  ctx.state.cacheWrites = write.catch(() => undefined);
  await write;
}
