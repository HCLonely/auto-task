import type { Context } from '../context';

/** A CSRF token is a prerequisite, not proof that the Reddit session is logged in. */
export function updateAuth(ctx: Context): Promise<boolean> {
  return ctx.run('auth.session', undefined, async (ctx) => {
    try {
      const cookies = await ctx.cookies();
      if (ctx.state.disposed) {
        return ctx.fail('DISPOSED');
      }
      const token = cookies.find((cookie) => {
        return cookie.name === 'csrf_token';
      })?.value;
      if (!token || typeof token !== 'string') {
        return ctx.fail('CSRF_TOKEN_MISSING');
      }
      ctx.state.csrfToken = token;
      return true;
    } catch {
      return ctx.fail('COOKIE_READ_FAILED');
    }
  }, Boolean);
}
