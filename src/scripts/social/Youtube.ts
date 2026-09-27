import ModuleClient, { createGMHttpClient } from '../../../modules/youtube';
import { globalOptions } from '../globalOptions';
import { ProjectSocial } from './Social';
import { moduleNamespace, projectGM } from './moduleBridge';

class Youtube extends ProjectSocial<ModuleClient> {
  constructor() {
    super(new ModuleClient({
      http: createGMHttpClient((options) => GM_xmlhttpRequest(options)),
      gm: projectGM('youtube'),
      namespace: moduleNamespace('youtube'),
      verifyChannel: globalOptions.other.youtubeVerifyChannel, doTask: globalOptions.doTask.youtube, undoTask: globalOptions.undoTask.youtube
    }), 'Youtube');
  }
}
export default Youtube;
export { Youtube };
export const getInfo = async (link: string, type: string): ReturnType<ModuleClient['getInfo']> => {
  if (type !== 'channel' && type !== 'likeVideo') return {};
  const youtube = new Youtube();
  try { return await youtube.client.getInfo(link, type); } finally { youtube.dispose(); }
};
