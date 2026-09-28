import type { Context } from '../context';
import type { Areas } from '../types';
import { encodeForm, parseHTML } from '../utils/html';

export async function getAreaInfo(ctx: Context): Promise<Areas> {
  return ctx.run('region.getAreaInfo', undefined, async (ctx) => {
    try {
      const {
        result, data
      } = await ctx.request({
        url: 'https://store.steampowered.com/cart/',
        method: 'GET'
      });
      if (result !== 'Success' || data?.status !== 200) {
        return {};
      }
      const html = parseHTML(data.responseText);
      const config = JSON.parse(html.querySelector('[data-cart_config]')?.getAttribute('data-cart_config') || '{}');
      const user = JSON.parse(html.querySelector('[data-userinfo]')?.getAttribute('data-userinfo') || '{}');
      if (!config.rgUserCountryOptions || typeof user.country_code !== 'string') {
        return {};
      }
      const areas = Object.keys(config.rgUserCountryOptions).filter((area) => {
        return /^[A-Z]{2}$/.test(area);
      });
      ctx.state.area = user.country_code;
      return {
        currentArea: user.country_code,
        areas
      };
    } catch {
      ctx.reportError();
      return {};
    }
  });
}

/** Serialize changes with a promise queue instead of polling a mutable flag. */
export function changeArea(ctx: Context, area?: string): Promise<boolean | string> {
  const job = ctx.state.regionQueue.then(() => {
    return ctx.run('region.changeArea', area, async (ctx): Promise<boolean | string> => {
      try {
        if (!area && !ctx.autoChangeRegion) {
          ctx.progress('REGION_CHANGE_DISABLED');
          return 'skip';
        }
        if (area && !/^[A-Z]{2}$/.test(area)) {
          return false;
        }
        const {
          currentArea, areas
        } = await getAreaInfo(ctx);
        if (!currentArea || !areas) {
          return false;
        }
        if (area === currentArea || (!area && currentArea !== 'CN')) {
          return 'skip';
        }
        const target = area || areas.find((candidate) => {
          return candidate !== 'CN';
        });
        if (!target) {
          ctx.progress('NO_ALTERNATIVE_REGION', 'warning');
          return false;
        }
        // Save the original country BEFORE requesting a change, including uncertain failures.
        if (!ctx.state.oldArea) {
          ctx.state.oldArea = currentArea;
        }
        const {
          result, data
        } = await ctx.request({
          url: 'https://store.steampowered.com/country/setcountry',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: encodeForm({
            cc: target,
            sessionid: ctx.state.auth.storeSessionID
          })
        });
        if (result !== 'Success' || data?.status !== 200 || data.responseText.trim() !== 'true') {
          return false;
        }
        const updated = await getAreaInfo(ctx);
        if (updated.currentArea !== target) {
          return false;
        }
        return target;
      } catch {
        ctx.reportError();
        return false;
      }
    });
  });
  ctx.state.regionQueue = job.catch(() => {
    return undefined;
  });
  return job;
}

export async function resetArea(ctx: Context): Promise<boolean> {
  return ctx.run('region.resetArea', undefined, async (ctx) => {
    if (ctx.state.disposed || !ctx.state.storeInitialized) {
      ctx.progress(ctx.state.disposed ? 'DISPOSED' : 'AUTH_REQUIRED', 'error');
      return false;
    }
    await ctx.state.regionQueue;
    if (!ctx.state.oldArea) {
      return true;
    }
    const original = ctx.state.oldArea;
    const result = await changeArea(ctx, original);
    if (result === original || (result === 'skip' && ctx.state.area === original)) {
      ctx.state.oldArea = undefined;
      return true;
    }
    return false;
  });
}
