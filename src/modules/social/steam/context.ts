/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/context.ts
 * @Description  : Steam 运行上下文与状态管理
 */

import SteamASF from './steamASF';
import SteamWeb from './steamWeb';
import { createGMStorage, getDefaultGM } from './steamWeb/adapters/gmStorage';
import { asfDefaults, createTasks, doDefaults, undoDefaults } from './defaults';
import { SteamEvents } from './events';
import type { Executor, SteamEvent, SteamOptions, SteamTasks } from './types';

/**
 * 封装任务操作错误及其状态代码。
 */
export class SteamError extends Error {
  /**
   * 创建 SteamError 实例并初始化所需状态。
   *
   * @param code - 状态代码。
   */
  constructor(readonly code: string) {
    super(code);
  }
}
/**
 * 管理 Steam 模块的授权、存储、任务状态与操作上下文。
 */
export class Context {
  readonly events = new SteamEvents();
  readonly storage: ReturnType<typeof createGMStorage>;
  readonly options;
  readonly executors: Executor[] = [];
  readonly activeParents = new Map<Executor, string>();
  readonly unsubscribers: Array<() => void> = [];
  readonly state: {
    tasks: SteamTasks; whiteList: SteamTasks; loaded: boolean; queue: Promise<unknown>; disposed: boolean;
  } = {
      tasks: createTasks(),
      whiteList: createTasks(),
      loaded: false,
      queue: Promise.resolve(),
      disposed: false
    };
  private operationId = '';
  private parentOperationId?: string;
  private operation = '';
  private target?: string;
  private skipped?: string;
  private operationDetails?: Record<string, string | number | boolean>;

  /**
   * 创建 Context 实例并初始化所需状态。
   *
   * @remarks
   * 注入的请求、存储和授权依赖由当前实例持有。
   *
   * @param options - 本次操作的配置选项。
   * @throws Error - 触发 'Invalid delay' 错误条件时抛出。
   */
  constructor(options: SteamOptions) {
    this.options = {
      ...options,
      namespace: options.namespace || 'steam',
      ASF: {
        ...asfDefaults,
        ...options.ASF
      },
      doTask: {
        ...doDefaults,
        ...options.doTask
      },
      undoTask: {
        ...undoDefaults,
        ...options.undoTask
      },
      taskDelayMs: options.taskDelayMs ?? 1000,
      playRetryDelayMs: options.playRetryDelayMs ?? 3000
    };
    for (const ms of [this.options.taskDelayMs, this.options.playRetryDelayMs]) {
      if (!Number.isFinite(ms) || ms < 0) {
        throw new Error('Invalid delay');
      }
    }
    const gm = {
      ...getDefaultGM(),
      ...options.gm
    };
    this.storage = createGMStorage(gm, this.options.namespace);
    const asf = this.options.ASF;
    if (asf.AsfEnabled) {
      this.executors.push({
        source: 'steamASF',
        ready: new Set(),
        client: new SteamASF({
          ...asf,
          http: options.http,
          gm,
          namespace: `${this.options.namespace}:asf`
        })
      });
    }
    if (!asf.AsfEnabled || asf.steamWeb) {
      this.executors.push({
        source: 'steamWeb',
        ready: new Set(),
        client: new SteamWeb({
          http: options.http,
          gm,
          namespace: `${this.options.namespace}:web`,
          autoChangeRegion: options.autoChangeRegion,
          authTimeoutMs: options.authTimeoutMs
        })
      });
    }
    if (!asf.preferASF) {
      this.executors.sort((a, b) => {
        return Number(a.source === 'steamASF') - Number(b.source === 'steamASF');
      });
    }
    for (const executor of this.executors) {
      this.unsubscribers.push(executor.client.on('status', (event) => {
        return this.events.emit({
          ...event,
          source: executor.source,
          parentOperationId: event.parentOperationId || this.activeParents.get(executor)
        });
      }));
    }
  }

  /**
   * 将操作加入串行执行队列。
   *
   * @typeParam T - 操作处理的数据或返回值类型。
   * @param work - 在当前上下文中执行的工作函数。
   * @returns Promise，完成后返回工作函数或存储读取产生的泛型结果。
   */
  enqueue<T>(work: () => Promise<T>): Promise<T> {
    const job = this.state.queue.then(work);
    this.state.queue = job.catch(() => {
      return undefined;
    });
    return job;
  }

  /**
   * 在独立操作上下文中执行任务并发送状态事件。
   *
   * @typeParam T - 操作处理的数据或返回值类型。
   * @param operation - 操作名称或执行函数。
   * @param target - 当前操作的目标。
   * @param fallback - 未取得有效数据时使用的默认值。
   * @param work - 在当前上下文中执行的工作函数。
   * @param success - 根据工作函数返回值判断操作是否成功的回调；可省略。
   * @param details - 状态事件的补充信息；可省略。
   * @returns Promise，完成后返回工作函数或存储读取产生的泛型结果。
   */
  async run<T>(operation: string, target: string | undefined, fallback: T, work: (ctx: Context) => Promise<T>, success?: (value: T) => boolean, details?: Record<string, string | number | boolean>): Promise<T> {
    const child = Object.assign(Object.create(Context.prototype) as Context, this);
    child.operationId = crypto.randomUUID();
    child.parentOperationId = this.operationId || undefined;
    child.operation = operation;
    child.target = target;
    child.skipped = undefined;
    child.operationDetails = details;
    child.emit('start', 'OPERATION_STARTED');
    try {
      if (child.state.disposed) {
        throw new SteamError('DISPOSED');
      }
      const value = await work(child);
      const ok = success ? success(value) : value !== false;
      child.emit(child.skipped ? 'skipped' : (ok ? 'success' : 'failure'), child.skipped || (ok ? 'OPERATION_COMPLETED' : 'OPERATION_FAILED'));
      return value;
    } catch (error) {
      child.emit('failure', error instanceof SteamError ? error.code : 'UNEXPECTED_ERROR');
      return fallback;
    }
  }

  /**
   * 向监听器发送状态事件。
   *
   * @param phase - 操作所处阶段。
   * @param code - 状态代码。
   * @param details - 状态事件的补充信息；可省略。
   */
  private emit(phase: SteamEvent['phase'], code: string, details?: Record<string, string | number | boolean>): void {
    this.events.emit({
      source: 'steam',
      operationId: this.operationId,
      parentOperationId: this.parentOperationId,
      operation: this.operation,
      target: this.target,
      phase,
      level: phase === 'failure' ? 'error' : 'info',
      code,
      timestamp: Date.now(),
      details: {
        ...this.operationDetails,
        ...details
      }
    });
  }
  /**
   * 发送操作进度状态。
   *
   * @param code - 状态代码。
   * @param details - 状态事件的补充信息；可省略。
   */
  progress(code: string, details?: Record<string, string | number | boolean>): void {
    this.emit('progress', code, details);
  }
  /**
   * 记录当前操作的跳过状态。
   *
   * @param code - 状态代码。
   */
  skip(code: string): void {
    this.skipped = code;
  }

  /**
   * 调用目标模块操作。
   *
   * @typeParam T - 操作处理的数据或返回值类型。
   * @param executor - 选定的任务执行器。
   * @param work - 在当前上下文中执行的工作函数。
   * @returns Promise，完成后返回工作函数或存储读取产生的泛型结果。
   * @throws SteamError - 触发 'DISPOSED' 错误条件时抛出。
   */
  async invoke<T>(executor: Executor, work: () => Promise<T>): Promise<T> {
    if (this.state.disposed) {
      throw new SteamError('DISPOSED');
    }
    this.activeParents.set(executor, this.operationId);
    try {
      return await work();
    } finally {
      this.activeParents.delete(executor);
    }
  }

  /**
   * 等待配置的任务间隔。
   *
   * @param ms - 等待时长，单位为毫秒；默认值为 `this.options.taskDelayMs`。
   * @returns 在操作完成后兑现的 Promise。
   * @throws SteamError - 触发 'DISPOSED' 错误条件时抛出。
   */
  async delay(ms = this.options.taskDelayMs): Promise<void> {
    if (ms) {
      await new Promise<void>((resolve) => {
        return setTimeout(resolve, ms);
      });
    }
    if (this.state.disposed) {
      throw new SteamError('DISPOSED');
    }
  }
}
