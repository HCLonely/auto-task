/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:35:46
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamASF/adapters/gmStorage.ts
 * @Description  : Steam ASF 用户脚本存储适配
 */

import type { GMStorageAPI } from '../types';

declare const GM_getValue: GMStorageAPI['getValue'];
declare const GM_setValue: GMStorageAPI['setValue'];
declare const GM_deleteValue: GMStorageAPI['deleteValue'];

/**
 * 创建带命名空间的 GM 持久化存储适配器。
 *
 * @param gm - 用户脚本 GM API 实现；可省略。
 * @param namespace - 用于隔离持久化数据的命名空间；默认值为 `'steamASF'`。
 * @returns 提供读取、写入等操作的 GM 存储适配器。
 */
export function createGMStorage(gm?: GMStorageAPI, namespace = 'steamASF') {
  const api: GMStorageAPI = gm || {
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
    }
  };
  return {
    /**
     * 读取指定键对应的数据。
     *
     * @typeParam T - 操作处理的数据或返回值类型。
     * @param key - 目标数据的键名。
     * @param fallback - 未取得有效数据时使用的默认值。
     * @returns Promise，完成后返回工作函数或存储读取产生的泛型结果。
     */
    async get<T>(key: string, fallback: T): Promise<T> {
      return api.getValue(`${namespace}:${key}`, fallback);
    },
    /**
     * 写入指定键对应的数据。
     *
     * @param key - 目标数据的键名。
     * @param value - 待处理的值。
     * @returns 在操作完成后兑现的 Promise。
     */
    async set(key: string, value: unknown): Promise<void> {
      await api.setValue(`${namespace}:${key}`, value);
    },
    /**
     * 删除指定存储项。
     *
     * @param key - 目标数据的键名。
     * @returns 在操作完成后兑现的 Promise。
     */
    async delete(key: string): Promise<void> {
      await api.deleteValue(`${namespace}:${key}`);
    }
  };
}
