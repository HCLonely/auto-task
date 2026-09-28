import type { Context } from './context';

/** Repost IDs are account-specific; never use another account's cached post ID. */
export async function loadCache(ctx: Context): Promise<void> {
  const saved = await ctx.storage.get<Record<string, unknown>>(`cache:${ctx.state.userId}`, {});
  ctx.state.cache = Object.assign(Object.create(null), Object.fromEntries(Object.entries(saved || {})
    .filter(([, id]) => {
      return (typeof id === 'string' || typeof id === 'number') && /^\d+$/.test(String(id));
    })
    .map(([name, id]) => {
      return [name, String(id)];
    })));
}

export async function setCache(ctx: Context, name: string, id?: string): Promise<void> {
  if (id) {
    ctx.state.cache[name] = id;
  } else {
    delete ctx.state.cache[name];
  }
  const snapshot = {
    ...ctx.state.cache
  };
  const write = ctx.state.writes.then(() => {
    return ctx.storage.set(`cache:${ctx.state.userId}`, snapshot);
  });
  ctx.state.writes = write.catch(() => {
    return undefined;
  });
  await write;
}
