import type { Context } from '../context';
import { apiRequest, errorCode, hasErrors, reportFailure } from '../requests';

function executeRetweet(ctx: Context, retweetId: string, doTask = true): Promise<boolean> {
  return ctx.run(doTask ? 'retweets.create' : 'retweets.delete', retweetId, false, async (ctx) => {
    if (!ctx.ready()) return false;
    if (!/^\d+$/.test(retweetId)) { ctx.progress('INVALID_TWEET_ID', 'error'); return false; }
    if (!doTask && ctx.state.whiteList.retweets.includes(retweetId)) return ctx.skip('WHITELIST_SKIP');
    const queryId = doTask ? ctx.api.createRetweet : ctx.api.deleteRetweet;
    const action = doTask ? 'CreateRetweet' : 'DeleteRetweet';
    const response = await apiRequest(ctx, `/i/api/graphql/${queryId}/${action}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', origin: 'https://x.com', referer: 'https://x.com/home' },
      data: JSON.stringify({ variables: { [doTask ? 'tweet_id' : 'source_tweet_id']: retweetId, dark_request: false }, queryId })
    });
    // 327 is an already-retweeted response, not proof of successful deletion.
    const alreadyRetweeted = doTask && errorCode(response) === 327;
    if (response.result !== 'Success' || (response.data?.status !== 200 && !(response.data?.status === 403 && alreadyRetweeted)) ||
      (hasErrors(response) && !alreadyRetweeted)) return reportFailure(ctx, response);
    if (doTask && !ctx.state.tasks.retweets.includes(retweetId)) ctx.state.tasks.retweets.push(retweetId);
    return true;
  });
}

export function doRetweet(ctx: Context, retweetId: string): Promise<boolean> { return executeRetweet(ctx, retweetId, true); }
export function undoRetweet(ctx: Context, retweetId: string): Promise<boolean> { return executeRetweet(ctx, retweetId, false); }
