/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitch/storage.ts
 * @Description  : Twitch 状态持久化存储
 */

import { pickAuth, validAuth } from './auth/data';
import type { Context } from './context';
import { object } from './graphql';

/**
 * 处理频道任务集合。
 *
 * @param value - 待处理的值。
 * @returns 处理后的字符串列表。
 */
export function channels(value: unknown): string[] {
  return Array.isArray(value) ? [...new Set(value.filter((v): v is string => {
    return typeof v === 'string' && /^[a-zA-Z0-9_]+$/.test(v);
  }).map((v) => {
    return v.toLowerCase();
  }))] : [];
}
/**
 * 读取模块持久化状态。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns 在操作完成后兑现的 Promise。
 */
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
