import type { Context } from '../context';
import { changeArea } from '../features/region';
import { encodeForm } from '../utils/html';

export async function addToWishlist(ctx: Context, gameId: string): Promise<boolean> {
  return ctx.run('wishlist.add', gameId, async (ctx): Promise<boolean> => {
    if (ctx.state.disposed || !ctx.state.storeInitialized) {
      ctx.progress(ctx.state.disposed ? 'DISPOSED' : 'AUTH_REQUIRED', 'error');
      return false;
    }
    try {
      const stepStatus = ctx.step('addingToWishlist', gameId);
      const {
        result, data
      } = await ctx.request({
        url: 'https://store.steampowered.com/api/addtowishlist',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: encodeForm({
          sessionid: ctx.state.auth.storeSessionID,
          appid: gameId
        }),
        dataType: 'json'
      });
      if (result === 'Success' && data?.status === 200 && data.response?.success === true) {
        stepStatus.success('STEP_COMPLETED');
        return true;
      }
      const {
        result: resultR, data: dataR
      } = await ctx.request({
        url: `https://store.steampowered.com/app/${gameId}`,
        method: 'GET'
      });
      if (resultR !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (dataR?.status !== 200) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (ctx.state.area === 'CN' && dataR.responseText.includes('id="error_box"')) {
        const changed = await changeArea(ctx);
        if (!changed || changed === 'CN' || changed === 'skip') {
          return false;
        }
        return await addToWishlist(ctx, gameId);
      }
      if (dataR.responseText.includes('class="queue_actions_ctn"') && dataR.responseText.includes('class="already_in_library"')) {
        stepStatus.success('STEP_COMPLETED');
        return true;
      }
      if ((dataR.responseText.includes('class="queue_actions_ctn"') &&
        dataR.responseText.includes('id="add_to_wishlist_area_success" style="display: none;')) ||
        !dataR.responseText.includes('class="queue_actions_ctn"')) {
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

export async function removeFromWishlist(ctx: Context, gameId: string): Promise<boolean> {
  return ctx.run('wishlist.remove', gameId, async (ctx): Promise<boolean> => {
    if (ctx.state.disposed || !ctx.state.storeInitialized) {
      ctx.progress(ctx.state.disposed ? 'DISPOSED' : 'AUTH_REQUIRED', 'error');
      return false;
    }
    try {
      const stepStatus = ctx.step('removingFromWishlist', gameId);
      const {
        result, data
      } = await ctx.request({
        url: 'https://store.steampowered.com/api/removefromwishlist',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: encodeForm({
          sessionid: ctx.state.auth.storeSessionID,
          appid: gameId
        }),
        dataType: 'json'
      });
      if (result === 'Success' && data?.status === 200 && data.response?.success === true) {
        stepStatus.success('STEP_COMPLETED');
        return true;
      }
      const {
        result: resultR, data: dataR
      } = await ctx.request({
        url: `https://store.steampowered.com/app/${gameId}`,
        method: 'GET'
      });
      if (resultR !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (dataR?.status !== 200) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (ctx.state.area === 'CN' && dataR.responseText.includes('id="error_box"')) {
        const result = await changeArea(ctx);
        if (!result || result === 'CN' || result === 'skip') {
          return false;
        }
        return await removeFromWishlist(ctx, gameId);
      }
      if (dataR.responseText.includes('class="queue_actions_ctn"') &&
        (dataR.responseText.includes('ds_owned_flag ds_flag') || dataR.responseText.includes('add_to_wishlist_area'))) {
        stepStatus.success('STEP_COMPLETED');
        return true;
      }
      stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
      return false;
    } catch (error) {
      ctx.reportError();
      return false;
    }
  });
}
