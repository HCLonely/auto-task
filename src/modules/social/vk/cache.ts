/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/vk/cache.ts
 * @Description  : VK 缓存读取与更新
 */

import type { Context } from './context';

/**
 * 转发标识与账号绑定；不能复用其他账号缓存的转发标识。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns 在操作完成后兑现的 Promise。
 */
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

/**
 * 更新模块缓存并写入持久化存储。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @param id - 目标标识；可省略。
 * @returns 在操作完成后兑现的 Promise。
 */
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
