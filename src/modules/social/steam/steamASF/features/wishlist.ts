import { execute, requireId } from '../commands';
import type { Context } from '../context';
import { checkGame } from './gameStatus';

function updateWishlist(ctx: Context, gameId: string, add: boolean): Promise<boolean> {
  return ctx.run(add ? 'wishlist.add' : 'wishlist.remove', gameId, false, async (child) => {
    requireId(gameId);
    const status = await checkGame(child, gameId);
    if (status.wishlist === add) {
      child.progress('ALREADY_SATISFIED');
      return true;
    }
    return execute(child, `!${add ? 'ADD' : 'REMOVE'}WISHLIST ${child.bot} ${gameId}`);
  });
}
export function addToWishlist(ctx: Context, gameId: string): Promise<boolean> {
  return updateWishlist(ctx, gameId, true);
}
export function removeFromWishlist(ctx: Context, gameId: string): Promise<boolean> {
  return updateWishlist(ctx, gameId, false);
}
