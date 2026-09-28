import type { GMStorageAPI } from '../types';

declare const GM_getValue: GMStorageAPI['getValue'];
declare const GM_setValue: GMStorageAPI['setValue'];
declare const GM_deleteValue: GMStorageAPI['deleteValue'];

export function createGMStorage(gm: GMStorageAPI = {
  getValue: (key, fallback) => {
    return GM_getValue(key, fallback);
  },
  setValue: (key, value) => {
    return GM_setValue(key, value);
  },
  deleteValue: (key) => {
    return GM_deleteValue(key);
  }
}, namespace = 'vk') {
  return {
    get: async <T>(key: string, fallback: T): Promise<T> => {
      return gm.getValue(`${namespace}:${key}`, fallback);
    },
    set: async (key: string, value: unknown): Promise<void> => {
      return gm.setValue(`${namespace}:${key}`, value);
    },
    delete: async (key: string): Promise<void> => {
      return gm.deleteValue(`${namespace}:${key}`);
    }
  };
}
