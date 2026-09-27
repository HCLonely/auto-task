import { Context, OperationError } from './context';

export async function loadGroups(ctx: Context, refresh = false): Promise<Record<string, string>> {
  if (ctx.state.loadingGroups) return ctx.state.loadingGroups;
  if (!refresh && ctx.state.groups) return ctx.state.groups;
  const work = (async () => {
    if (!refresh) {
      const stored = await ctx.storage.get<unknown>('groups', null);
      if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
        const entries = Object.entries(stored).filter(([, value]) => typeof value === 'string' && /^\d+$/.test(value));
        if (entries.length) {
          ctx.state.groups = Object.assign(Object.create(null), Object.fromEntries(entries));
          return ctx.state.groups!;
        }
      }
    }
    const reply = await ctx.command(`!GROUPLIST ${ctx.bot}`);
    const groups: Record<string, string> = Object.create(null);
    for (const line of reply.split('\n')) {
      const [, name, id] = line.trim().split('|').map((field) => field.trim());
      if (name && id && /^\d+$/.test(id)) groups[name] = id;
    }
    if (!Object.keys(groups).length) throw new OperationError('GROUP_LIST_INVALID');
    await ctx.storage.set('groups', groups);
    ctx.state.groups = groups;
    return groups;
  })();
  ctx.state.loadingGroups = work.finally(() => { ctx.state.loadingGroups = undefined; });
  return ctx.state.loadingGroups;
}

export async function invalidateGroups(ctx: Context): Promise<void> {
  // Complete an older lookup before invalidating it, so it cannot re-save stale membership.
  try { await ctx.state.loadingGroups; } catch { /* The mutation already succeeded. */ }
  ctx.state.groups = undefined;
  await ctx.storage.delete('groups');
}
