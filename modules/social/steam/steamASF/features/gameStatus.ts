import { containsId, requireId } from '../commands';
import { Context, OperationError } from '../context';
import type { GameStatus } from '../types';

export function checkGame(ctx: Context, gameId: string): Promise<GameStatus> {
  return ctx.run<GameStatus>('gameStatus.check', gameId, {}, async (child) => {
    requireId(gameId);
    const reply = await child.command(`!CHECK ${child.bot} ${gameId}`);
    const rows = reply.split('\n').filter((line) => containsId(line.split('|').slice(0, -3).join('|'), gameId));
    if (rows.length !== 1) throw new OperationError('INVALID_GAME_STATUS');
    const fields = rows[0].split('|').map((field) => field.trim());
    if (fields.length <= 3) throw new OperationError('INVALID_GAME_STATUS');
    if (!fields.slice(-3).every((field) => ['√', '×', '✗', '✘', 'X', 'x', '-'].includes(field))) {
      throw new OperationError('INVALID_GAME_STATUS');
    }
    // Original CHECK format: owned | wishlist | followed. Owned counts as satisfied for wishlist tasks.
    return { wishlist: fields.at(-3) === '√' || fields.at(-2) === '√', followed: fields.at(-1) === '√' };
  });
}
