import type { Context } from '../context';

/** Cookie acquisition is separate from verification and persistence. */
export async function updateAuth(ctx: Context): Promise<boolean> {
  return ctx.run('auth.updateCookie', undefined, false, async (ctx) => {
    try {
      const cookies = await ctx.cookies('https://www.youtube.com/@YouTube');
      if (ctx.state.disposed) return ctx.fail('DISPOSED');
      const cookie = cookies.find((item) => item.name === '__Secure-3PAPISID');
      if (!cookie || typeof cookie.value !== 'string' || !cookie.value) return ctx.fail('AUTH_REQUIRED');
      ctx.state.auth = cookie.value;
      return true;
    } catch { return ctx.fail('COOKIE_READ_FAILED'); }
  });
}
