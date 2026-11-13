import { handleGFFPage } from '../../social/gff/page';
import type { GMAPI } from '../../social/gff/types';
import { finalizeSteamGFF, prepareSteamGFF } from './features';

/** 只认领带有有效请求标记的 Steam 页面，普通访问不会执行任何操作。 */
export const handleSteamGFFPage = (options: { gm?: GMAPI; namespace?: string } = {}): Promise<boolean> => {
  return handleGFFPage({
    ...options,
    namespace: options.namespace ?? 'steamGFF',
    platform: 'steam',
    prepare: prepareSteamGFF,
    finalize: finalizeSteamGFF
  });
};
