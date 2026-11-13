import type { SocialStatusEvent, SocialTaskResult, StatusListener } from '../types';
import type { GFFOptions } from './types';
import { requestGFFTask } from './tabTask';

/** 同一实例的批次共用队列；排队时间不占用单项的超时。 */
export class GFFContext {
  readonly options: GFFOptions;
  readonly ownerPage = crypto.randomUUID();
  disposed = false;
  private tail: Promise<unknown> = Promise.resolve();
  private readonly listeners = new Set<StatusListener>();
  private readonly cancellations = new Set<() => void>();

  constructor(options: GFFOptions) {
    this.options = options;
  }

  async init(): Promise<boolean> {
    const { gm } = this.options;
    return !this.disposed && !!this.options.namespace && [
      gm?.getValue, gm?.setValue, gm?.deleteValue,
      gm?.addValueChangeListener, gm?.removeValueChangeListener, gm?.openInTab
    ].every((method) => {
      return typeof method === 'function';
    });
  }

  on(_event: 'status', listener: StatusListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /** 外部监听器不参与任务 Promise，避免在状态回调中重入 do 导致死锁。 */
  emit(event: SocialStatusEvent): void {
    for (const listener of this.listeners) {
      try {
        Promise.resolve(listener(event)).catch(() => {
          // UI 监听器异常不能阻断资源清理或后续工作项。
        });
      } catch {
        // 同步监听器与异步监听器使用相同的隔离规则。
      }
    }
  }

  registerCancellation(cancel: () => void): () => void {
    if (this.disposed) {
      cancel();
      return () => {};
    }
    this.cancellations.add(cancel);
    return () => {
      this.cancellations.delete(cancel);
    };
  }

  do(options: Record<string, string[] | undefined>, keys: readonly string[]): Promise<SocialTaskResult> {
    // 在调用时快照输入，后续调用者修改数组不会改变已经排队的批次。
    const entries = keys.map((key) => {
      return [key, [...new Set(options[key] ?? [])]] as const;
    });
    const batchId = crypto.randomUUID();
    const execute = async (): Promise<SocialTaskResult> => {
      const results: Record<string, Record<string, boolean>> = {};
      let success = true;
      for (const [key, links] of entries) {
        if (links.length === 0) {
          continue;
        }
        results[key] = {};
        for (const link of links) {
          let completed = false;
          if (!this.disposed && this.options.enabled?.[key] === false) {
            completed = true;
            this.emit({
              operationId: crypto.randomUUID(),
              operation: 'task.execute',
              phase: 'skipped',
              level: 'info',
              code: 'GFF_DISABLED',
              target: link,
              timestamp: Date.now(),
              details: {
                taskType: key
              }
            });
          } else if (!this.disposed) {
            completed = await requestGFFTask(this, key, link, batchId);
          }
          Object.defineProperty(results[key], link, {
            value: completed,
            enumerable: true,
            configurable: true,
            writable: true
          });
          success = completed && success;
        }
      }
      return {
        success,
        results
      };
    };
    const pending = this.tail.then(execute, execute);
    this.tail = pending.catch(() => {
      // 保持队列可用，单批失败不阻塞后续批次。
    });
    return pending;
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    for (const cancel of [...this.cancellations]) {
      cancel();
    }
    this.cancellations.clear();
    this.listeners.clear();
  }
}

export const runGFFTasks = (context: GFFContext, options: Record<string, string[] | undefined>, keys: readonly string[]): Promise<SocialTaskResult> => {
  return context.do(options, keys);
};

export default GFFContext;
