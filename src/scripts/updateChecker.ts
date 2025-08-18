/*
 * @Author       : HCLonely
 * @Date         : 2021-12-30 14:20:30
 * @LastEditTime : 2025-08-18 19:04:18
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/updateChecker.ts
 * @Description  : 更新检测模块，用于检查和通知脚本的新版本
 */

import httpRequest from './tools/httpRequest';
import { globalOptions } from './globalOptions';
import throwError from './tools/throwError';
import echoLog from './echoLog';
import __ from './tools/i18n';
import { debug } from './tools/debug';

/**
 * package.json 文件的接口定义
 * @interface PackageJson
 * @property {string} name - 包名称
 * @property {string} version - 版本号，格式为 x.y.z 或 x.y.z-preview
 * @property {string[]} change - 更新日志列表，包含每个版本的变更说明
 */
interface PackageJson {
  name: string;
  version: string;
  change: string[];
}

/**
 * 更新源配置
 * @constant {Record<string, string>}
 * @description 定义了可用的更新源及其对应的 URL，包括 GitHub、jsDelivr 和备用源
 */
const UPDATE_LINKS: Record<string, string> = {
  github: 'https://github.com/HCLonely/auto-task/raw/main/',
  jsdelivr: 'https://cdn.jsdelivr.net/gh/HCLonely/auto-task@main/',
  standby: 'https://auto-task.hclonely.com/'
} as const;

/**
 * 检查更新，获取指定链接的 package.json 文件
 * @param {string} updateLink - 更新链接，用于获取 package.json 文件
 * @param {boolean} auto - 是否为自动检查更新的标志，为 true 时不显示错误信息
 * @returns {Promise<PackageJson | false>} 成功返回 package.json 数据，失败返回 false
 * @throws {Error} 在请求过程中发生错误时抛出
 */
const checkUpdate = async (updateLink: string, auto: boolean): Promise<PackageJson | false> => {
  try {
    debug('开始检查更新', { updateLink, auto });
    const checkUrl = `${updateLink}package.json?time=${Date.now()}`;
    debug('构建检查URL', { checkUrl });

    const { result, statusText, status, data } = await httpRequest({
      url: checkUrl,
      responseType: 'json',
      method: 'GET',
      timeout: 30000
    });

    if (result === 'Success' && data?.response?.version) {
      debug('成功获取更新信息', { version: data.response.version });
      return data.response;
    }

    if (!auto) {
      const errorMessage = data?.response?.version ?
        `${__('checkUpdateFailed')}[${data?.statusText}(${data?.status})]` :
        `${__('checkUpdateFailed')}[${result}:${statusText}(${status})]`;
      debug('检查更新失败', { errorMessage });
      echoLog({}).error(errorMessage);
    } else {
      debug('自动检查更新失败', { result, statusText, status });
    }
    return false;
  } catch (error) {
    debug('检查更新发生错误', { error });
    throwError(error as Error, 'checkUpdate');
    return false;
  }
};

/**
 * 比较版本号，判断是否有新版本可用
 * @param {string} currentVersion - 当前版本号，格式为 x.y.z 或 x.y.z-preview
 * @param {string} remoteVersion - 远程版本号，格式为 x.y.z 或 x.y.z-preview
 * @returns {boolean} 如果远程版本号大于当前版本号，或者接受预览版本时有新的预览版本可用，返回 true
 * @throws {Error} 在版本比较过程中发生错误时抛出
 */
const hasNewVersion = (currentVersion: string, remoteVersion: string): boolean => {
  try {
    debug('开始比较版本号', { currentVersion, remoteVersion });
    const [currentRealVersion] = currentVersion.split('-');
    const [remoteRealVersion, isPreview] = remoteVersion.split('-');

    if (isPreview && !globalOptions.other.receivePreview) {
      debug('不接收预览版本', { isPreview });
      return false;
    }

    const currentVersionParts = currentRealVersion.split('.').map(Number);
    const remoteVersionParts = remoteRealVersion.split('.').map(Number);
    debug('版本号解析', { currentVersionParts, remoteVersionParts });

    for (let i = 0; i < 3; i++) {
      if (remoteVersionParts[i] > currentVersionParts[i]) {
        debug('发现新版本', { position: i, current: currentVersion, remote: remoteVersion });
        return true;
      }
      if (remoteVersionParts[i] < currentVersionParts[i]) {
        debug('远程版本较旧', { position: i, current: currentVersion, remote: remoteVersion });
        return false;
      }
    }

    debug('版本号相同');
    return false;
  } catch (error) {
    debug('比较版本号时发生错误', { error });
    throwError(error as Error, 'compareVersion');
    return false;
  }
};

/**
 * 获取更新链接
 * @param {string} updateSource - 更新源标识符（github/jsdelivr/standby）
 * @returns {string} 对应的更新链接，如果提供的更新源无效则返回 GitHub 的更新链接
 * @description 根据提供的更新源标识符返回对应的更新链接，支持不区分大小写的匹配
 */
const getUpdateLink = (updateSource: string): string => {
  debug('获取更新链接', { updateSource });
  const source = updateSource.toLowerCase();
  const link = UPDATE_LINKS[source as keyof typeof UPDATE_LINKS] || UPDATE_LINKS.github;
  debug('选择的更新链接', { source, link });
  return link;
};

/**
 * 显示更新信息
 * @param {PackageJson} packageData - 包信息，包含版本号和更新日志
 * @param {string} currentVersion - 当前版本号
 * @param {string} updateLink - 更新链接基础URL
 * @description 当检测到新版本时，在日志中显示新版本通知和更新内容列表
 */
const showUpdateInfo = (packageData: PackageJson, currentVersion: string, updateLink: string): void => {
  debug('准备显示更新信息', { currentVersion, newVersion: packageData.version });
  if (hasNewVersion(currentVersion, packageData.version)) {
    const scriptUrl = `${updateLink}dist/${GM_info.script.name}.user.js`;
    debug('发现新版本，显示更新通知', { scriptUrl });
    echoLog({
      html: `<li><font>${__('newVersionNotice', packageData.version, scriptUrl)}</font></li>`
    });

    const changeList = packageData.change?.map((change) => `<li>${change}</li>`).join('') || '';
    debug('显示更新日志', { changeListLength: packageData.change?.length });
    echoLog({
      html: `<li>${__('updateText', packageData.version)}</li><ol class="update-text">${changeList}<li>${__('updateHistory')}</li></ol>`
    });
  } else {
    debug('当前已是最新版本');
  }
};

/**
 * 检查更新并获取最新版本信息
 * @returns {Promise<void>}
 * @description 根据配置的更新源检查新版本。如果指定了有效的更新源则直接使用，
 * 否则按照 github -> jsdelivr -> standby 的顺序尝试获取更新信息。
 * 成功检测到新版本时会显示更新提示和变更日志。
 * @throws {Error} 在更新检查过程中发生错误时抛出
 */
const updateChecker = async (): Promise<void> => {
  try {
    debug('开始检查更新流程');
    const currentVersion = GM_info.script.version;
    const updateSource = globalOptions.other.autoUpdateSource;
    debug('当前配置', { currentVersion, updateSource });

    let packageData: PackageJson | false = false;

    if (['github', 'jsdelivr', 'standby'].includes(updateSource.toLowerCase())) {
      debug('使用指定的更新源', { updateSource });
      const updateLink = getUpdateLink(updateSource);
      packageData = await checkUpdate(updateLink, false);
    } else {
      debug('按优先级尝试不同的更新源');
      for (const source of ['github', 'jsdelivr', 'standby'] as const) {
        debug('尝试更新源', { source });
        packageData = await checkUpdate(UPDATE_LINKS[source], true);
        if (packageData) {
          debug('成功获取更新信息', { source });
          break;
        }
      }
    }

    if (!packageData) {
      debug('所有更新源检查失败');
      echoLog({}).error(__('checkUpdateFailed'));
      return;
    }

    showUpdateInfo(packageData, currentVersion, getUpdateLink(updateSource));
  } catch (error) {
    debug('更新检查过程发生错误', { error });
    throwError(error as Error, 'updateChecker');
  }
};

export default updateChecker;
