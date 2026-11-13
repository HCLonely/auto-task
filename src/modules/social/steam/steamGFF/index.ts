import { GFFContext } from '../../social/gff/context';
import type { GFFOptions, GFFStatusListener } from '../../social/gff/types';
import type { SocialTaskResult } from '../../social/types';

export { handleSteamGFFPage } from './page';

export interface SteamGFFTaskOptions {
  followLinks?: string[];
  curatorLinks?: string[];
  guideLinks?: string[];
  workshopLinks?: string[];
}

/** 原生 GFF 客户端，不依赖普通 Steam 认证或 API。 */
export class SteamGFF {
  private readonly context: GFFContext;

  constructor(options: Omit<GFFOptions, 'platform'>) {
    this.context = new GFFContext({
      ...options,
      platform: 'steam'
    });
  }

  init(): Promise<boolean> {
    return this.context.init();
  }

  on(event: 'status', listener: GFFStatusListener): () => void {
    return this.context.on(event, listener);
  }

  do(options: SteamGFFTaskOptions = {}): Promise<SocialTaskResult> {
    return this.context.do({
      ...options
    }, ['followLinks', 'curatorLinks', 'guideLinks', 'workshopLinks']);
  }

  dispose(): void {
    this.context.dispose();
  }
}

export default SteamGFF;
