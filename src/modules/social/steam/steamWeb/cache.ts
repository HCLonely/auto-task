/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamWeb/cache.ts
 * @Description  : Steam 网页端 缓存读取与更新
 */

import type { Context } from './context';
import type { CacheType, SteamCache } from './types';

/**
 * 从持久化存储读取模块缓存。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns 在操作完成后兑现的 Promise。
 */
export async function loadCache(ctx: Context): Promise<void> {
  if (ctx.state.cacheLoaded) {
    return;
  }
  if (!ctx.state.cacheLoading) {
    ctx.state.cacheLoading = (async () => {
      const saved = await ctx.storage.get<Partial<SteamCache>>('cache', {});
      for (const type of Object.keys(ctx.state.cache) as CacheType[]) {
        const entries = saved && typeof saved[type] === 'object' ? saved[type] : {};
        ctx.state.cache[type] = Object.assign(Object.create(null), Object.fromEntries(
          Object.entries(entries || {}).filter(([, value]) => {
            return typeof value === 'string';
          })
        ));
      }
      ctx.state.cacheLoaded = true;
    })().finally(() => {
      ctx.state.cacheLoading = undefined;
    });
  }
  await ctx.state.cacheLoading;
}

/**
 * 更新模块缓存并写入持久化存储。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param type - 操作或数据类型。
 * @param name - 目标名称。
 * @param id - 目标标识。
 * @returns 在操作完成后兑现的 Promise。
 */
export async function setCache(ctx: Context, type: CacheType, name: string, id: string): Promise<void> {
  ctx.state.cache[type][name] = id;
  const write = ctx.state.cacheWrites.then(() => {
    return ctx.storage.set('cache', ctx.state.cache);
  });
  ctx.state.cacheWrites = write.catch(() => {
    return undefined;
  });
  await write;
}
