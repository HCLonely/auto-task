import type { SocialStatusEvent } from '../types';

export type GFFPlatform = 'steam' | 'youtube';
export type GFFMaybePromise<T> = T | Promise<T>;
export type GFFListenerId = string | number;

/** 独立的结构接口，可注入同步 GM_* 包装或异步 GM 实现。 */
export interface GMAPI {
  getValue<T = unknown>(key: string, fallback?: T): GFFMaybePromise<T | undefined>;
  setValue(key: string, value: unknown): GFFMaybePromise<void>;
  deleteValue(key: string): GFFMaybePromise<void>;
  addValueChangeListener(key: string, listener: (key: string, oldValue: unknown, newValue: unknown, remote: boolean) => void): GFFMaybePromise<GFFListenerId>;
  removeValueChangeListener(id: GFFListenerId): GFFMaybePromise<void>;
  openInTab(url: string, options: { active: boolean; setParent: boolean }): GFFMaybePromise<GFFTab | undefined>;
}

export interface GFFTab {
  close(): void;
  onclose?: (() => void) | null;
  readonly closed?: boolean;
}

export interface GFFOptions {
  gm: GMAPI;
  namespace: string;
  platform?: GFFPlatform;
  timeoutMs?: number;
  enabled?: Record<string, boolean>;
}

export interface GFFRequest {
  id: string;
  platform: GFFPlatform;
  taskType: string;
  link: string;
  openedUrl: string;
  phase: 'initial' | 'awaiting-refresh' | 'after-refresh';
  refreshCount: 0 | 1;
  actionDispatched: boolean;
  ownerPage: string;
  batchId: string;
  createdAt: number;
  expiresAt: number;
}

export interface GFFReply {
  id: string;
  status: 'completed' | 'failed' | 'cancelled';
  code: string;
  finishedAt: number;
}

export interface GFFPreparedState {
  status: 'applied' | 'pending';
  originalAdded?: boolean;
  appliedBeforeLoad: boolean;
}

export interface GFFPageHandlerOptions {
  gm?: GMAPI;
  namespace: string;
  platform: GFFPlatform;
  prepare(request: GFFRequest, previous?: GFFPreparedState): GFFPreparedState;
  finalize(request: GFFRequest, prepared: GFFPreparedState): Promise<'complete' | 'refresh'>;
}

export type GFFStatusListener = (event: SocialStatusEvent) => void | Promise<void>;
