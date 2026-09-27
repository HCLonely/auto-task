import type { Cookie, CookieReader, GMCookieList } from '../types';

declare const GM_cookie: { list: GMCookieList };

export function createGMCookieReader(list: GMCookieList, timeoutMs = 10000): CookieReader {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new Error('Invalid cookie timeout');
  return () => new Promise((resolve, reject) => {
    let settled = false;
    const finish = (cookies?: Cookie[]) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (cookies) resolve(cookies);
      else reject(new Error('COOKIE_READ_FAILED'));
    };
    const timer = setTimeout(() => finish(), timeoutMs);
    try {
      const handle = list({ url: 'https://www.reddit.com/' }, (cookies, error) => {
        if (error || !Array.isArray(cookies)) finish();
        else finish(cookies);
      });
      if (handle && typeof (handle as PromiseLike<unknown>).then === 'function') {
        void Promise.resolve(handle).catch(() => finish());
      }
    } catch { finish(); }
  });
}

export function getDefaultCookieReader(timeoutMs?: number): CookieReader {
  return createGMCookieReader((details, callback) => GM_cookie.list(details, callback), timeoutMs);
}
