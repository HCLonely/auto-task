import { GFFContext } from '../../social/gff/context';
import type { GFFOptions, GFFStatusListener } from '../../social/gff/types';
import type { SocialTaskResult } from '../../social/types';

export { handleYoutubeGFFPage } from './page';

export interface YoutubeGFFTaskOptions {
  channelLinks?: string[];
  videoLinks?: string[];
}

/** 原生 GFF 客户端，不执行普通 YouTube 认证或验证订阅。 */
export class YoutubeGFF {
  private readonly context: GFFContext;

  constructor(options: Omit<GFFOptions, 'platform'>) {
    this.context = new GFFContext({
      ...options,
      platform: 'youtube'
    });
  }

  init(): Promise<boolean> {
    return this.context.init();
  }

  on(event: 'status', listener: GFFStatusListener): () => void {
    return this.context.on(event, listener);
  }

  do(options: YoutubeGFFTaskOptions = {}): Promise<SocialTaskResult> {
    return this.context.do({
      ...options
    }, ['channelLinks', 'videoLinks']);
  }

  dispose(): void {
    this.context.dispose();
  }
}

export default YoutubeGFF;
