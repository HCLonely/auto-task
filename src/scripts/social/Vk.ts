import ModuleClient, { createGMHttpClient } from '../../modules/social/vk';
import { globalOptions } from '../globalOptions';
import { ProjectSocial } from './Social';
import { moduleNamespace, projectGM } from './moduleBridge';

class Vk extends ProjectSocial<ModuleClient> {
  constructor() {
    super(new ModuleClient({
      http: createGMHttpClient((options) => {
        return GM_xmlhttpRequest(options);
      }),
      gm: projectGM('vk'),
      namespace: moduleNamespace('vk'),
      doTaskEnabled: globalOptions.doTask.vk.names,
      undoTaskEnabled: globalOptions.undoTask.vk.names
    }), 'Vk');
  }
}
export default Vk;
