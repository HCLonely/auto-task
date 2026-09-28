import type { GMStorageAPI } from '../types';

declare const GM_getValue: GMStorageAPI['getValue'];
declare const GM_setValue: GMStorageAPI['setValue'];
declare const GM_deleteValue: GMStorageAPI['deleteValue'];

export function getDefaultGM(): GMStorageAPI {
  return {
    getValue: (key, fallback) => {
      return GM_getValue(key, fallback);
    },
    setValue: (key, value) => {
      return GM_setValue(key, value);
    },
    deleteValue: (key) => {
      return GM_deleteValue(key);
    }
  };
}

/** Persistent storage only; failures are not silently replaced with memory storage. */
export function createGMStorage(gm: GMStorageAPI, namespace = 'youtube') {
  return {
    async get<T>(key: string, fallback: T): Promise<T> {
      return gm.getValue(`${namespace}:${key}`, fallback);
    },
    async set(key: string, value: unknown): Promise<void> {
      await gm.setValue(`${namespace}:${key}`, value);
    },
    async delete(key: string): Promise<void> {
      await gm.deleteValue(`${namespace}:${key}`);
    }
  };
}
