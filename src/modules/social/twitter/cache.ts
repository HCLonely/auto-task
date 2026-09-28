/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitter/cache.ts
 * @Description  : Twitter 缓存读取与更新
 */

import type { Context } from './context';

/**
 * 从持久化存储读取模块缓存。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns 在操作完成后兑现的 Promise。
 */
export async function loadCache(ctx: Context): Promise<void> {
  const saved = await ctx.storage.get<Record<string, unknown>>('cache', {});
  ctx.state.cache = Object.assign(Object.create(null), Object.fromEntries(
    Object.entries(saved || {}).filter(([, value]) => {
      return typeof value === 'string' && /^\d+$/.test(value);
    })
  ));
}
/**
 * 更新模块缓存并写入持久化存储。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @param id - 目标标识。
 * @returns 在操作完成后兑现的 Promise。
 */
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
