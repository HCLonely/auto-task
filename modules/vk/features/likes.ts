import type { Context } from '../context';
import { getWall } from './wall';

function executeLikeWall(ctx: Context, name: string, doTask = true): Promise<boolean> {
  return ctx.run(doTask ? 'wall.like' : 'wall.unlike', name, false, async (ctx) => {
    const item = await getWall(ctx, name);
    if (!item) return false;
    if (item.likes?.user_likes === undefined) return ctx.fail('INVALID_RESPONSE');
    if (Boolean(item.likes.user_likes) === doTask) return ctx.skip('ALREADY_IN_DESIRED_STATE');
    const values: Record<string, string | number> = { type: item.type, owner_id: item.owner_id, item_id: item.id, track_code: item.track_code || '', ref: 'group' };
    if (doTask) values.reaction_id = 0;
    const result = await ctx.api(`likes.${doTask ? 'add' : 'delete'}`, values, 'web.api.vk.com', name);
    if (!result || typeof result !== 'object' || !('likes' in result) || typeof result.likes !== 'number') return ctx.fail('INVALID_RESPONSE');
    return true;
  });
}

export function doLikeWall(ctx: Context, name: string): Promise<boolean> { return executeLikeWall(ctx, name, true); }
export function undoLikeWall(ctx: Context, name: string): Promise<boolean> { return executeLikeWall(ctx, name, false); }
