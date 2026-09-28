/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:35:45
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/reddit/types.ts
 * @Description  : Reddit 类型定义
 */

export interface HttpRequestOptions {
  url: string;
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  data?: string | FormData;
  responseType?: 'text' | 'json';
  dataType?: 'text' | 'json';
  timeout?: number;
  redirect?: 'follow' | 'manual';
}
export interface HttpResponse {
  result: 'Success' | 'Error' | 'JsError';
  /** Transport code; the HTTP status is data.status. */
  status: number;
  statusText: string;
  data?: {
    status: number;
    statusText: string;
    responseText: string;
    response: unknown;
    finalUrl: string;
    responseHeaders: Record<string, string | string[]>;
  };
}
/**
 * 按请求选项发送 HTTP 请求。
 *
 * @param options - 本次操作的配置选项。
 * @returns Promise，完成后返回标准化的传输状态与响应数据。
 */
export type HttpClient = (options: HttpRequestOptions) => Promise<HttpResponse>;
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
}
export interface Cookie { name: string; value: string }
/**
 * 通过回调读取符合条件的 Cookie。
 *
 * @param details - 状态事件的补充信息。
 * @param callback - 接收处理结果的回调函数。
 * @returns 处理结果。
 */
export type GMCookieList = (
  details: { url: string },
  callback: (cookies: Cookie[], error?: unknown) => void
) => unknown;
/**
 * 异步读取平台 Cookie 列表。
 *
 * @returns Promise，完成后返回读取到的 Cookie 列表。
 */
export type CookieReader = () => Promise<Cookie[]>;
export interface RedditTasks { reddits: string[] }
export interface SocialTaskDetailResult {
  success: boolean;
  results: Record<string, Record<string, boolean>>;
}
export type SocialTaskResult = boolean | SocialTaskDetailResult;
export interface TaskOptions { redditLinks?: string[] }
export interface RedditOptions {
  http: HttpClient;
  /** Defaults to the current userscript's GM_getValue/GM_setValue. */
  gm?: GMStorageAPI;
  /** Defaults to the GM_cookie.list adapter; never reads document.cookie. */
  cookies?: CookieReader;
  namespace?: string;
  cookieTimeoutMs?: number;
  /** Delay between batch items; default 1000 ms. Items execute sequentially. */
  intervalMs?: number;
  doTaskEnabled?: boolean;
  undoTaskEnabled?: boolean;
}
export type StatusPhase = 'start' | 'progress' | 'success' | 'failure' | 'skipped';
export interface RedditStatusEvent {
  readonly operationId: string;
  readonly parentOperationId?: string;
  readonly operation: string;
  readonly phase: StatusPhase;
  readonly level: 'debug' | 'info' | 'warning' | 'error';
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
export type StatusListener = (event: RedditStatusEvent) => void | Promise<void>;
export interface RedditTarget { name: string; kind: 'subreddit' | 'user'; taskName: string }
