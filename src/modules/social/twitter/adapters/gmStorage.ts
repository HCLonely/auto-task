/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:35:46
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitter/adapters/gmStorage.ts
 * @Description  : Twitter 用户脚本存储适配
 */

import type { GMStorageAPI, TwitterGMAPI } from '../types';

declare const GM_getValue: GMStorageAPI['getValue'];
declare const GM_setValue: GMStorageAPI['setValue'];
declare const GM_deleteValue: GMStorageAPI['deleteValue'];
declare const GM_cookie: { list: TwitterGMAPI['listCookies'] };

/**
 * 获取当前用户脚本环境的 GM 存储接口。
 *
 * @returns 处理结果（TwitterGMAPI）。
 */
export function getDefaultGM(): TwitterGMAPI {
  return {
    /**
     * 读取指定 GM 存储项。
     *
     * @param key - 目标数据的键名。
     * @param fallback - 未取得有效数据时使用的默认值。
     * @returns 处理结果（T | Promise<T>）。
     */
    getValue: (key, fallback) => {
      return GM_getValue(key, fallback);
    },
    /**
     * 写入指定 GM 存储项。
     *
     * @param key - 目标数据的键名。
     * @param value - 待处理的值。
     * @returns 处理结果（void | Promise<void>）。
     */
    setValue: (key, value) => {
      return GM_setValue(key, value);
    },
    /**
     * 删除指定 GM 存储项。
     *
     * @param key - 目标数据的键名。
     * @returns 处理结果（void | Promise<void>）。
     */
    deleteValue: (key) => {
      return GM_deleteValue(key);
    },
    /**
     * 读取符合条件的 Cookie 列表。
     *
     * @param details - 状态事件的补充信息。
     * @param callback - 接收处理结果的回调函数。
     * @returns 处理结果。
     */
    listCookies: (details, callback) => {
      return GM_cookie.list(details, callback);
    }
  };
}

/**
 * 持久化数据全部使用 GM 存储，不回退到 localStorage 或纯内存存储。
 *
 * @param gm - 用户脚本 GM API 实现。
 * @param namespace - 用于隔离持久化数据的命名空间；默认值为 `'twitter'`。
 * @returns 提供读取、写入等操作的 GM 存储适配器。
 */
export function createGMStorage(gm: GMStorageAPI, namespace = 'twitter') {
  return {
    /**
     * 读取指定键对应的数据。
     *
     * @typeParam T - 操作处理的数据或返回值类型。
     * @param key - 目标数据的键名。
     * @param fallback - 未取得有效数据时使用的默认值。
     * @returns Promise，完成后返回工作函数或存储读取产生的泛型结果。
     */
    get<T>(key: string, fallback: T): Promise<T> {
      return Promise.resolve(gm.getValue(`${namespace}:${key}`, fallback));
    },
    /**
     * 写入指定键对应的数据。
     *
     * @param key - 目标数据的键名。
     * @param value - 待处理的值。
     * @returns 在操作完成后兑现的 Promise。
     */
    set(key: string, value: unknown): Promise<void> {
      return Promise.resolve(gm.setValue(`${namespace}:${key}`, value));
    },
    /**
     * 删除指定存储项。
     *
     * @param key - 目标数据的键名。
     * @returns 在操作完成后兑现的 Promise。
     */
    delete(key: string): Promise<void> {
      return Promise.resolve(gm.deleteValue(`${namespace}:${key}`));
    }
  };
}
