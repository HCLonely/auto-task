export type InitResult = boolean | 'skip';
export interface SocialTaskDetailResult {
  success: boolean;
  results: Record<string, Record<string, boolean> | undefined>;
}
export type SocialTaskResult = boolean | SocialTaskDetailResult;

export interface SocialStatusEvent {
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
export type StatusListener = (event: SocialStatusEvent) => void | Promise<void>;

/** Structural contract: standalone modules do not need to import or inherit Social. */
export interface SocialModule {
  readonly tasks: object;
  init(...args: never[]): Promise<InitResult>;
  do(...args: never[]): Promise<SocialTaskResult>;
  undo(...args: never[]): Promise<SocialTaskResult>;
  on(event: 'status', listener: StatusListener): () => void;
  dispose(): void;
}
export type InitOptions<C extends SocialModule> = Parameters<C['init']>[0];
export type TaskOptions<C extends SocialModule> = Parameters<C['do']>[0];
export interface ManagerStatusEvent extends SocialStatusEvent {
  /** Registration key, e.g. steam/vk. Original executor source remains on the forwarded event. */
  readonly platform: string;
  readonly origin: 'module' | 'manager';
  readonly source?: string;
}
export type ManagerListener = (event: ManagerStatusEvent) => void | Promise<void>;
export interface BatchResult<R> { success: boolean; results: R }

export function isSuccessful(result: SocialTaskResult): boolean {
  return typeof result === 'boolean' ? result : result.success;
}
