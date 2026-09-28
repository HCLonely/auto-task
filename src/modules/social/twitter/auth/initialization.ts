/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitter/auth/initialization.ts
 * @Description  : Twitter 授权初始化
 */

import { loadCache } from '../cache';
import { normalizeTasks, type Context } from '../context';
import { transport } from '../requests';
import { createTransactionIdProvider } from '../transaction';
import type { TwitterTasks } from '../types';
import { updateAuth } from './cookies';
import { verifyAuth } from './verify';

/**
 * 初始化运行环境与授权状态。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function initialize(ctx: Context): Promise<boolean> {
  if (ctx.state.initPromise) {
    return ctx.state.initPromise;
  }
  ctx.state.initPromise = ctx.run('init', undefined, false, async (ctx) => {
    if (ctx.state.initialized) {
      return true;
    }
    await loadCache(ctx);
    const saved = await ctx.storage.get<Partial<TwitterTasks>>('whiteList', {});
    const overrides = ctx.state.whiteListConfigured ? ctx.state.whiteList : ctx.options.whiteList;
    ctx.state.whiteList = normalizeTasks({
      ...saved,
      ...overrides
    });
    if (ctx.options.whiteList) {
      await ctx.storage.set('whiteList', ctx.state.whiteList);
    }
    if (!await updateAuth(ctx)) {
      return false;
    }
    const tidReady = await ctx.run('transaction.init', undefined, false, async (child) => {
      child.state.getTID = child.options.getTransactionId || await createTransactionIdProvider(
        (options) => {
          return transport(child, options);
        }, child.options.transactionPairsUrl);
      return true;
    });
    if (!tidReady) {
      return false;
    }
    for (let attempt = 0;attempt < 2;attempt++) {
      if (await verifyAuth(ctx)) {
        if (ctx.state.disposed) {
          return false;
        }
        ctx.state.initialized = true;
        return true;
      }
      ctx.state.auth = undefined;
      await ctx.storage.delete('auth');
      if (attempt !== 0) {
        break;
      }
      ctx.progress('AUTH_RETRYING', 'warning');
      if (!await updateAuth(ctx)) {
        break;
      }
    }
    return false;
  }).finally(() => {
    ctx.state.initPromise = undefined;
  });
  return ctx.state.initPromise;
}
