import type { Context } from '../context';
import { changeArea } from '../features/region';
import type { StepStatus } from '../types';
import { encodeForm } from '../utils/html';

export async function appid2subid(ctx: Context, id: string): Promise<string | boolean> {
  return ctx.run('licenses.appid2subid', id, async (ctx): Promise<string | boolean> => {
    try {
      const stepStatus = ctx.step('gettingSubid', id);
      const {
        result, data
      } = await ctx.request({
        url: `https://store.steampowered.com/app/${id}`,
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
      if (data.responseText.includes('ds_owned_flag ds_flag') || data.responseText.includes('class="already_in_library"')) {
        stepStatus.success('owned');
        return true;
      }
      if (ctx.state.area === 'CN' && data.responseText.includes('id="error_box"')) {
        stepStatus.warning('changeAreaNotice');
        const result = await changeArea(ctx);
        if (!result || result === 'CN' || result === 'skip') {
          return false;
        }
        return await appid2subid(ctx, id);
      }
      let subid = data.responseText.match(/name="subid" value="([\d]+?)"/)?.[1];
      if (subid) {
        stepStatus.success('STEP_COMPLETED');
        return subid;
      }
      subid = data.responseText.match(/AddFreeLicense\(\s*(\d+)/)?.[1];
      if (subid) {
        stepStatus.success('STEP_COMPLETED');
        return subid;
      }
      stepStatus.error('noSubid');
      return false;
    } catch (error) {
      ctx.reportError();
      return false;
    }
  });
}

export async function getLicenses(ctx: Context): Promise<Array<number> | false> {
  return ctx.run('licenses.getLicenses', undefined, async (ctx): Promise<Array<number> | false> => {
    try {
      const stepStatus = ctx.step('gettingLicenses');
      const {
        result, data
      } = await ctx.request({
        url: `https://store.steampowered.com/dynamicstore/userdata/?t=${new Date().getTime()}`,
        method: 'GET',
        responseType: 'json'
      });
      if (result !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (data?.status !== 200) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      stepStatus.remove();
      const packages: unknown = data.response?.rgOwnedPackages;
      return Array.isArray(packages) && packages.every((id) => {
        return typeof id === 'number';
      }) ? packages : false;
    } catch (error) {
      ctx.reportError();
      return false;
    }
  });
}

export async function addLicense(ctx: Context, id: string): Promise<boolean> {
  return ctx.run('licenses.addLicense', id, async (ctx): Promise<boolean> => {
    if (ctx.state.disposed || !ctx.state.storeInitialized) {
      ctx.progress(ctx.state.disposed ? 'DISPOSED' : 'AUTH_REQUIRED', 'error');
      return false;
    }
    try {
      const [type, ids] = id.split('-');
      if (!ids || !/^[0-9]+(?:,[0-9]+)*$/.test(ids) || (type === 'appid' && ids.includes(',')) || (type !== 'appid' && type !== 'subid')) {
        return false;
      }
      if (type === 'appid') {
        const subid = await appid2subid(ctx, ids);
        if (!subid) {
          return false;
        }
        if (subid === true) {
          return true;
        }
        const stepStatus = ctx.step('addingFreeLicense', ids);
        if (!await addFreeLicense(ctx, subid)) {
          return false;
        }
        const {
          result, data
        } = await ctx.request({
          url: `https://store.steampowered.com/app/${ids}`,
          method: 'GET'
        });
        if (result !== 'Success') {
          stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
          return false;
        }
        if (data?.status !== 200) {
          stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
          return false;
        }
        if (!data.responseText.includes('ds_owned_flag ds_flag') && !data.responseText.includes('class="already_in_library"')) {
          stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
          return false;
        }
        stepStatus.success('STEP_COMPLETED');
        return true;
      }
      if (ctx.state.area === 'CN') {
        ctx.step('OPERATION_STEP').success('tryChangeAreaNotice');
        await changeArea(ctx);
      }
      const logStatusArr: Record<string, StepStatus> = {};
      const idsArr = ids.split(',');
      for (const subid of idsArr) {
        const stepStatus = ctx.step('addingFreeLicense', subid);
        if (!await addFreeLicense(ctx, subid)) {
          return false;
        }
        logStatusArr[subid] = stepStatus;
      }
      const licenses = await getLicenses(ctx);
      if (!licenses) {
        return false;
      }
      let allOwned = true;
      for (const subid of idsArr) {
        const hasLicense = licenses.includes(parseInt(subid, 10));
        if (hasLicense) {
          logStatusArr[subid].success('STEP_COMPLETED');
        } else {
          allOwned = false;
          logStatusArr[subid].error('REQUEST_OR_RESPONSE_FAILED');
        }
      }
      return allOwned;
    } catch (error) {
      ctx.reportError();
      return false;
    }
  });
}

export async function addFreeLicense(ctx: Context, id: string): Promise<boolean> {
  return ctx.run('licenses.addFreeLicense', id, async (ctx): Promise<boolean> => {
    try {
      const stepStatus = ctx.step('addingFreeLicenseSubid', id);
      const {
        result, data
      } = await ctx.request({
        url: `https://store.steampowered.com/freelicense/addfreelicense/${id}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Host: 'store.steampowered.com',
          Origin: 'https://store.steampowered.com',
          Referer: 'https://store.steampowered.com/account/licenses/'
        },
        data: encodeForm({
          ajax: true,
          sessionid: ctx.state.auth.storeSessionID
        }),
        responseType: 'text'
      });
      if (result !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (data?.status !== 200) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (ctx.state.area === 'CN' && data.responseText.includes('id="error_box"')) {
        stepStatus.warning('changeAreaNotice');
        const result = await changeArea(ctx);
        if (!result || ['CN', 'skip'].includes(result as string)) {
          return false;
        }
        return await addFreeLicense(ctx, id);
      }
      stepStatus.success('STEP_COMPLETED');
      return true;
    } catch (error) {
      ctx.reportError();
      return false;
    }
  });
}
