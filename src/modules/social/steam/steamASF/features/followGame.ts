import { execute, requireId } from '../commands';
import type { Context } from '../context';
import { checkGame } from './gameStatus';

function executeFollowGame(ctx: Context, gameId: string, doTask: boolean): Promise<boolean> {
  return ctx.run(doTask ? 'game.follow' : 'game.unfollow', gameId, false, async (child) => {
    requireId(gameId);
    const status = await checkGame(child, gameId);
    if (status.followed === doTask) {
      child.progress('ALREADY_SATISFIED');
      return true;
    }
    return execute(child, `!${doTask ? '' : 'UN'}FOLLOWGAME ${child.bot} ${gameId}`);
  });
}

export function doFollowGame(ctx: Context, gameId: string): Promise<boolean> {
  return executeFollowGame(ctx, gameId, true);
}
export function undoFollowGame(ctx: Context, gameId: string): Promise<boolean> {
  return executeFollowGame(ctx, gameId, false);
}
