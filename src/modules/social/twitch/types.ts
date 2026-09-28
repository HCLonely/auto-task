/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:35:45
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitch/types.ts
 * @Description  : Twitch 类型定义
 */

/** Browser userscript transport. `Success` means transport completion, not HTTP/business success. */
export interface HttpRequestOptions {
  url: string;
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  data?: string | FormData;
  responseType?: 'text' | 'json';
  /** Compatibility with the original request wrapper. */
  dataType?: 'text' | 'json';
  timeout?: number;
  anonymous?: boolean;
  redirect?: 'follow' | 'manual';
}

export interface HttpData {
  status: number;
  statusText: string;
  responseText: string;
  // Twitch endpoints return unrelated, sometimes undocumented JSON shapes.
  response: unknown;
  finalUrl: string;
  responseHeaders: Record<string, string | string[]>;
}

export interface HttpResponse {
  result: 'Success' | 'Error' | 'JsError';
  /** Transport code: 600 loaded, 601 timeout, 602 aborted, 603 network, 604 JS. */
  status: number;
  statusText: string;
  data?: HttpData;
}
/**
 * 按请求选项发送 HTTP 请求。
 *
 * @param options - 本次操作的配置选项。
 * @returns Promise，完成后返回标准化的传输状态与响应数据。
 */
export type HttpClient = (options: HttpRequestOptions) => Promise<HttpResponse>;

export type StatusPhase = 'start' | 'progress' | 'success' | 'failure' | 'skipped';
export type StatusLevel = 'debug' | 'info' | 'warning' | 'error';
export interface TwitchStatusEvent {
  readonly operationId: string;
  readonly parentOperationId?: string;
  readonly operation: string;
  readonly phase: StatusPhase;
  readonly level: StatusLevel;
  readonly code: string;
  readonly target?: string;
  readonly timestamp: number;
  readonly details?: Readonly<Record<string, string | number | boolean>>;
}
/**
 * 接收模块状态事件。
 *
 * @param event - 事件名称或事件对象。
 * @returns 处理结果（void | Promise<void>）。
 */
export type StatusListener = (event: TwitchStatusEvent) => void | Promise<void>;

/** Structural GM APIs; supports both synchronous GM_* and asynchronous GM.* bindings. */
export interface GMStorageAPI {
  /**
   * 读取指定 GM 存储项。
   *
   * @typeParam T - 操作处理的数据或返回值类型。
   * @param key - 目标数据的键名。
   * @param fallback - 未取得有效数据时使用的默认值。
   * @returns 处理结果（T | Promise<T>）。
   */
  getValue<T>(key: string, fallback: T): T | Promise<T>;
  /**
   * 写入指定 GM 存储项。
   *
   * @param key - 目标数据的键名。
   * @param value - 待处理的值。
   * @returns 处理结果（void | Promise<void>）。
   */
  setValue(key: string, value: unknown): void | Promise<void>;
  /**
   * 删除指定 GM 存储项。
   *
   * @param key - 目标数据的键名。
   * @returns 处理结果（void | Promise<void>）。
   */
  deleteValue(key: string): void | Promise<void>;
}
export interface GMTab { /** 关闭当前页面或对话框。 */ close(): void; /** 处理标签页关闭事件。 */ onclose?: () => void }
export interface GMAuthAPI extends GMStorageAPI {
  /**
   * 在新标签页中打开链接。
   *
   * @param url - 请求或访问的 URL。
   * @param options - 本次操作的配置选项。
   * @returns 处理结果（GMTab | Promise<GMTab>）。
   */
  openInTab(url: string, options: { active: boolean; setParent: boolean }): GMTab | Promise<GMTab>;
  /**
   * 注册 GM 存储值变化监听器。
   *
   * @param key - 目标数据的键名。
   * @param callback - 接收处理结果的回调函数。
   * @returns 处理结果（number | Promise<number>）。
   */
  addValueChangeListener(key: string, callback: (key: string, oldValue: unknown, newValue: unknown, remote: boolean) => void): number | Promise<number>;
  /**
   * 移除 GM 存储值变化监听器。
   *
   * @param id - 目标标识。
   * @returns 处理结果（void | Promise<void>）。
   */
  removeValueChangeListener(id: number): void | Promise<void>;
}

export interface Auth {
  authToken: string;
  clientId: string;
  clientVersion: string;
  deviceId: string;
  clientSessionId: string;
}
export interface TwitchTasks { channels: string[] }
export interface SocialTaskDetailResult {
  success: boolean;
  results: Record<string, Record<string, boolean>>;
}
export type SocialTaskResult = boolean | SocialTaskDetailResult;
export interface TaskOptions { channelLinks?: string[] }
export interface TwitchOptions {
  http: HttpClient;
  gm?: GMAuthAPI;
  namespace?: string;
  authTimeoutMs?: number;
  /** Minimum delay between channels. Default 1000ms; operations run sequentially. */
  channelDelayMs?: number;
  followEnabled?: boolean;
  unfollowEnabled?: boolean;
}
