import type { Context } from '../context';
import { mutate } from './graphql';

export function getUserId(ctx: Context, name: string): Promise<string | false> {
  return ctx.run('user.getId', name, async (ctx) => {
    try {
      const { result, data } = await ctx.request({ url: `https://www.reddit.com/user/${encodeURIComponent(name)}`, method: 'GET' });
      if (result !== 'Success' || data?.status !== 200) return ctx.fail('LOOKUP_FAILED');
      const html = new DOMParser().parseFromString(data.responseText, 'text/html');
      const id = html.querySelector('follow-button[redditor-id]')?.getAttribute('redditor-id');
      return id && /^t2_[a-z0-9]+$/i.test(id) ? id : ctx.fail('USER_ID_MISSING');
    } catch { return ctx.fail('LOOKUP_FAILED'); }
  }, Boolean);
}

async function executeUser(ctx: Context, name: string, follow: boolean): Promise<boolean> {
  const id = await getUserId(ctx, name);
  if (!id) return false;
  return mutate(ctx, 'UpdateProfileFollowState', { accountId: id, state: follow ? 'FOLLOWED' : 'NONE' });
}

export function doUser(ctx: Context, name: string): Promise<boolean> { return executeUser(ctx, name, true); }
export function undoUser(ctx: Context, name: string): Promise<boolean> { return executeUser(ctx, name, false); }
