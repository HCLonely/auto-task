export type TaskAction = 'add' | 'remove';
export type TaskData = string | number;
export type Cleanup = () => void;
export type UnknownRecord = Record<string, unknown>;
export interface TaskRecord {
  type: string;
  data: TaskData;
  time: number;
}
export interface UserData extends UnknownRecord {
  steam?: string | number;
  avatar?: string;
  name?: string;
  lang?: string;
}
export interface GamesData extends UnknownRecord {
}
export interface SettingsData extends UnknownRecord {
  game_update?: number;
  hide_games?: boolean;
  store_games?: number;
}
export interface DiscordEntry {
  name: string;
  level: string | number;
}
export interface StorageChange<T = unknown> {
  key: string;
  oldValue: T | undefined;
  newValue: T | undefined;
}
export interface StorageService {
  get<T>(key: string, defaultValue?: T): Promise<T>;
  getAll(): Promise<UnknownRecord>;
  set<T>(key: string, value: T): Promise<void>;
  setMany(values: UnknownRecord): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  initialize(): Promise<UnknownRecord>;
  subscribe(listener: (change: StorageChange) => void | Promise<void>): () => void;
}
export interface TaskStore {
  update(type: string, data: TaskData, action: TaskAction): Promise<void>;
}
export interface RawStorageApi {
  get<T>(key: string, defaultValue?: T): Promise<T>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  getAll(): Promise<UnknownRecord>;
  clear(): Promise<void>;
}
export interface EntityApi<T extends UnknownRecord> {
  get(): Promise<T>;
  update(partial: Partial<T>): Promise<void>;
  replace(value: T): Promise<void>;
}
export interface GamesForFarmApi {
  tasks: {
    get(): Promise<TaskRecord[]>;
    add(type: string, data: TaskData): Promise<void>;
    remove(type: string, data: TaskData): Promise<void>;
    update(type: string, data: TaskData, action: TaskAction): Promise<void>;
  };
  user: EntityApi<UserData>;
  games: EntityApi<GamesData>;
  settings: EntityApi<SettingsData>;
  discord: {
    get(): Promise<DiscordEntry[]>;
    update(entries: DiscordEntry[]): Promise<void>;
    clear(): Promise<void>;
  };
  storage: RawStorageApi;
}
export interface GmStorageApi {
  GM_getValue<T>(key: string, defaultValue?: T): T | Promise<T>;
  GM_setValue<T>(key: string, value: T): void | Promise<void>;
  GM_deleteValue(key: string): void | Promise<void>;
  GM_listValues(): string[] | Promise<string[]>;
}
export interface GmRequestResponse {
  status: number;
  statusText?: string;
  responseText?: string;
}
export interface GmRequestOptions {
  method?: string;
  url: string;
  data?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
  onload?(response: GmRequestResponse): void;
  onerror?(): void;
  ontimeout?(): void;
  onabort?(): void;
  [key: string]: unknown;
}
export interface GmRequestApi {
  GM_xmlhttpRequest(options: GmRequestOptions): unknown;
}
export interface RequestService {
  request(options: GmRequestOptions): Promise<string>;
  get(url: string): Promise<string>;
  postForm(url: string, data: Record<string, unknown>): Promise<string>;
}
