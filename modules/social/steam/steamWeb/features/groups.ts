import { setCache } from '../cache';
import type { Context } from '../context';
import { encodeForm, parseHTML } from '../utils/html';

export async function joinGroup(ctx: Context, groupName: string): Promise<boolean> {
  return ctx.run('groups.joinGroup', groupName, async (ctx): Promise<boolean> => {
    if (ctx.state.disposed || !ctx.state.communityInitialized) {
      ctx.progress(ctx.state.disposed ? 'DISPOSED' : 'AUTH_REQUIRED', 'error');
      return false;
    }
    try {
      const stepStatus = ctx.step('joiningSteamGroup', groupName);
      const { result, data } = await ctx.request({
        url: `https://steamcommunity.com/groups/${groupName}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        data: encodeForm({ action: 'join', sessionID: ctx.state.auth.communitySessionID })
      });
      if (result !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (data?.status !== 200 || data.responseText.includes('grouppage_join_area')) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      stepStatus.success('STEP_COMPLETED');
      return true;
    }
    catch (error) {
      ctx.reportError();
      return false;
    }
  });
}

export async function leaveGroup(ctx: Context, groupName: string): Promise<boolean> {
  return ctx.run('groups.leaveGroup', groupName, async (ctx): Promise<boolean> => {
    if (ctx.state.disposed || !ctx.state.communityInitialized) {
      ctx.progress(ctx.state.disposed ? 'DISPOSED' : 'AUTH_REQUIRED', 'error');
      return false;
    }
    try {
      const groupId = await getGroupId(ctx, groupName);
      if (!groupId)
        return false;
      const stepStatus = ctx.step('leavingSteamGroup', groupName);
      const { result, data } = await ctx.request({
        url: `https://steamcommunity.com/profiles/${ctx.state.auth.steam64Id}/home_process`,
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        data: encodeForm({ sessionID: ctx.state.auth.communitySessionID, action: 'leaveGroup', groupId })
      });
      if (result !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (data?.status !== 200 || !data.finalUrl.includes('groups')) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      const hasGroupLink = parseHTML(data.responseText.replace(/<img.*?>/g, '').toLowerCase())
        .querySelectorAll(`a[href='https://steamcommunity.com/groups/${groupName.toLowerCase()}']`).length > 0;
      if (hasGroupLink) {
        return false;
      }
      stepStatus.success('STEP_COMPLETED');
      return true;
    }
    catch (error) {
      ctx.reportError();
      return false;
    }
  });
}

export async function getGroupId(ctx: Context, groupName: string): Promise<false | string> {
  return ctx.run('groups.getGroupId', groupName, async (ctx): Promise<false | string> => {
    try {
      const stepStatus = ctx.step('gettingSteamGroupId', groupName);
      const cachedGroupId = ctx.state.cache.group[groupName];
      if (cachedGroupId) {
        stepStatus.success('STEP_COMPLETED');
        return cachedGroupId;
      }
      const { result, data } = await ctx.request({
        url: `https://steamcommunity.com/groups/${groupName}`,
        method: 'GET',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
      });
      if (result !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (data?.status !== 200) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      const matchedGroupId = data.responseText.match(/OpenGroupChat\( '([0-9]+)'/)?.[1];
      if (!matchedGroupId) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      await setCache(ctx, 'group', groupName, matchedGroupId);
      stepStatus.success('STEP_COMPLETED');
      return matchedGroupId;
    }
    catch (error) {
      ctx.reportError();
      return false;
    }
  });
}
