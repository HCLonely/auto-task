import type { Context } from '../context';
import type { GroupParams } from '../types';

function executeGroup(ctx: Context, name: string, params: GroupParams, doTask = true): Promise<boolean> {
  return ctx.run(doTask ? 'group.join' : 'group.leave', name, false, async (ctx) => {
    if (params.isMember === (doTask ? '1' : '0')) {
      return ctx.skip('ALREADY_IN_DESIRED_STATE');
    }
    const result = await ctx.api(`groups.${doTask ? 'join' : 'leave'}`, {
      group_id: params.groupId,
      source: '',
      track_code: ''
    }, 'web.api.vk.com', name);
    if (result !== 1) {
      return ctx.fail('INVALID_RESPONSE');
    }
    if (doTask) {
      ctx.record(name);
    }
    return true;
  });
}

export function doGroup(ctx: Context, name: string, params: GroupParams): Promise<boolean> {
  return executeGroup(ctx, name, params, true);
}
export function undoGroup(ctx: Context, name: string, params: GroupParams): Promise<boolean> {
  return executeGroup(ctx, name, params, false);
}
