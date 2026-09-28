import type { Cookie, CookieReader, GMCookieList } from '../types';

declare const GM_cookie: { list: GMCookieList };

/** Missing APIs, thrown errors, callback errors and absent callbacks all settle. */
export function createGMCookieReader(list: GMCookieList, timeoutMs = 30000): CookieReader {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new Error('Invalid cookie timeout');
  }
  return (url) => {
    return new Promise<Cookie[]>((resolve, reject) => {
      let settled = false;
      const finish = (cookies: Cookie[], failed: boolean) => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timer);
        if (failed) {
          reject(new Error('Cookie read failed'));
        } else {
          resolve(cookies);
        }
      };
      const timer = setTimeout(() => {
        return finish([], true);
      }, timeoutMs);
      try {
        const handle = list({
          url
        }, (cookies, error) => {
          return finish(cookies, Boolean(error) || !Array.isArray(cookies));
        });
        if (handle && typeof (handle as PromiseLike<unknown>).then === 'function') {
          void Promise.resolve(handle).catch(() => {
            return finish([], true);
          });
        }
      } catch {
        finish([], true);
      }
    });
  };
}

export function defaultCookieReader(timeoutMs: number): CookieReader {
  return createGMCookieReader((details, callback) => {
    return GM_cookie.list(details, callback);
  }, timeoutMs);
}
