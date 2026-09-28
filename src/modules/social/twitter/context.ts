/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitter/context.ts
 * @Description  : Twitter 运行上下文与状态管理
 */

import { createGMStorage, getDefaultGM } from './adapters/gmStorage';
import { DEFAULT_API } from './defaults';
import { StatusEvents } from './events';
import type { ApiConfig, Auth, StatusLevel, StatusPhase, TransactionIdProvider, TwitterOptions, TwitterTasks } from './types';

/**
 * 创建空的任务集合。
 *
 * @returns Twitter 任务集合。
 */
export const emptyTasks = (): TwitterTasks => {
  return {
    users: [],
    retweets: [],
    likes: []
  };
};
/**
 * 规范化任务集合。
 *
 * @param value - 待处理的值。
 * @returns Twitter 任务集合。
 */
export function normalizeTasks(value: Partial<TwitterTasks> | null | undefined): TwitterTasks {
  const result = emptyTasks();
  for (const key of ['users', 'retweets', 'likes'] as const) {
    result[key] = Array.isArray(value?.[key]) ? [...new Set(value[key].filter((entry) => {
      return typeof entry === 'string';
    }))] : [];
  }
  return result;
}

/**
 * 管理 Twitter 模块的授权、存储、任务状态与操作上下文。
 */
export class Context {
  readonly gm;
  readonly storage;
  readonly events = new StatusEvents();
  readonly api: ApiConfig;
  readonly options: TwitterOptions;
  readonly state = {
    initialized: false,
    disposed: false,
    initPromise: undefined as Promise<boolean> | undefined,
    auth: undefined as Auth | undefined,
    getTID: undefined as TransactionIdProvider | undefined,
    cache: Object.create(null) as Record<string, string>,
    writes: Promise.resolve(),
    tasks: emptyTasks(),
    whiteList: emptyTasks(),
    whiteListConfigured: false,
    cleanups: new Set<() => void>()
  };
  private operationId = '';
  private parentOperationId?: string;
  private operation = '';
  private target?: string;
  private taskLink?: string;

  /**
   * 将原始任务 URL 限定到当前操作及其子操作。
   *
   * @param link - 任务目标链接。
   * @returns 共享账号状态且保留指定任务链接的子上下文。
   */
  forTaskLink(link: string): Context {
    const child = Object.assign(Object.create(Context.prototype) as Context, this);
    child.taskLink = link;
    return child;
  }

  private failureCode?: string;
  private skipCode?: string;

  /**
   * 创建 Context 实例并初始化所需状态。
   *
   * @remarks
   * 注入的请求、存储和授权依赖由当前实例持有。
   *
   * @param options - 本次操作的配置选项。
   * @throws Error - 触发 `Invalid ${name}` 错误条件时抛出。
   * @throws Error - 触发 'Invalid verifyId' 错误条件时抛出。
   */
  constructor(options: TwitterOptions) {
    this.options = {
      ...options,
      verifyId: options.verifyId ?? '783214',
      taskDelayMs: options.taskDelayMs ?? 1000,
      cookieTimeoutMs: options.cookieTimeoutMs ?? 30000,
      doTask: {
        users: true,
        retweets: true,
        ...options.doTask
      },
      undoTask: {
        users: true,
        retweets: true,
        ...options.undoTask
      }
    };
    for (const [name, value] of [['taskDelayMs', this.options.taskDelayMs], ['cookieTimeoutMs', this.options.cookieTimeoutMs]] as const) {
      if (!Number.isFinite(value) || value! < (name === 'cookieTimeoutMs' ? 1 : 0) || value! > 2147483647) {
        throw new Error(`Invalid ${name}`);
      }
    }
    if (!/^\d+$/.test(this.options.verifyId!)) {
      throw new Error('Invalid verifyId');
    }
    this.api = {
      ...DEFAULT_API,
      ...options.api
    };
    this.gm = options.gm || getDefaultGM();
    this.storage = createGMStorage(this.gm, options.namespace || 'twitter');
    this.state.whiteList = normalizeTasks(options.whiteList);
  }

  /**
   * 在独立操作上下文中执行任务并发送状态事件。
   *
   * @typeParam T - 操作处理的数据或返回值类型。
   * @param operation - 操作名称或执行函数。
   * @param target - 当前操作的目标。
   * @param fallback - 未取得有效数据时使用的默认值。
   * @param work - 在当前上下文中执行的工作函数。
   * @returns Promise，完成后返回工作函数或存储读取产生的泛型结果。
   */
  async run<T>(operation: string, target: string | undefined, fallback: T, work: (ctx: Context) => Promise<T>): Promise<T> {
    const ctx = Object.assign(Object.create(Context.prototype) as Context, this);
    ctx.operationId = crypto.randomUUID();
    ctx.parentOperationId = this.operationId || undefined;
    ctx.operation = operation;
    ctx.target = target;
    ctx.failureCode = undefined;
    ctx.skipCode = undefined;
    ctx.emit('start', 'info', 'OPERATION_STARTED');
    let result = fallback;
    try {
      if (ctx.state.disposed) {
        ctx.progress('DISPOSED', 'error');
      } else {
        result = await work(ctx);
      }
    } catch {
      ctx.progress('UNEXPECTED_ERROR', 'error');
    }
    const success = result !== false && result !== undefined && result !== null &&
      !(typeof result === 'object' && 'success' in result && result.success === false);
    ctx.emit(success ? (ctx.skipCode ? 'skipped' : 'success') : 'failure', success ? 'info' : 'error',
      success ? (ctx.skipCode || 'OPERATION_COMPLETED') : (ctx.failureCode || 'OPERATION_FAILED'));
    return result;
  }

  /**
   * 向监听器发送状态事件。
   *
   * @param phase - 操作所处阶段。
   * @param level - 日志级别。
   * @param code - 状态代码。
   * @param details - 状态事件的补充信息；可省略。
   */
  private emit(phase: StatusPhase, level: StatusLevel, code: string, details?: Record<string, string | number | boolean>): void {
    this.events.emit({
      operationId: this.operationId,
      parentOperationId: this.parentOperationId,
      operation: this.operation,
      target: this.target,
      phase,
      level,
      code,
      timestamp: Date.now(),
      details: {
        ...details,
        ...(this.taskLink ? {
          taskLink: this.taskLink
        } : {})
      }
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
      this.failureCode = code;
    }
    this.emit('progress', level, code, details);
  }
  /**
   * 记录当前操作的跳过状态。
   *
   * @param code - 状态代码。
   * @returns true，表示当前步骤已接受或已跳过。
   */
  skip(code: string): true {
    this.skipCode = code;
    return true;
  }
  /**
   * 等待运行条件准备就绪。
   *
   * @returns 操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  ready(): boolean {
    if (this.state.initialized && !this.state.disposed) {
      return true;
    }
    this.progress(this.state.disposed ? 'DISPOSED' : 'AUTH_REQUIRED', 'error');
    return false;
  }
  /**
   * 等待配置的任务间隔。
   *
   * @returns 在操作完成后兑现的 Promise。
   */
  async delay(): Promise<void> {
    if (!this.options.taskDelayMs || this.state.disposed) {
      return;
    }
    await new Promise<void>((resolve) => {
      /**
       * 完成当前操作并交付结果。
       */
      const finish = () => {
        clearTimeout(timer);
        this.state.cleanups.delete(finish);
        resolve();
      };
      const timer = setTimeout(finish, this.options.taskDelayMs);
      this.state.cleanups.add(finish);
    });
  }
}
