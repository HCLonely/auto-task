/*
 * @Author       : HCLonely
 * @Date         : 2021-10-26 14:58:11
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/tools/tools.ts
 * @Description  : 通用工具函数集合
 */

import type { MonkeyXhrDetails } from './httpRequest.types';
import throwError from './throwError';
import httpRequest from './httpRequest';
import echoLog from '../echoLog';
import { debug } from './debug';

/**
 * 重定向链接缓存接口
 */
interface RedirectLinksCache {
  [link: string]: string;
}

/**
 * URL查询参数接口
 */
interface UrlQuery {
  [name: string]: string;
}

/**
 * 从给定的数组中返回唯一值的数组
 *
 * @typeParam T - - 数组元素类型。
 * @param array - 输入数组
 * @returns 去重后的数组
 */
const unique = <T>(array: Array<T>): Array<T> => {
  try {
    return Array.from(new Set(array));
  } catch (error) {
    throwError(error as Error, 'unique');
    return [];
  }
};

/**
 * 创建一个延迟的 Promise
 *
 * @param time - 延迟时间（毫秒）
 * @returns 延迟完成后的 Promise
 */
const delay = (time = 1000): Promise<true> => {
  return new Promise((resolve) => {
    return setTimeout(() => {
      return resolve(true);
    }, time);
  });
};

/**
 * 获取重定向链接
 *
 * @param link - 原始链接
 * @param redirectOnce - 是否只重定向一次
 * @returns 重定向后的链接或null
 */
const getRedirectLink = async (link?: string, redirectOnce = false): Promise<string | null> => {
  try {
    if (!link) {
      return null;
    }

    const redirectLinksCache = GM_getValue<RedirectLinksCache>('redirectLinks') || {};
    const cachedLink = redirectLinksCache[link];
    if (cachedLink) {
      debug('使用缓存的重定向链接', {
        original: link,
        cached: cachedLink
      });
      return cachedLink;
    }

    const { data } = await httpRequest({
      url: link,
      method: 'GET',
      redirect: redirectOnce ? 'manual' : 'follow'
    });

    if (data?.finalUrl) {
      redirectLinksCache[link] = data.finalUrl;
      GM_setValue('redirectLinks', redirectLinksCache);
      debug('获取新的重定向链接', {
        original: link,
        final: data.finalUrl
      });
      return data.finalUrl;
    }

    debug('未找到重定向链接', {
      link
    });
    return null;
  } catch (error) {
    throwError(error as Error, 'getRedirectLink');
    return null;
  }
};

/**
 * 访问指定链接并返回访问结果
 *
 * @remarks
 * 已捕获的异常通过失败返回值交付，不会从对应的 catch 分支继续抛出。
 *
 * @param link - 要访问的链接
 * @param options - 请求配置选项
 * @returns 访问是否成功
 */
const visitLink = async (link: string, options?: MonkeyXhrDetails): Promise<boolean> => {
  try {
    debug('开始访问链接', {
      link,
      options
    });
    const logStatus = echoLog({
      type: 'visitingLink',
      text: link
    });

    const {
      result, statusText, status
    } = await httpRequest({
      url: link,
      method: 'GET',
      ...options
    });

    if (result === 'Success') {
      debug('链接访问成功', {
        link
      });
      logStatus.success();
      return true;
    }

    debug('链接访问失败', {
      link,
      result,
      statusText,
      status
    });
    logStatus.error(`${result}:${statusText}(${status})`);
    return false;
  } catch (error) {
    throwError(error as Error, 'visitLink');
    return false;
  }
};

/**
 * 解析URL查询参数
 *
 * @param url - 要解析的URL，默认为当前页面URL
 * @returns 解析后的查询参数对象
 */
const getUrlQuery = (url?: string): UrlQuery => {
  try {
    debug('开始解析URL查询参数', {
      url: url || window.location.href
    });
    const searchParams = url ? new URL(url, window.location.origin).searchParams : new URLSearchParams(window.location.search);

    const query: UrlQuery = {};
    for (const [key, value] of searchParams.entries()) {
      query[key] = value;
    }

    debug('URL查询参数解析结果', query);
    return query;
  } catch (error) {
    throwError(error as Error, 'getUrlQuery');
    return {};
  }
};

/**
 * 生成唯一的UUID字符串
 *
 * @returns UUID字符串
 */
const getUuid = (): string => {
  const uuidUrl = URL.createObjectURL(new Blob());
  const uuid = uuidUrl.slice(uuidUrl.lastIndexOf('/') + 1);
  URL.revokeObjectURL(uuidUrl); // 释放资源
  debug('生成UUID', {
    uuid
  });
  return uuid;
};

/**
 * 将字符串转换为颜色代码
 *
 * @param str - 输入字符串
 * @returns 十六进制颜色代码
 */
const stringToColour = (str: string): string => {
  try {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const rgb = Array.from({
      length: 3
    }, (_, i) => {
      const value = (hash >> (i * 8)) & 0xFF;
      return value.toString(16).padStart(2, '0');
    });

    const color = `#${rgb.join('')}`;
    return color;
  } catch (error) {
    throwError(error as Error, 'stringToColour');
    return '#ffffff';
  }
};

/**
 * 将所有LocalStorage转换为对象
 *
 * @param localStorage - 本地存储接口。
 * @returns 转换后的对象
 */
const getAllLocalStorageAsObjects = (localStorage: Storage): Record<string, string | object | null> => {
  try {
    debug('开始将所有LocalStorage转换为对象');
    const result: Record<string, string | object | null> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) {
        continue;
      }
      const value = localStorage.getItem(key);

      try {
        result[key as string] = JSON.parse(value as string);
      } catch (error) {
        result[key as string] = value;
        console.error(error);
      }
    }

    debug('所有LocalStorage转换为对象完成', result);
    return result;
  } catch (error) {
    debug('将所有LocalStorage转换为对象失败', {
      error
    });
    throwError(error as Error, 'getAllLocalStorageAsObjects');
    return {};
  }
};

export {
  unique,
  delay,
  getRedirectLink,
  getUrlQuery,
  visitLink,
  getUuid,
  stringToColour,
  getAllLocalStorageAsObjects
};
