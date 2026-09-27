import { setCache } from '../cache';
import type { Context } from '../context';
import { getWall } from './wall';

export function sendWall(ctx: Context, name: string): Promise<boolean> {
  return ctx.run('wall.repost', name, false, async (ctx) => {
    const item = await getWall(ctx, name);
    if (!item) return false;
    if (item.reposts?.user_reposted === undefined) return ctx.fail('INVALID_RESPONSE');
    if (item.reposts.user_reposted) return ctx.skip('ALREADY_IN_DESIRED_STATE');
    const result = await ctx.api('wall.repost', { object: name, message: '', group_id: '', ref: 'group',
      mark_as_ads: 0, friends_only: 0, close_comments: 0, mute_notifications: 0, publish_date: '',
      entry_point: 'share', track_code: item.track_code || '' }, 'web.api.vk.ru', name) as { success?: number; post_id?: number } | false;
    if (!result || result.success !== 1 || !result.post_id || !/^\d+$/.test(String(result.post_id))) return ctx.fail('INVALID_RESPONSE');
    await setCache(ctx, name, String(result.post_id));
    ctx.record(name);
    return true;
  });
}

export function deleteWall(ctx: Context, name: string): Promise<boolean> {
  return ctx.run('wall.deleteRepost', name, false, async (ctx) => {
    const item = await getWall(ctx, name);
    if (!item) return false;
    if (item.reposts?.user_reposted === undefined) return ctx.fail('INVALID_RESPONSE');
    if (!item.reposts.user_reposted) return ctx.skip('ALREADY_IN_DESIRED_STATE');
    const postId = ctx.state.cache[name];
    if (!postId) return ctx.fail('REPOST_ID_NOT_CACHED');
    const result = await ctx.api('wall.delete', { owner_id: ctx.state.userId, post_id: postId, creation_entry_point: '' }, 'web.api.vk.ru', name);
    if (result !== 1) return ctx.fail('INVALID_RESPONSE');
    await setCache(ctx, name);
    return true;
  });
}
