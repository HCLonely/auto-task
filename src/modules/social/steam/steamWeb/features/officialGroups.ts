import { setCache } from '../cache';
import type { Context } from '../context';
import { encodeForm } from '../utils/html';

export async function joinOfficialGroup(ctx: Context, gameId: string): Promise<boolean> {
  return ctx.run('officialGroups.joinOfficialGroup', gameId, async (ctx): Promise<boolean> => {
    if (ctx.state.disposed || !ctx.state.communityInitialized) {
      ctx.progress(ctx.state.disposed ? 'DISPOSED' : 'AUTH_REQUIRED', 'error');
      return false;
    }
    try {
      const stepStatus = ctx.step('joiningSteamOfficialGroup', gameId);
      const {
        result, data
      } = await ctx.request({
        url: `https://steamcommunity.com/games/${gameId}?action=join&sessionID=${ctx.state.auth.communitySessionID}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      });
      if (result !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (data?.status !== 200 || data.responseText.includes('id="publicGroupJoin"')) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      const groupId = data.responseText.match(/steam:\/\/friends\/joinchat\/([0-9]+)/)?.[1];
      if (groupId) {
        await setCache(ctx, 'officialGroup', gameId, groupId);
      }
      stepStatus.success('STEP_COMPLETED');
      return true;
    } catch (error) {
      ctx.reportError();
      return false;
    }
  });
}

export async function leaveOfficialGroup(ctx: Context, gameId: string): Promise<boolean> {
  return ctx.run('officialGroups.leaveOfficialGroup', gameId, async (ctx): Promise<boolean> => {
    if (ctx.state.disposed || !ctx.state.communityInitialized) {
      ctx.progress(ctx.state.disposed ? 'DISPOSED' : 'AUTH_REQUIRED', 'error');
      return false;
    }
    try {
      const groupId = await getOfficialGroupId(ctx, gameId);
      if (!groupId) {
        return false;
      }
      const stepStatus = ctx.step('leavingSteamOfficialGroup', gameId);
      const {
        result, data
      } = await ctx.request({
        url: `https://steamcommunity.com/profiles/${ctx.state.auth.steam64Id}/home_process`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: encodeForm({
          sessionID: ctx.state.auth.communitySessionID,
          action: 'leaveGroup',
          groupId
        })
      });
      if (result !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (data?.status !== 200) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      const {
        result: resultR, data: dataR
      } = await ctx.request({
        url: `https://steamcommunity.com/games/${gameId}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      });
      if (resultR !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (dataR?.status !== 200 || !dataR.responseText.includes('id="publicGroupJoin"')) {
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

export async function getOfficialGroupId(ctx: Context, gameId: string): Promise<false | string> {
  return ctx.run('officialGroups.getOfficialGroupId', gameId, async (ctx): Promise<false | string> => {
    try {
      const stepStatus = ctx.step('gettingSteamOfficialGroupId', gameId);
      const cachedGroupId = ctx.state.cache.officialGroup[gameId];
      if (cachedGroupId) {
        stepStatus.success('STEP_COMPLETED');
        return cachedGroupId;
      }
      const {
        result, data
      } = await ctx.request({
        url: `https://steamcommunity.com/games/${gameId}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      });
      if (result !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (data?.status !== 200) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      const matchedGroupId = data.responseText.match(/steam:\/\/friends\/joinchat\/([0-9]+)/)?.[1];
      if (!matchedGroupId) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      await setCache(ctx, 'officialGroup', gameId, matchedGroupId);
      stepStatus.success('STEP_COMPLETED');
      return matchedGroupId;
    } catch (error) {
      ctx.reportError();
      return false;
    }
  });
}
