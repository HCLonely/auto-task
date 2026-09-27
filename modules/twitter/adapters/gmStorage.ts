import type { GMStorageAPI, TwitterGMAPI } from '../types';

declare const GM_getValue: GMStorageAPI['getValue'];
declare const GM_setValue: GMStorageAPI['setValue'];
declare const GM_deleteValue: GMStorageAPI['deleteValue'];
declare const GM_cookie: { list: TwitterGMAPI['listCookies'] };

export function getDefaultGM(): TwitterGMAPI {
  return {
    getValue: (key, fallback) => GM_getValue(key, fallback),
    setValue: (key, value) => GM_setValue(key, value),
    deleteValue: (key) => GM_deleteValue(key),
    listCookies: (details, callback) => GM_cookie.list(details, callback)
  };
}

/** All durable storage is GM-backed; no localStorage or memory-only fallback. */
export function createGMStorage(gm: GMStorageAPI, namespace = 'twitter') {
  return {
    get<T>(key: string, fallback: T): Promise<T> { return Promise.resolve(gm.getValue(`${namespace}:${key}`, fallback)); },
    set(key: string, value: unknown): Promise<void> { return Promise.resolve(gm.setValue(`${namespace}:${key}`, value)); },
    delete(key: string): Promise<void> { return Promise.resolve(gm.deleteValue(`${namespace}:${key}`)); }
  };
}
