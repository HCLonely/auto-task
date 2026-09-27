import ModuleClient, { createGMHttpClient } from '../../../modules/social/steam';
import { globalOptions } from '../globalOptions';
import { ProjectSocial } from './Social';
import { moduleNamespace, projectGM } from './moduleBridge';

class Steam extends ProjectSocial<ModuleClient> {
  constructor() {
    super(new ModuleClient({
      http: createGMHttpClient((options) => GM_xmlhttpRequest(options)),
      gm: projectGM('steam'),
      namespace: moduleNamespace('steam'),
      ASF: globalOptions.ASF, doTask: globalOptions.doTask.steam, undoTask: globalOptions.undoTask.steam, autoChangeRegion: true
    }), 'Steam');
  }
  getCuratorId(path: string, name: string): Promise<string | false> { return this.client.getCuratorId(path, name); }
}
export default Steam;
