/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitter/auth/cookies.ts
 * @Description  : Twitter Cookie 授权信息读取与更新
 */

import type { Context } from '../context';
import type { Auth, GMCookie, HttpResponse } from '../types';

/**
 * 读取当前平台的授权 Cookie。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns Promise，完成后返回处理后的数据列表；未取得有效结果时返回 undefined。
 */
async function readCookies(ctx: Context): Promise<GMCookie[] | undefined> {
  return new Promise((resolve) => {
    let settled = false;
    /**
     * 完成当前操作并交付结果。
     *
     * @param cookies - Cookie 列表；可省略。
     */
    const finish = (cookies?: GMCookie[]) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      ctx.state.cleanups.delete(cancel);
      resolve(cookies);
    };
    /**
     * 取消当前操作或等待。
     */
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

/**
 * 更新平台授权信息。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
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

/**
 * 在唯一一次重试前先保存并启用替换后的令牌。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param response - 请求响应数据。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
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
