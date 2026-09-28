/*
 * @Author       : HCLonely
 * @Date         : 2021-10-13 13:18:21
 * @LastEditTime : 2026-09-28 17:35:44
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/types/global.d.ts
 * @Description  : 全局变量与浏览器环境类型声明
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
    /**
     * 获取指定位置的元素或字符。
     *
     * @param index - 当前项的索引。
     * @returns 工作函数或存储读取产生的泛型结果；未取得有效结果时返回 undefined。
     */
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

  /**
   * 注册 GM 存储值变化监听器。
   *
   * @typeParam T - 操作处理的数据或返回值类型。
   * @param key - 目标数据的键名。
   * @param callback - 接收处理结果的回调函数。
   * @returns 计算得到的数值。
   */
  function GM_addValueChangeListener<T>(key: string, callback: (key: string, old_value: T, new_value: T, remote: boolean) => void): number
  /**
   * 移除 GM 存储值变化监听器。
   *
   * @param listenerId - 已注册监听器的标识。
   */
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
