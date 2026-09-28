/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/reddit/whiteList.ts
 * @Description  : Reddit 任务白名单读取与设置
 */

import type { Context } from './context';
import type { RedditTasks } from './types';

/**
 * 校验并规范化任务白名单。
 *
 * @param value - 待处理的值。
 * @returns Reddit 任务集合。
 * @throws Error - 触发 'INVALID_WHITELIST' 错误条件时抛出。
 */
export function validateWhiteList(value: unknown): RedditTasks {
  const reddits = (value as Partial<RedditTasks> | null)?.reddits;
  if (!Array.isArray(reddits) || !reddits.every((name) => {
    return typeof name === 'string' && /^[A-Za-z0-9_-]+$/.test(name);
  })) {
    throw new Error('INVALID_WHITELIST');
  }
  return {
    reddits: [...new Set(reddits)]
  };
}

/**
 * 从持久化存储读取任务白名单。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns 在操作完成后兑现的 Promise。
 */
export async function loadWhiteList(ctx: Context): Promise<void> {
  ctx.state.whiteList = validateWhiteList(await ctx.storage.get('whiteList', {
    reddits: []
  }));
}

/**
 * 更新任务白名单并写入持久化存储。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param value - 需要保存的任务白名单。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function setWhiteList(ctx: Context, value: RedditTasks): Promise<boolean> {
  return ctx.run('whiteList.save', undefined, async (ctx) => {
    if (ctx.state.disposed) {
      return ctx.fail('DISPOSED');
    }
    try {
      const validated = validateWhiteList(value);
      await ctx.storage.set('whiteList', validated);
      ctx.state.whiteList = validated;
      return true;
    } catch {
      return ctx.fail('WHITELIST_SAVE_FAILED');
    }
  }, Boolean);
}
