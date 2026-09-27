import ModuleClient, { createGMHttpClient } from '../../../modules/social/twitch';
import { globalOptions } from '../globalOptions';
import { ProjectSocial } from './Social';
import { moduleNamespace, projectGM } from './moduleBridge';

class Twitch extends ProjectSocial<ModuleClient> {
  constructor() {
    super(new ModuleClient({
      http: createGMHttpClient((options) => GM_xmlhttpRequest(options)),
      gm: projectGM('twitch'),
      namespace: moduleNamespace('twitch'),
      followEnabled: globalOptions.doTask.twitch.channels, unfollowEnabled: globalOptions.undoTask.twitch.channels
    }), 'Twitch');
  }
}
export default Twitch;
