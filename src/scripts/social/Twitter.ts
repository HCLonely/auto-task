import ModuleClient, { createGMHttpClient } from '../../../modules/twitter';
import { globalOptions } from '../globalOptions';
import { ProjectSocial } from './Social';
import { moduleNamespace, projectGM } from './moduleBridge';

class Twitter extends ProjectSocial<ModuleClient> {
  constructor() {
    super(new ModuleClient({
      http: createGMHttpClient((options) => GM_xmlhttpRequest(options)),
      gm: { ...projectGM('twitter'), listCookies: (details, callback) => GM_cookie.list(details, callback) },
      namespace: moduleNamespace('twitter'),
      verifyId: globalOptions.other.twitterVerifyId, doTask: globalOptions.doTask.twitter, undoTask: globalOptions.undoTask.twitter
    }), 'Twitter');
  }
  userName2id(name: string): Promise<string | false> { return this.client.userName2id(name); }
}
export default Twitter;
