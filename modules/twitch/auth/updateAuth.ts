import { requestTabAuth } from '../adapters/gmTabAuth';
import type { Context } from '../context';
import { checkIntegrity } from './integrity';
import { verifyToken } from './verifyToken';

export function updateAuth(ctx: Context): Promise<boolean> {
  return ctx.run('auth.update', undefined, async (ctx) => {
    try {
      if (!await requestTabAuth(ctx)) return false;
      if (!await verifyToken(ctx) || !await checkIntegrity(ctx)) return false;
      await ctx.storage.set('auth', ctx.state.auth);
      return true;
    } catch { ctx.progress('AUTH_UPDATE_FAILED', 'error'); return false; }
  }, Boolean);
}
