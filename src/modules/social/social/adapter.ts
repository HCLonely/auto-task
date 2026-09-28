import { Social } from './Social';
import type { InitOptions, InitResult, SocialModule, SocialTaskResult, StatusListener, TaskOptions } from './types';

/** Wrap an existing independent module without changing its native API or storage. */
export class SocialAdapter<C extends SocialModule> extends Social<TaskOptions<C>, InitOptions<C>, C['tasks']> {
  constructor(readonly client: C) {
    super();
  }
  get tasks(): C['tasks'] {
    return this.client.tasks;
  }
  init(options?: InitOptions<C>): Promise<InitResult> {
    const init = this.client.init as (options?: InitOptions<C>) => Promise<InitResult>;
    return init.call(this.client, options);
  }
  do(options: TaskOptions<C>): Promise<SocialTaskResult> {
    const execute = this.client.do as (options: TaskOptions<C>) => Promise<SocialTaskResult>;
    return execute.call(this.client, options);
  }
  undo(options: TaskOptions<C>): Promise<SocialTaskResult> {
    const execute = this.client.undo as (options: TaskOptions<C>) => Promise<SocialTaskResult>;
    return execute.call(this.client, options);
  }
  on(event: 'status', listener: StatusListener): () => void {
    return this.client.on(event, listener);
  }
  dispose(): void {
    this.client.dispose();
  }
}
