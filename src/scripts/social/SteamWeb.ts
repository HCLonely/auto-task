import ModuleClient, { createGMHttpClient } from '../../../modules/steam/steamWeb';
import { bindModuleStatus, moduleNamespace, projectGM } from './moduleBridge';

export default class SteamWeb extends ModuleClient {
  private readonly unsubscribe: () => void;
  constructor() {
    super({
      autoChangeRegion: true,
      http: createGMHttpClient((request) => GM_xmlhttpRequest(request)),
      gm: projectGM('steam'),
      namespace: `${moduleNamespace('steam')}:web`
    });
    this.unsubscribe = bindModuleStatus(this, 'SteamWeb');
  }
  dispose(): void { this.unsubscribe(); super.dispose(); }
}
