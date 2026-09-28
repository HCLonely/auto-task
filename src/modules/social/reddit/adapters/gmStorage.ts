import type { GMStorageAPI } from '../types';

declare const GM_getValue: GMStorageAPI['getValue'];
declare const GM_setValue: GMStorageAPI['setValue'];

export function getDefaultGM(): GMStorageAPI {
  return {
    getValue: (key, fallback) => {
      return GM_getValue(key, fallback);
    },
    setValue: (key, value) => {
      return GM_setValue(key, value);
    }
  };
}

/** GM persistence only, with no in-memory or localStorage fallback. */
export function createGMStorage(gm: GMStorageAPI, namespace = 'reddit') {
  return {
    async get<T>(key: string, fallback: T): Promise<T> {
      return gm.getValue(`${namespace}:${key}`, fallback);
    },
    async set(key: string, value: unknown): Promise<void> {
      await gm.setValue(`${namespace}:${key}`, value);
    }
  };
}
