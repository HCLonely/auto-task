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
  // Steam endpoints return unrelated, sometimes undocumented JSON shapes.
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

export interface Auth {
  storeSessionID?: string;
  communitySessionID?: string;
  steam64Id?: string;
}
export type CacheType = 'group' | 'officialGroup' | 'forum' | 'workshop' | 'curator';
export type SteamCache = Record<CacheType, Record<string, string>>;
export interface Areas { currentArea?: string; areas?: string[] }
export interface FollowGameRequestData { sessionid?: string; appid: string; unfollow?: string }
export interface AnnouncementParams { authWgToken?: string; clanId?: string; gid?: string }
export interface StoreTokenParam { steamID: string; nonce: string; redir: string; auth: string }

export type StatusPhase = 'start' | 'progress' | 'success' | 'failure' | 'skipped';
export type StatusLevel = 'debug' | 'info' | 'warning' | 'error';
export interface SteamStatusEvent {
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
export type StatusListener = (event: SteamStatusEvent) => void | Promise<void>;

/** Structural GM APIs; supports both synchronous GM_* and asynchronous GM.* bindings. */
export interface GMStorageAPI {
  getValue<T>(key: string, fallback: T): T | Promise<T>;
  setValue(key: string, value: unknown): void | Promise<void>;
  deleteValue(key: string): void | Promise<void>;
}
export interface GMTab { close(): void; onclose?: () => void }
export interface GMAuthAPI extends GMStorageAPI {
  openInTab(url: string, options: { active: boolean; setParent: boolean }): GMTab | Promise<GMTab>;
  addValueChangeListener(key: string, callback: (key: string, oldValue: unknown, newValue: unknown, remote: boolean) => void): number | Promise<number>;
  removeValueChangeListener(id: number): void | Promise<void>;
}
export interface SteamWebOptions {
  http: HttpClient;
  /** Defaults to the host's GM_* APIs. All storage uses GM persistence. */
  gm?: GMAuthAPI;
  /** Use different namespaces to isolate userscripts/instances; same namespace shares cache. */
  namespace?: string;
  autoChangeRegion?: boolean;
  authTimeoutMs?: number;
}
export interface StepStatus {
  success(code?: string): StepStatus;
  error(code?: string): StepStatus;
  warning(code?: string): StepStatus;
  remove(): void;
}
