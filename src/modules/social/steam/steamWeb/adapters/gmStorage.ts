import type { GMAuthAPI, GMStorageAPI } from '../types';

declare const GM_getValue: GMStorageAPI['getValue'];
declare const GM_setValue: GMStorageAPI['setValue'];
declare const GM_deleteValue: GMStorageAPI['deleteValue'];
declare const GM_openInTab: GMAuthAPI['openInTab'];
declare const GM_addValueChangeListener: GMAuthAPI['addValueChangeListener'];
declare const GM_removeValueChangeListener: GMAuthAPI['removeValueChangeListener'];

export function getDefaultGM(): GMAuthAPI {
  return {
    getValue: (key, fallback) => {
      return GM_getValue(key, fallback);
    },
    setValue: (key, value) => {
      return GM_setValue(key, value);
    },
    deleteValue: (key) => {
      return GM_deleteValue(key);
    },
    openInTab: (url, options) => {
      return GM_openInTab(url, options);
    },
    addValueChangeListener: (key, listener) => {
      return GM_addValueChangeListener(key, listener);
    },
    removeValueChangeListener: (id) => {
      return GM_removeValueChangeListener(id);
    }
  };
}

/** This adapter has no memory/localStorage fallback. */
export function createGMStorage(gm: GMStorageAPI, namespace = 'steamWeb') {
  return {
    get<T>(key: string, fallback: T): Promise<T> {
      return Promise.resolve(gm.getValue(`${namespace}:${key}`, fallback));
    },
    set(key: string, value: unknown): Promise<void> {
      return Promise.resolve(gm.setValue(`${namespace}:${key}`, value));
    },
    delete(key: string): Promise<void> {
      return Promise.resolve(gm.deleteValue(`${namespace}:${key}`));
    }
  };
}
