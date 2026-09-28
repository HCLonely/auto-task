import { loadCache } from '../cache';
import { normalizeTasks, type Context } from '../context';
import { transport } from '../requests';
import { createTransactionIdProvider } from '../transaction';
import type { TwitterTasks } from '../types';
import { updateAuth } from './cookies';
import { verifyAuth } from './verify';

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
