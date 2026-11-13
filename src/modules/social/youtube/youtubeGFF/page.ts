import { handleGFFPage } from '../../social/gff/page';
import type { GMAPI } from '../../social/gff/types';
import { finalizeYoutubeGFF, prepareYoutubeGFF } from './features';

export const handleYoutubeGFFPage = (options: { gm?: GMAPI; namespace?: string } = {}): Promise<boolean> => {
  return handleGFFPage({
    ...options,
    namespace: options.namespace ?? 'youtubeGFF',
    platform: 'youtube',
    prepare: prepareYoutubeGFF,
    finalize: finalizeYoutubeGFF
  });
};
