/*
 * @Author       : HCLonely
 * @Date         : 2021-10-13 13:18:21
 * @LastEditTime : 2026-01-19 14:41:30
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/types/global.d.ts
 */

declare global {
  interface GlobalThis {
    Xresponse: undefined | JQuery;
  }
  interface Window {
    __allLogs: any[];
    GLOBAL_ENV: Record<string, string>;
    STYLE: HTMLElement
    DEBUG: boolean
    TRACE: boolean
    commonOptions: {
      headers?: {
        'Client-ID': string
        'Device-ID': string
      }
    };
    __twilightBuildID: string;
    Twitter: any;
    pluginPanel: unknown
  }

  interface Array<T> {
    at(index: number): T | undefined;
  }

  interface gmInfo {
    scriptHandler: string
    version: string
    script: {
      version: string
      name: string
      'run-at': string
    }
  }

  function GM_addValueChangeListener<T>(key: string, callback: (key: string, old_value: T, new_value: T, remote: boolean) => void): number
  function GM_removeValueChangeListener(listenerId: number): void

  interface Navigator {
    userAgentData?: {
      platform: string;
      brands: Array<{
        brand: string;
        version: string;
      }>;
    };
  }
}

export { };
