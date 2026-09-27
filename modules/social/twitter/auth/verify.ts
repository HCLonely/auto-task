import type { Context } from '../context';
import { apiRequest, errorCode, hasErrors, reportFailure } from '../requests';

/** Preserves original semantics: verification attempts to FOLLOW the configured account. */
export function verifyAuth(ctx: Context): Promise<boolean> {
  return ctx.run('auth.verify', ctx.options.verifyId, false, async (ctx) => {
    const response = await apiRequest(ctx, '/i/api/1.1/friendships/create.json', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: new URLSearchParams({ id: ctx.options.verifyId!, skip_status: '1' }).toString()
    });
    if (response.result === 'Success' && ((response.data?.status === 200 && !hasErrors(response)) ||
      (response.data?.status === 403 && errorCode(response) === 158))) return true;
    return reportFailure(ctx, response);
  });
}
