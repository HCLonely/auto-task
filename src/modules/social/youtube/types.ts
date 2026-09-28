/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:35:45
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/youtube/types.ts
 * @Description  : YouTube 类型定义
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
export interface HttpData {
  status: number;
  statusText: string;
  responseText: string;
  response: unknown;
  finalUrl: string;
  responseHeaders: Record<string, string | string[]>;
}
export interface HttpResponse {
  result: 'Success' | 'Error' | 'JsError';
  /** Transport codes: 600 load, 601 timeout, 602 abort, 603 network, 604 JS/parse error. */
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
export interface Cookie { name: string; value: string; domain?: string; path?: string }
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
 * @param url - 请求或访问的 URL。
 * @returns Promise，完成后返回读取到的 Cookie 列表。
 */
export type CookieReader = (url: string) => Promise<Cookie[]>;
/**
 * 计算输入文本的 SHA-1 摘要。
 *
 * @param value - 待处理的值。
 * @returns 处理结果（string | Promise<string>）。
 */
export type SHA1 = (value: string) => string | Promise<string>;
export interface YoutubeTasks { channels: string[]; likes: string[] }
export interface TaskSwitches { channels: boolean; likes: boolean }
export interface TaskOptions { channelLinks?: string[]; videoLinks?: string[] }
export interface SocialTaskDetailResult { success: boolean; results: Record<string, Record<string, boolean>> }
export type SocialTaskResult = boolean | SocialTaskDetailResult;
export type InfoType = 'channel' | 'likeVideo';
export interface YoutubeInfo {
  params?: {
    apiKey: string;
    client: Record<string, unknown> & { visitorData?: string; hl?: string };
    request: Record<string, unknown> & { sessionId?: string };
    channelId?: string;
    videoId?: string;
    likeParams?: string;
  };
  needLogin?: boolean;
}
export interface YoutubeStatusEvent {
  readonly operationId: string;
  readonly parentOperationId?: string;
  readonly operation: string;
  readonly phase: 'start' | 'progress' | 'success' | 'failure' | 'skipped';
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
export type StatusListener = (event: YoutubeStatusEvent) => void | Promise<void>;
export interface YoutubeOptions {
  http: HttpClient;
  gm?: GMStorageAPI;
  /** Defaults to a bounded GM_cookie.list adapter. */
  cookies?: CookieReader;
  /** Defaults to the browser Web Crypto SHA-1 implementation. */
  sha1?: SHA1;
  namespace?: string;
  /** Channel ID or YouTube channel URL. Verification tries to subscribe to it. */
  verifyChannel?: string;
  whiteList?: Partial<YoutubeTasks>;
  doTask?: Partial<TaskSwitches>;
  undoTask?: Partial<TaskSwitches>;
  /** Delay between starting batch items, as in the original implementation. */
  taskDelayMs?: number;
  cookieTimeoutMs?: number;
}
export interface InfoOptions { http?: HttpClient; onStatus?: StatusListener }
