import type { Context } from './context';

export async function loadCache(ctx: Context): Promise<void> {
  const saved = await ctx.storage.get<Record<string, unknown>>('cache', {});
  ctx.state.cache = Object.assign(Object.create(null), Object.fromEntries(
    Object.entries(saved || {}).filter(([, value]) => {
      return typeof value === 'string' && /^\d+$/.test(value);
    })
  ));
}
export async function setCache(ctx: Context, name: string, id: string): Promise<void> {
  ctx.state.cache[name.toLowerCase()] = id;
  const write = ctx.state.writes.then(() => {
    return ctx.storage.set('cache', ctx.state.cache);
  });
  ctx.state.writes = write.catch(() => {
    return undefined;
  });
  await write;
}
