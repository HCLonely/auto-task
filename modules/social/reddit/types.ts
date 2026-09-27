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
export type HttpClient = (options: HttpRequestOptions) => Promise<HttpResponse>;
export interface GMStorageAPI {
  getValue<T>(key: string, fallback: T): T | Promise<T>;
  setValue(key: string, value: unknown): void | Promise<void>;
}
export interface Cookie { name: string; value: string }
export type GMCookieList = (
  details: { url: string },
  callback: (cookies: Cookie[], error?: unknown) => void
) => unknown;
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
export type StatusListener = (event: RedditStatusEvent) => void | Promise<void>;
export interface RedditTarget { name: string; kind: 'subreddit' | 'user'; taskName: string }
