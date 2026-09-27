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
export type StatusListener = (event: TwitchStatusEvent) => void | Promise<void>;

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
