import { createTaskResult, getRealParams, setTaskResult } from './results';
import type { InitResult, SocialTaskDetailResult, SocialTaskResult, StatusListener } from './types';

/** Dependency-free replacement for the original Social base class. */
export abstract class Social<Params = Record<string, unknown>, Init = void, Tasks extends object = Record<string, string[]>> {
  abstract get tasks(): Tasks;
  abstract init(options?: Init): Promise<InitResult>;
  abstract do(options: Params): Promise<SocialTaskResult>;
  abstract undo(options: Params): Promise<SocialTaskResult>;
  abstract on(event: 'status', listener: StatusListener): () => void;
  abstract dispose(): void;

  protected createTaskResult(): SocialTaskDetailResult {
    return createTaskResult();
  }
  protected setTaskResult(result: SocialTaskDetailResult, type: string, value: string, success: boolean): void {
    setTaskResult(result, type, value, success);
  }
  protected getRealParams(name: keyof Tasks, links: string[], doTask: boolean, link2param: (link: string) => string | undefined): string[] {
    const recorded = this.tasks[name];
    return getRealParams(links, doTask, Array.isArray(recorded) ? recorded : [], link2param);
  }
}
export default Social;
