import type { RedditStatusEvent, StatusListener } from './types';

export class StatusEvents {
  private readonly listeners = new Set<StatusListener>();
  on(listener: StatusListener): () => void {
    this.listeners.add(listener);
    return () => {
      return this.listeners.delete(listener);
    };
  }
  emit(event: RedditStatusEvent): void {
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
      } catch { /* Observers cannot change operation results. */ }
    }
  }
  clear(): void {
    this.listeners.clear();
  }
}
