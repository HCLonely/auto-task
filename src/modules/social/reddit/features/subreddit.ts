import type { Context } from '../context';
import { mutate } from './graphql';

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

/** Subscribe and unsubscribe belong to the same functional module. */
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

export function doSubreddit(ctx: Context, name: string): Promise<boolean> {
  return executeSubreddit(ctx, name, true);
}
export function undoSubreddit(ctx: Context, name: string): Promise<boolean> {
  return executeSubreddit(ctx, name, false);
}
