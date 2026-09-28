/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/reddit/features/subreddit.ts
 * @Description  : Reddit 社区订阅与退订
 */

import type { Context } from '../context';
import { mutate } from './graphql';

/**
 * 查询 Reddit 社区标识。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @returns Promise，完成后返回处理后的字符串；未取得有效结果时返回 false。
 */
export function getSubredditId(ctx: Context, name: string): Promise<string | false> {
  return ctx.run('subreddit.getId', name, async (ctx) => {
    try {
      const {
        result, data
      } = await ctx.request({
        url: `https://www.reddit.com/r/${encodeURIComponent(name)}`,
        method: 'GET'
      });
      if (result !== 'Success' || data?.status !== 200) {
        return ctx.fail('LOOKUP_FAILED');
      }
      const html = new DOMParser().parseFromString(data.responseText, 'text/html');
      const id = html.querySelector('shreddit-subreddit-header-buttons[subreddit-id]')?.getAttribute('subreddit-id');
      return id && /^t5_[a-z0-9]+$/i.test(id) ? id : ctx.fail('SUBREDDIT_ID_MISSING');
    } catch {
      return ctx.fail('LOOKUP_FAILED');
    }
  }, Boolean);
}

/**
 * 在同一模块中处理订阅与取消订阅操作。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @param subscribe - 是否订阅；为 false 时取消订阅。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
async function executeSubreddit(ctx: Context, name: string, subscribe: boolean): Promise<boolean> {
  const id = await getSubredditId(ctx, name);
  if (!id) {
    return false;
  }
  return mutate(ctx, 'UpdateSubredditSubscriptions', {
    inputs: [{
      subredditId: id,
      subscribeState: subscribe ? 'SUBSCRIBED' : 'NONE'
    }]
  });
}

/**
 * 订阅 Reddit 社区。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function doSubreddit(ctx: Context, name: string): Promise<boolean> {
  return executeSubreddit(ctx, name, true);
}
/**
 * 取消订阅 Reddit 社区。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function undoSubreddit(ctx: Context, name: string): Promise<boolean> {
  return executeSubreddit(ctx, name, false);
}
