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
  // VK endpoints return unrelated, sometimes undocumented JSON shapes.
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

export type StatusPhase = 'start' | 'progress' | 'success' | 'failure' | 'skipped';
export type StatusLevel = 'debug' | 'info' | 'warning' | 'error';
export interface VkStatusEvent {
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
export type StatusListener = (event: VkStatusEvent) => void | Promise<void>;

/** Structural GM APIs; supports both synchronous GM_* and asynchronous GM.* bindings. */
export interface GMStorageAPI {
  getValue<T>(key: string, fallback: T): T | Promise<T>;
  setValue(key: string, value: unknown): void | Promise<void>;
  deleteValue(key: string): void | Promise<void>;
}

export interface VkTasks { names: string[] }
export interface SocialTaskDetailResult {
  success: boolean;
  results: Record<string, Record<string, boolean>>;
}
export type SocialTaskResult = boolean | SocialTaskDetailResult;
export interface TaskOptions { nameLinks?: string[] }
export interface VkOptions {
  http: HttpClient;
  gm?: GMStorageAPI;
  namespace?: string;
  doTaskEnabled?: boolean;
  undoTaskEnabled?: boolean;
  /** Delay between operations; defaults to the original 1000ms. */
  intervalMs?: number;
  apiVersion?: string;
  appId?: string;
}
export interface GroupParams { groupId: string; isMember?: string }
export interface PublicParams { publicPid: string; publicHash: string; publicJoined: boolean }
export type Target = { type: 'group'; params: GroupParams } | { type: 'wall'; name: string; like: boolean };
export interface WallItem {
  type: string;
  id: number;
  owner_id: number;
  track_code?: string;
  likes?: { user_likes?: boolean | number };
  reposts?: { user_reposted?: boolean | number };
}
