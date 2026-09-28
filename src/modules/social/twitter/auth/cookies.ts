import type { Context } from '../context';
import type { Auth, GMCookie, HttpResponse } from '../types';

async function readCookies(ctx: Context): Promise<GMCookie[] | undefined> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (cookies?: GMCookie[]) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      ctx.state.cleanups.delete(cancel);
      resolve(cookies);
    };
    const cancel = () => {
      return finish();
    };
    const timer = setTimeout(() => {
      ctx.progress('COOKIE_TIMEOUT', 'error');
      finish();
    }, ctx.options.cookieTimeoutMs);
    ctx.state.cleanups.add(cancel);
    try {
      const handle = ctx.gm.listCookies({
        url: 'https://x.com/settings/account'
      }, (cookies, error) => {
        if (settled) {
          return;
        }
        if (error || !Array.isArray(cookies)) {
          ctx.progress('COOKIE_READ_FAILED', 'error');
          finish();
        } else {
          finish(cookies);
        }
      });
      if (handle && typeof (handle as PromiseLike<unknown>).then === 'function') {
        void Promise.resolve(handle).catch(() => {
          if (!settled) {
            ctx.progress('COOKIE_READ_FAILED', 'error');
            finish();
          }
        });
      }
    } catch {
      ctx.progress('COOKIE_API_UNAVAILABLE', 'error');
      finish();
    }
  });
}

export function updateAuth(ctx: Context): Promise<boolean> {
  return ctx.run('auth.cookies', undefined, false, async (ctx) => {
    ctx.state.auth = undefined;
    const cookies = await readCookies(ctx);
    if (!cookies || ctx.state.disposed) {
      return false;
    }
    const ct0 = cookies.find((cookie) => {
      return cookie.name === 'ct0';
    })?.value;
    const twid = cookies.find((cookie) => {
      return cookie.name === 'twid';
    })?.value;
    let userId: string | undefined;
    try {
      userId = decodeURIComponent(twid || '').match(/^u=(\d+)$/)?.[1];
    } catch { /* Invalid cookie. */ }
    if (!ct0 || !userId) {
      await ctx.storage.delete('auth');
      ctx.progress('AUTH_REQUIRED', 'error');
      return false;
    }
    const auth: Auth = {
      ct0,
      userId,
      language: cookies.find((cookie) => {
        return cookie.name === 'lang';
      })?.value || 'en'
    };
    await ctx.storage.set('auth', auth);
    if (ctx.state.disposed) {
      return false;
    }
    ctx.state.auth = auth;
    return true;
  });
}

/** Persist and install the replacement token before the one permitted retry. */
export async function refreshCsrf(ctx: Context, response: HttpResponse): Promise<boolean> {
  const headers = response.data?.responseHeaders;
  const key = Object.keys(headers || {}).find((name) => {
    return name.toLowerCase() === 'set-cookie';
  });
  const raw = key ? headers?.[key] : undefined;
  const entries = Array.isArray(raw) ? raw : (raw ? [raw] : []);
  const token = entries.map((entry) => {
    return entry.match(/(?:^|,\s*)ct0=([^;\s,]+)/)?.[1];
  }).find(Boolean);
  if (!token || !ctx.state.auth) {
    return false;
  }
  const auth = {
    ...ctx.state.auth,
    ct0: token
  };
  await ctx.storage.set('auth', auth);
  if (ctx.state.disposed) {
    return false;
  }
  ctx.state.auth = auth;
  ctx.progress('CSRF_REFRESHED');
  return true;
}
