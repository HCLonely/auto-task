import ModuleClient, { createGMHttpClient } from '../../modules/social/reddit';
import { globalOptions } from '../globalOptions';
import { ProjectSocial } from './Social';
import { moduleNamespace, projectGM } from './moduleBridge';

class Reddit extends ProjectSocial<ModuleClient> {
  constructor() {
    super(new ModuleClient({
      http: createGMHttpClient((options) => {
        return GM_xmlhttpRequest(options);
      }),
      gm: projectGM('reddit'),
      namespace: moduleNamespace('reddit'),
      doTaskEnabled: globalOptions.doTask.reddit.reddits,
      undoTaskEnabled: globalOptions.undoTask.reddit.reddits
    }), 'Reddit');
  }
}
export default Reddit;
