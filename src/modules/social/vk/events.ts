import type { StatusListener, VkStatusEvent } from './types';

/** Instance-local subscriptions. Observers never change an operation's result. */
export class StatusEvents {
  private readonly listeners = new Set<StatusListener>();

  on(listener: StatusListener): () => void {
    this.listeners.add(listener);
    return () => {
      return this.listeners.delete(listener);
    };
  }

  emit(event: VkStatusEvent): void {
    const snapshot = Object.freeze({
      ...event,
      details: event.details && Object.freeze({
        ...event.details
      })
    });
    for (const listener of [...this.listeners]) {
      try {
        void Promise.resolve(listener(snapshot)).catch(() => {
          return undefined;
        });
      } catch { /* A synchronous observer failure must not interrupt VK requests. */ }
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}
