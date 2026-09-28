/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/reddit/adapters/gmCookie.ts
 * @Description  : Reddit 用户脚本 Cookie 读取适配
 */

import type { Cookie, CookieReader, GMCookieList } from '../types';

declare const GM_cookie: { list: GMCookieList };

/**
 * 将 GM Cookie 接口适配为异步 Cookie 读取器。
 *
 * @param list - 待处理的列表。
 * @param timeoutMs - 超时时长，单位为毫秒；默认值为 `10000`。
 * @returns 供调用方使用的函数。
 * @throws Error - 触发 'Invalid cookie timeout' 错误条件时抛出。
 */
export function createGMCookieReader(list: GMCookieList, timeoutMs = 10000): CookieReader {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new Error('Invalid cookie timeout');
  }
  return () => {
    return new Promise((resolve, reject) => {
      let settled = false;
      /**
       * 完成当前操作并交付结果。
       *
       * @param cookies - Cookie 列表；可省略。
       */
      const finish = (cookies?: Cookie[]) => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timer);
        if (cookies) {
          resolve(cookies);
        } else {
          reject(new Error('COOKIE_READ_FAILED'));
        }
      };
      const timer = setTimeout(() => {
        return finish();
      }, timeoutMs);
      try {
        const handle = list({
          url: 'https://www.reddit.com/'
        }, (cookies, error) => {
          if (error || !Array.isArray(cookies)) {
            finish();
          } else {
            finish(cookies);
          }
        });
        if (handle && typeof (handle as PromiseLike<unknown>).then === 'function') {
          void Promise.resolve(handle).catch(() => {
            return finish();
          });
        }
      } catch {
        finish();
      }
    });
  };
}

/**
 * 获取使用当前用户脚本 API 的默认 Cookie 读取器。
 *
 * @param timeoutMs - 超时时长，单位为毫秒；可省略。
 * @returns 供调用方使用的函数。
 */
export function getDefaultCookieReader(timeoutMs?: number): CookieReader {
  return createGMCookieReader((details, callback) => {
    return GM_cookie.list(details, callback);
  }, timeoutMs);
}
