import ModuleClient, { createGMHttpClient } from '../../../modules/social/steam/steamASF';
import { bindModuleStatus, moduleNamespace, projectGM } from './moduleBridge';

export default class SteamASF extends ModuleClient {
  private readonly unsubscribe: () => void;
  constructor(options: { AsfIpcUrl: string; AsfIpcPassword: string; AsfBotname: string; steamWebApiKey: string }) {
    super({
      ...options,
      http: createGMHttpClient((request) => GM_xmlhttpRequest(request)),
      gm: projectGM('steam'),
      namespace: `${moduleNamespace('steam')}:asf`
    });
    this.unsubscribe = bindModuleStatus(this, 'SteamASF');
  }
  dispose(): void { this.unsubscribe(); super.dispose(); }
}
