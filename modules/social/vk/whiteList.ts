import type { Context } from './context';
import type { VkTasks } from './types';
import { normalizeLink } from './utils/targets';

export function normalizeNames(names: string[]): string[] {
  return [...new Set(names.map((name) => normalizeLink(name) || normalizeLink(`https://vk.com/${name}`)).filter((name): name is string => Boolean(name)))];
}
export async function loadWhiteList(ctx: Context): Promise<void> {
  const saved = await ctx.storage.get<Partial<VkTasks>>('whiteList', {});
  const names = Array.isArray(saved?.names) ? saved.names.filter((name): name is string => typeof name === 'string') : [];
  ctx.state.whiteList = { names: normalizeNames([...names, ...ctx.state.whiteList.names]) };
}
export function setWhiteList(ctx: Context, whiteList: VkTasks): Promise<boolean> {
  return ctx.run('whiteList.set', undefined, false, async (ctx) => {
    if (ctx.state.disposed) return ctx.fail('DISPOSED');
    const value = { names: normalizeNames(whiteList.names) };
    await ctx.storage.set('whiteList', value);
    ctx.state.whiteList = value;
    return true;
  });
}
