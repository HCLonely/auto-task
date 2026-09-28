/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitter/features/retweets.ts
 * @Description  : Twitter 推文转发与撤销
 */

import type { Context } from '../context';
import { apiRequest, errorCode, hasErrors, reportFailure } from '../requests';

/**
 * 根据操作方向转发推文或撤销推文转发。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param retweetId - 转发记录标识。
 * @param doTask - 是否执行任务；为 false 时执行撤销操作；默认值为 `true`。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
function executeRetweet(ctx: Context, retweetId: string, doTask = true): Promise<boolean> {
  return ctx.run(doTask ? 'retweets.create' : 'retweets.delete', retweetId, false, async (ctx) => {
    if (!ctx.ready()) {
      return false;
    }
    if (!/^\d+$/.test(retweetId)) {
      ctx.progress('INVALID_TWEET_ID', 'error');
      return false;
    }
    if (!doTask && ctx.state.whiteList.retweets.includes(retweetId)) {
      return ctx.skip('WHITELIST_SKIP');
    }
    const queryId = doTask ? ctx.api.createRetweet : ctx.api.deleteRetweet;
    const action = doTask ? 'CreateRetweet' : 'DeleteRetweet';
    const response = await apiRequest(ctx, `/i/api/graphql/${queryId}/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'https://x.com',
        referer: 'https://x.com/home'
      },
      data: JSON.stringify({
        variables: {
          [doTask ? 'tweet_id' : 'source_tweet_id']: retweetId,
          dark_request: false
        },
        queryId
      })
    });
    // 327 is an already-retweeted response, not proof of successful deletion.
    const alreadyRetweeted = doTask && errorCode(response) === 327;
    if (response.result !== 'Success' || (response.data?.status !== 200 && !(response.data?.status === 403 && alreadyRetweeted)) ||
      (hasErrors(response) && !alreadyRetweeted)) {
      return reportFailure(ctx, response);
    }
    if (doTask && !ctx.state.tasks.retweets.includes(retweetId)) {
      ctx.state.tasks.retweets.push(retweetId);
    }
    return true;
  });
}

/**
 * 转发推文。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param retweetId - 转发记录标识。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function doRetweet(ctx: Context, retweetId: string): Promise<boolean> {
  return executeRetweet(ctx, retweetId, true);
}
/**
 * 撤销推文转发。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param retweetId - 转发记录标识。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function undoRetweet(ctx: Context, retweetId: string): Promise<boolean> {
  return executeRetweet(ctx, retweetId, false);
}
