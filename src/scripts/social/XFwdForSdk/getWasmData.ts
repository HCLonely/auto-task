/*
 * @Author       : HCLonely
 * @Date         : 2025-06-11 16:40:24
 * @LastEditTime : 2025-09-18 11:26:43
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/social/XFwdForSdk/getWasmData.ts
 * @Description  : 获取 FwdForSdk 的 wasm 数据
 */

import { axiosGM } from '../XTID/GM2axios';
const getFwdForSdkUrl = async () => {
  const rawHtml = await axiosGM({
    url: 'https://x.com',
    method: 'GET'
  });
  return [...rawHtml.data.matchAll(/"(loader\.FwdForSdk)":"([^"]+?)"/g)];
};
const fwdForSdkExpoter = async (url: string) => {
  const { data } = await axiosGM.get(url);
  const regex = /Uint8Array\(\w\)\.set\(\[(.*?)\]\)/;
  if (!regex.test(data)) {
    return false;
  }
  const json = `[${data.match(regex)?.[1]}]`;
  const obj = JSON.parse(json);
  // GM_setValue(url, { data });
  return new Uint8Array(obj);
};
const getWasmData = async () => {
  const fwdForSdkUrl = await getFwdForSdkUrl();
  for (const url of fwdForSdkUrl) {
    const sdkData = await fwdForSdkExpoter(`https://abs.twimg.com/responsive-web/client-web/${url[1]}.${url[2]}a.js`);
    if (sdkData) {
      return sdkData;
    }
  }
  return false;
};

export { getWasmData };
