import type { Context } from '../context';
import type { AnnouncementParams } from '../types';
import { encodeForm } from '../utils/html';

export async function getAnnouncementParams(ctx: Context, appId: string, viewId: string): Promise<AnnouncementParams> {
  return ctx.run('announcement.getAnnouncementParams', appId, async (ctx): Promise<AnnouncementParams> => {
    try {
      const stepStatus = ctx.step('gettingAnnouncementParams', appId);
      const {
        result, data
      } = await ctx.request({
        url: `https://store.steampowered.com/events/ajaxgetpartnerevent?appid=${appId}&announcement_gid=${viewId}&lang_list=6_0&last_modified_time=0&origin=https:%2F%2Fstore.steampowered.com&for_edit=false`,
        method: 'GET',
        responseType: 'json',
        headers: {
          Host: 'store.steampowered.com',
          Referer: `https://store.steampowered.com/news/app/${appId}/view/${viewId}`
        }
      });
      if (result !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return {};
      }
      if (data?.status !== 200 || data?.response?.success !== 1) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return {};
      }
      const {
        clanid, gid
      } = data.response.event?.announcement_body || {};
      if (!clanid) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return {};
      }
      stepStatus.success('STEP_COMPLETED');
      return {
        clanId: clanid,
        gid
      };
    } catch (error) {
      ctx.reportError();
      return {};
    }
  });
}

export async function likeAnnouncement(ctx: Context, id: string): Promise<boolean> {
  return ctx.run('announcement.likeAnnouncement', id, async (ctx): Promise<boolean> => {
    if (ctx.state.disposed || !ctx.state.storeInitialized) {
      ctx.progress(ctx.state.disposed ? 'DISPOSED' : 'AUTH_REQUIRED', 'error');
      return false;
    }
    try {
      const [appId, viewId] = id.split('/');
      if (!(appId && viewId)) {
        ctx.step('OPERATION_STEP').error('missParams');
        return false;
      }
      const {
        clanId, gid
      } = await getAnnouncementParams(ctx, appId, viewId);
      if (!clanId) {
        return false;
      }
      const stepStatus = ctx.step('likingAnnouncement', appId);
      const {
        result, data
      } = await ctx.request({
        url: `https://store.steampowered.com/updated/ajaxrateupdate/${gid || viewId}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Host: 'store.steampowered.com',
          Origin: 'https://store.steampowered.com',
          Referer: `https://store.steampowered.com/news/app/${appId}/view/${viewId}`
        },
        data: encodeForm({
          sessionid: ctx.state.auth.storeSessionID,
          voteup: 1,
          clanid: clanId,
          ajax: 1
        }),
        dataType: 'json'
      });
      if (result !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (data?.status !== 200 || data.response.success !== 1) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      stepStatus.success('STEP_COMPLETED');
      return true;
    } catch (error) {
      ctx.reportError();
      return false;
    }
  });
}
