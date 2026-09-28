/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/youtube/adapters/gmCookies.ts
 * @Description  : YouTube 用户脚本 Cookie 读取适配
 */

import type { Cookie, CookieReader, GMCookieList } from '../types';

declare const GM_cookie: { list: GMCookieList };

/**
 * 处理 API 缺失、同步异常、回调错误和回调未触发等情况，确保读取操作结束。
 *
 * @param list - 待处理的列表。
 * @param timeoutMs - 超时时长，单位为毫秒；默认值为 `30000`。
 * @returns 供调用方使用的函数。
 * @throws Error - 触发 'Invalid cookie timeout' 错误条件时抛出。
 */
export function createGMCookieReader(list: GMCookieList, timeoutMs = 30000): CookieReader {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new Error('Invalid cookie timeout');
  }
  return (url) => {
    return new Promise<Cookie[]>((resolve, reject) => {
      let settled = false;
      /**
       * 完成当前操作并交付结果。
       *
       * @param cookies - Cookie 列表。
       * @param failed - 失败状态。
       */
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

/**
 * 创建使用当前用户脚本 API 的默认 Cookie 读取器。
 *
 * @param timeoutMs - 超时时长，单位为毫秒。
 * @returns 供调用方使用的函数。
 */
export function defaultCookieReader(timeoutMs: number): CookieReader {
  return createGMCookieReader((details, callback) => {
    return GM_cookie.list(details, callback);
  }, timeoutMs);
}
