import type { Context } from '../context';
import { object, query } from '../graphql';

export function verifyToken(ctx: Context): Promise<boolean> {
  return ctx.run('auth.verifyToken', undefined, async (ctx) => {
    try {
      const data = await query(ctx, 'FrontPageNew_User', {
        limit: 1
      }, '64bd07a2cbaca80699d62636d966cf6395a5d14a1f0a14282067dcb28b13eb11');
      if (!data || Object.keys(object(data.currentUser)).length === 0) {
        ctx.progress('AUTH_INVALID', 'error');
        return false;
      }
      return true;
    } catch {
      ctx.progress('AUTH_VERIFY_FAILED', 'error');
      return false;
    }
  }, Boolean);
}
