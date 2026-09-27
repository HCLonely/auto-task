import { execute, requireId } from '../commands';
import type { Context } from '../context';

function executeCurator(ctx: Context, curatorId: string, doTask = true): Promise<boolean> {
  return ctx.run(doTask ? 'curator.follow' : 'curator.unfollow', curatorId, false, async (child) => {
    requireId(curatorId);
    return execute(child, `!${doTask ? '' : 'UN'}FOLLOWCURATOR ${child.bot} ${curatorId}`);
  });
}

export function doCurator(ctx: Context, curatorId: string): Promise<boolean> { return executeCurator(ctx, curatorId, true); }
export function undoCurator(ctx: Context, curatorId: string): Promise<boolean> { return executeCurator(ctx, curatorId, false); }
