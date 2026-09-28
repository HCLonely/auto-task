/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamWeb/context.ts
 * @Description  : Steam 网页端 运行上下文与状态管理
 */

import { createGMStorage, getDefaultGM } from './adapters/gmStorage';
import { StatusEvents } from './events';
import type { Auth, GMAuthAPI, HttpClient, StatusLevel, SteamCache, SteamWebOptions, StepStatus } from './types';

export interface State {
  auth: Auth;
  cache: SteamCache;
  cacheLoaded: boolean;
  cacheLoading?: Promise<void>;
  cacheWrites: Promise<void>;
  storeInitialized: boolean;
  communityInitialized: boolean;
  storeInit?: Promise<boolean>;
  communityInit?: Promise<boolean>;
  area: string;
  oldArea?: string;
  regionQueue: Promise<unknown>;
  disposed: boolean;
  cleanups: Set<() => void>;
}

/**
 * 子上下文仅替换操作标识，账号状态仍由当前实例共享。
 */
export class Context {
  readonly events: StatusEvents;
  readonly gm: GMAuthAPI;
  readonly storage: ReturnType<typeof createGMStorage>;
  readonly state: State;
  readonly namespace: string;
  readonly authTimeoutMs: number;
  readonly autoChangeRegion: boolean;
  private readonly transport: HttpClient;
  private operationId = '';
  private parentOperationId?: string;
  private operation = '';
  private target?: string;
  private lastError?: string;

  /**
   * 创建 Context 实例并初始化所需状态。
   *
   * @remarks
   * 注入的请求、存储和授权依赖由当前实例持有。
   *
   * @param options - 本次操作的配置选项。
   * @throws Error - 触发 'Invalid authTimeoutMs' 错误条件时抛出。
   */
  constructor(options: SteamWebOptions) {
    this.transport = options.http;
    this.gm = options.gm || getDefaultGM();
    this.namespace = options.namespace || 'steamWeb';
    this.authTimeoutMs = options.authTimeoutMs ?? 120000;
    if (!Number.isFinite(this.authTimeoutMs) || this.authTimeoutMs <= 0) {
      throw new Error('Invalid authTimeoutMs');
    }
    this.autoChangeRegion = options.autoChangeRegion ?? true;
    this.storage = createGMStorage(this.gm, this.namespace);
    this.events = new StatusEvents();
    this.state = {
      auth: {},
      cache: {
        group: {},
        officialGroup: {},
        forum: {},
        workshop: {},
        curator: {}
      },
      cacheLoaded: false,
      cacheWrites: Promise.resolve(),
      storeInitialized: false,
      communityInitialized: false,
      area: 'CN',
      regionQueue: Promise.resolve(),
      disposed: false,
      cleanups: new Set()
    };
  }

  /**
   * 在独立操作上下文中执行任务并发送状态事件。
   *
   * @typeParam T - 操作处理的数据或返回值类型。
   * @param operation - 操作名称或执行函数。
   * @param target - 当前操作的目标。
   * @param work - 在当前上下文中执行的工作函数。
   * @param successful - 操作是否成功；可省略。
   * @returns Promise，完成后返回工作函数或存储读取产生的泛型结果。
   * @throws 执行过程中发生的异常会继续向调用方传播。
   */
  async run<T>(operation: string, target: string | undefined, work: (ctx: Context) => Promise<T>, successful?: (value: T) => boolean): Promise<T> {
    const child = Object.assign(Object.create(Context.prototype) as Context, this);
    child.operationId = crypto.randomUUID();
    child.parentOperationId = this.operationId || undefined;
    child.operation = operation;
    child.target = target;
    child.lastError = undefined;
    child.emit('start', 'info', 'OPERATION_STARTED');
    try {
      const value = await work(child);
      const ok = successful ? successful(value) : value !== false && value !== undefined && value !== null &&
        !(typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length === 0) && value !== 'areaLocked';
      child.emit(value === 'skip' ? 'skipped' : (ok ? 'success' : 'failure'), ok ? 'info' : 'error',
        ok ? 'OPERATION_COMPLETED' : (child.lastError || 'OPERATION_FAILED'));
      return value;
    } catch (error) {
      child.emit('failure', 'error', child.lastError || 'UNEXPECTED_ERROR');
      throw error;
    }
  }

  /**
   * 向监听器发送状态事件。
   *
   * @param phase - 操作所处阶段。
   * @param level - 日志级别。
   * @param code - 状态代码。
   * @param details - 状态事件的补充信息；可省略。
   */
  private emit(phase: 'start' | 'progress' | 'success' | 'failure' | 'skipped', level: StatusLevel, code: string,
    details?: Record<string, string | number | boolean>): void {
    this.events.emit({
      operationId: this.operationId,
      parentOperationId: this.parentOperationId,
      operation: this.operation,
      phase,
      level,
      code,
      target: this.target,
      timestamp: Date.now(),
      details
    });
  }

  /**
   * 发送操作进度状态。
   *
   * @param code - 状态代码。
   * @param level - 日志级别；默认值为 `'info'`。
   * @param details - 状态事件的补充信息；可省略。
   */
  progress(code: string, level: StatusLevel = 'info', details?: Record<string, string | number | boolean>): void {
    if (level === 'error') {
      this.lastError = code;
    }
    this.emit('progress', level, code, details);
  }

  /**
   * 报告当前操作的异常状态。
   */
  reportError(): void {
    this.progress('UNEXPECTED_ERROR', 'error');
  }

  /**
   * 步骤状态更新不发送整个操作的结束事件。
   *
   * @param code - 状态代码。
   * @param target - 当前操作的目标；可省略。
   * @returns 可继续报告同一步骤状态的控制器。
   */
  step(code: string, target?: string): StepStatus {
    this.progress(code, 'info', target ? {
      target
    } : undefined);
    /**
     * 创建指定日志级别的步骤状态更新函数。
     *
     * @param level - 日志级别。
     * @param fallback - 未取得有效数据时使用的默认值。
     * @returns 供调用方使用的函数。
     */
    const update = (level: StatusLevel, fallback: string) => {
      return (reason = fallback): StepStatus => {
        this.progress(reason, level, target ? {
          target
        } : undefined);
        return status;
      };
    };
    const status: StepStatus = {
      success: update('info', 'STEP_COMPLETED'),
      error: update('error', 'STEP_FAILED'),
      warning: update('warning', 'STEP_WARNING'),
      /**
       * 移除指定记录或界面元素。
       */
      remove: () => {
        return this.progress('STEP_COMPLETED', 'debug');
      }
    };
    return status;
  }

  /**
   * 发送 HTTP 请求并处理传输状态。
   *
   * @param options - 本次操作的配置选项。
   * @returns Promise，完成后返回处理结果。
   * @throws Error - 触发 'SteamWeb disposed' 错误条件时抛出。
   */
  async request(options: Parameters<HttpClient>[0]): ReturnType<HttpClient> {
    if (this.state.disposed) {
      throw new Error('SteamWeb disposed');
    }
    this.progress('HTTP_REQUEST_STARTED', 'debug', {
      method: options.method || 'GET'
    });
    const result = await this.transport(options);
    if (this.state.disposed) {
      throw new Error('SteamWeb disposed');
    }
    this.progress('HTTP_REQUEST_COMPLETED', result.result === 'Success' ? 'debug' : 'warning', {
      transportStatus: result.status,
      httpStatus: result.data?.status || 0
    });
    return result;
  }
}
