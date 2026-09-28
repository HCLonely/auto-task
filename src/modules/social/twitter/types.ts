/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:35:45
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitter/types.ts
 * @Description  : Twitter 类型定义
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
  redirect?: 'follow' | 'manual';
}

export interface HttpData {
  status: number;
  statusText: string;
  responseText: string;
  // Twitter endpoints return unrelated, sometimes undocumented JSON shapes.
  response: any;
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

export interface TwitterTasks { users: string[]; retweets: string[]; likes: string[] }
export interface TaskFlags { users: boolean; retweets: boolean }
export interface TaskOptions { userLinks?: string[]; retweetLinks?: string[] }
export interface TwitterTaskDetailResult {
  success: boolean;
  results: Partial<Record<'userLinks' | 'retweetLinks', Record<string, boolean>>>;
}
export type TwitterTaskResult = boolean | TwitterTaskDetailResult;
export type SocialTaskResult = TwitterTaskResult;
export interface Auth { ct0: string; userId: string; language: string }
export interface GMCookie { name: string; value: string }
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
export interface TwitterGMAPI extends GMStorageAPI {
  /**
   * 读取符合条件的 Cookie 列表。
   *
   * @remarks
   * Bind GM_cookie.list, or adapt an async cookie API to this callback interface.
   *
   * @param details - 状态事件的补充信息。
   * @param callback - 接收处理结果的回调函数。
   * @returns 处理结果。
   */
  listCookies(details: { url: string }, callback: (cookies: GMCookie[], error?: unknown) => void): unknown;
}
/**
 * 为指定请求生成事务标识。
 *
 * @param method - HTTP 请求方法。
 * @param path - 请求路径。
 * @returns Promise，完成后返回处理后的字符串。
 */
export type TransactionIdProvider = (method: string, path: string) => Promise<string>;
export interface TransactionPair { verification: string; animationKey: string }
export interface ApiConfig {
  bearerToken: string;
  userByScreenName: string;
  createRetweet: string;
  deleteRetweet: string;
  userFeatures: Record<string, boolean>;
  userFieldToggles: Record<string, boolean>;
}
export interface TwitterOptions {
  http: HttpClient;
  gm?: TwitterGMAPI;
  namespace?: string;
  /** Original verification behavior: attempts to follow this account. Default: 783214. */
  verifyId?: string;
  doTask?: Partial<TaskFlags>;
  undoTask?: Partial<TaskFlags>;
  whiteList?: Partial<TwitterTasks>;
  taskDelayMs?: number;
  cookieTimeoutMs?: number;
  /** Optional externally maintained generator; skips downloading the pair dictionary. */
  getTransactionId?: TransactionIdProvider;
  transactionPairsUrl?: string;
  api?: Partial<ApiConfig>;
}
export type StatusPhase = 'start' | 'progress' | 'success' | 'failure' | 'skipped';
export type StatusLevel = 'debug' | 'info' | 'warning' | 'error';
export interface TwitterStatusEvent {
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
export type StatusListener = (event: TwitterStatusEvent) => void | Promise<void>;
