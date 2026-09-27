import type { GMStorageAPI } from '../types';

declare const GM_getValue: GMStorageAPI['getValue'];
declare const GM_setValue: GMStorageAPI['setValue'];
declare const GM_deleteValue: GMStorageAPI['deleteValue'];

export function createGMStorage(gm?: GMStorageAPI, namespace = 'steamASF') {
  const api: GMStorageAPI = gm || {
    getValue: (key, fallback) => GM_getValue(key, fallback),
    setValue: (key, value) => GM_setValue(key, value),
    deleteValue: (key) => GM_deleteValue(key)
  };
  return {
    async get<T>(key: string, fallback: T): Promise<T> { return api.getValue(`${namespace}:${key}`, fallback); },
    async set(key: string, value: unknown): Promise<void> { await api.setValue(`${namespace}:${key}`, value); },
    async delete(key: string): Promise<void> { await api.deleteValue(`${namespace}:${key}`); }
  };
}
