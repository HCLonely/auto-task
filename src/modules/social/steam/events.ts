import type { SteamEvent, SteamListener } from './types';

export class SteamEvents {
  private readonly listeners = new Set<SteamListener>();
  on(listener: SteamListener): () => void {
    this.listeners.add(listener);
    return () => {
      return this.listeners.delete(listener);
    };
  }
  emit(event: SteamEvent): void {
    const value = Object.freeze({
      ...event,
      details: event.details && Object.freeze({
        ...event.details
      })
    });
    for (const listener of [...this.listeners]) {
      try {
        void Promise.resolve(listener(value)).catch(() => {
          return undefined;
        });
      } catch { /* Observers are isolated. */ }
    }
  }
  clear(): void {
    this.listeners.clear();
  }
}
