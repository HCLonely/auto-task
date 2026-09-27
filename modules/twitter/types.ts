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
  getValue<T>(key: string, fallback: T): T | Promise<T>;
  setValue(key: string, value: unknown): void | Promise<void>;
  deleteValue(key: string): void | Promise<void>;
}
export interface TwitterGMAPI extends GMStorageAPI {
  /** Bind GM_cookie.list, or adapt an async cookie API to this callback interface. */
  listCookies(details: { url: string }, callback: (cookies: GMCookie[], error?: unknown) => void): unknown;
}
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
export type StatusListener = (event: TwitterStatusEvent) => void | Promise<void>;
