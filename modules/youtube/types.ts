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
export type HttpClient = (options: HttpRequestOptions) => Promise<HttpResponse>;
export interface GMStorageAPI {
  getValue<T>(key: string, fallback: T): T | Promise<T>;
  setValue(key: string, value: unknown): void | Promise<void>;
  deleteValue(key: string): void | Promise<void>;
}
export interface Cookie { name: string; value: string; domain?: string; path?: string }
export type GMCookieList = (
  details: { url: string },
  callback: (cookies: Cookie[], error?: unknown) => void
) => unknown;
export type CookieReader = (url: string) => Promise<Cookie[]>;
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
