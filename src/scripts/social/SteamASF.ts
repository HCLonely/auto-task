/*
 * @Author       : HCLonely
 * @Date         : 2021-10-04 16:07:55
 * @LastEditTime : 2025-08-18 19:09:02
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/social/SteamASF.ts
 * @Description  : steam ASF相关功能
 */

import echoLog from '../echoLog';
import throwError from '../tools/throwError';
import httpRequest from '../tools/httpRequest';
import __ from '../tools/i18n';
import { debug } from '../tools/debug';

/**
 * SteamASF类提供与Steam ASF相关的功能。
 *
 * @class SteamASF
 * @description
 * 该类包含多个方法，用于与Steam ASF进行交互，包括初始化、加入/退出组、添加/移除愿望单游戏、关注/取关游戏和鉴赏家等操作。
 *
 * @property {httpRequestOptions} #asfOptions - ASF请求的选项。
 * @property {string} #botName - 机器人名称。
 * @property {Object<string, string>} #groupInfo - 存储Steam组名与ID的对应关系。
 *
 * @method init - 初始化ASF。
 * @method joinGroup - 加入指定的Steam组。
 * @method leaveGroup - 退出指定的Steam组。
 * @method #getGroupId - 获取Steam组名与ID的对应关系。
 * @method addToWishlist - 将指定的游戏添加到Steam的愿望单。
 * @method removeFromWishlist - 从Steam愿望单中移除指定的游戏。
 * @method toggleFollowGame - 关注或取关指定的Steam游戏。
 * @method toggleCurator - 关注或取关指定的Steam鉴赏家/开发商/发行商。
 * @method addLicense - 添加指定的Steam许可证。
 * @method requestPlayTestAccess - 请求访问指定Steam游戏的试玩权限。
 * @method playGames - 请求指定Steam游戏的游玩时间。
 * @method stopPlayGames - 停止指定Steam游戏的游玩时间。
 */
class SteamASF {
  #asfOptions!: httpRequestOptions;
  #botName = 'asf';
  #groupInfo!: {
    [name: string]: string
  };
  #steamWebApiKey: string | undefined;
  #steamId: string | undefined;

  constructor({ AsfIpcUrl, AsfIpcPassword, AsfBotname, steamWebApiKey }: { AsfIpcUrl: string, AsfIpcPassword: string, AsfBotname: string, steamWebApiKey: string }) {
    debug('初始化SteamASF实例', { AsfIpcUrl, AsfBotname });
    const asfCommandsUrl = new URL('/Api/Command/', AsfIpcUrl);
    this.#asfOptions = {
      url: asfCommandsUrl.href,
      method: 'POST',
      responseType: 'json',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Host: asfCommandsUrl.host,
        Origin: asfCommandsUrl.origin,
        Referer: asfCommandsUrl.href,
        Authentication: AsfIpcPassword
      }
    };
    if (AsfBotname) {
      this.#botName = AsfBotname;
    }
    if (steamWebApiKey) {
      this.#steamWebApiKey = steamWebApiKey;
    }
    debug('SteamASF实例初始化完成', { botName: this.#botName });
  }

  /**
   * 初始化ASF。
   *
   * @async
   * @function init
   * @returns {Promise<boolean>} - 返回一个Promise，表示初始化的结果。
   *                              - true: 初始化成功
   *                              - false: 初始化失败
   *
   * @description
   * 该方法构建ASF命令的URL，并设置请求选项，包括请求头和数据。
   * 发送一个POST请求以获取ASF的状态信息。
   * 如果请求成功且返回结果为'Success'，则进一步检查响应数据。
   * 如果响应数据表明成功，则返回true；否则，记录错误信息并返回false。
   * 如果在请求过程中发生错误，将抛出错误并返回false。
   */
  async init(): Promise<boolean> {
    try {
      debug('开始初始化ASF');
      const logStatus = echoLog({ text: __('initingASF'), before: '[ASF]' });
      const { result, statusText, status, data } = await httpRequest({
        ...this.#asfOptions,
        data: '{"Command":"!stats"}'
      });

      if (result !== 'Success') {
        debug('ASF初始化请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.response?.Success === true && data.response.Message === 'OK' && data.response.Result) {
        debug('ASF初始化成功');
        logStatus.success();
        return true;
      }

      if (data?.response?.Result || data?.response?.Message) {
        debug('ASF初始化失败', { result: data?.response?.Result, message: data?.response?.Message });
        logStatus.error(data?.response?.Result || data.response.Message);
        return false;
      }

      debug('ASF初始化失败', { statusText: data?.statusText, status: data?.status });
      logStatus.error(`Error:${data?.statusText}(${data?.status})`);
      return false;
    } catch (error) {
      debug('ASF初始化发生错误', { error });
      throwError(error as Error, 'SteamASF.init');
      return false;
    }
  }

  /**
   * 加入指定的Steam组。
   *
   * @async
   * @function joinGroup
   * @param {string} groupName - 要加入的Steam组的名称。
   * @returns {Promise<boolean>} - 返回一个Promise，表示加入操作的结果。
   *                              - true: 加入成功
   *                              - false: 加入失败
   *
   * @description
   * 该方法通过发送HTTP请求来加入指定的Steam组。
   * 如果请求成功且返回结果为'Success'，则进一步检查响应数据。
   * 如果响应状态为200，并且结果包含已加入或申请的状态，则返回true。
   * 如果请求失败或返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在请求过程中发生错误，将抛出错误并返回false。
   */
  async joinGroup(groupName: string): Promise<boolean> {
    try {
      debug('开始加入Steam组', { groupName });
      const logStatus = echoLog({ type: 'joiningSteamGroup', text: groupName, before: '[ASF]' });
      const { result, statusText, status, data } = await httpRequest({
        ...this.#asfOptions,
        data: JSON.stringify({ Command: `!JOINGROUP ${this.#botName} ${groupName}` })
      });

      if (result !== 'Success') {
        debug('加入Steam组请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status === 200 &&
        ['已加入', '已申请', 'Joined', 'Applied', 'Присоединился', 'costs'].find((text) => (data.response?.Result?.includes(text)))
      ) {
        debug('成功加入Steam组', { groupName });
        logStatus.success();
        return true;
      }

      debug('加入Steam组失败', { result: data?.response?.Result, message: data?.response?.Message });
      logStatus.error(`Error:${data?.response?.Result || data?.response?.Message || data?.statusText}(${data?.status})`);
      return false;
    } catch (error) {
      debug('加入Steam组时发生错误', { error, groupName });
      throwError(error as Error, 'SteamASF.joinGroup');
      return false;
    }
  }
  joinOfficialGroup = this.joinGroup;
  leaveOfficialGroup = this.leaveGroup;

  /**
   * 退出指定的Steam组。
   *
   * @async
   * @function leaveGroup
   * @param {string} groupName - 要退出的Steam组名。
   * @returns {Promise<boolean>} - 返回一个Promise，表示退出操作的结果。
   *                              - true: 退出成功
   *                              - false: 退出失败
   *
   * @description
   * 该方法首先检查当前的组信息，如果未获取到组信息，则调用`#getGroupId`方法尝试获取。
   * 然后根据组名获取对应的组ID。如果组ID不存在，则返回false。
   * 发送HTTP请求以执行退出组的命令。如果请求成功且返回结果为'Success'，
   * 则进一步检查响应数据的状态。如果状态为200且结果包含成功信息，则返回true。
   * 如果请求失败或返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在请求过程中发生错误，将抛出错误并返回false。
   */
  async leaveGroup(groupName: string): Promise<boolean> {
    try {
      debug('开始退出Steam组', { groupName });
      if (!this.#groupInfo) {
        debug('未找到组信息，尝试获取组ID');
        if (!await this.#getGroupId()) {
          return false;
        }
      }
      const groupId = await this.#groupInfo[groupName];
      if (!groupId) {
        debug('未找到组ID', { groupName });
        return false;
      }

      const logStatus = echoLog({ type: 'leavingSteamGroup', text: groupName, before: '[ASF]' });
      const { result, statusText, status, data } = await httpRequest({
        ...this.#asfOptions,
        data: JSON.stringify({ Command: `!LEAVEGROUP ${this.#botName} ${groupId}` })
      });

      if (result !== 'Success') {
        debug('退出Steam组请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status === 200 &&
        ['成功', 'Success', 'Успех'].find((text) => (data.response?.Result?.includes(text)))
      ) {
        debug('成功退出Steam组', { groupName });
        logStatus.success();
        return true;
      }

      debug('退出Steam组失败', { result: data?.response?.Result, message: data?.response?.Message });
      logStatus.error(`Error:${data?.response?.Result || data?.response?.Message || data?.statusText}(${data?.status})`);
      return false;
    } catch (error) {
      debug('退出Steam组时发生错误', { error, groupName });
      throwError(error as Error, 'SteamASF.leaveGroup');
      return false;
    }
  }

  /**
   * @internal
   * @async
   * @function #getGroupId
   * @returns {Promise<boolean>} - 返回一个Promise，表示获取组ID的结果。
   *                               - true: 成功
   *                               - false: 失败
   *
   * @description
   * 获取Steam组名与ID的对应关系，用于退组操作。
   * 该方法发送一个HTTP请求以获取当前机器人的组列表。
   * 如果请求成功且返回的结果包含有效的组信息，则将组名和ID存储在`#groupInfo`中。
   * 如果请求失败或返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在请求过程中发生错误，将抛出错误并返回false。
   */
  async #getGroupId(): Promise<boolean> {
    try {
      debug('开始获取Steam组ID列表');
      const logStatus = echoLog({ type: 'gettingSteamGroupId', text: 'All', before: '[ASF]' });
      const { result, statusText, status, data } = await httpRequest({
        ...this.#asfOptions,
        data: JSON.stringify({ Command: `!GROUPLIST ${this.#botName}` })
      });

      if (result !== 'Success') {
        debug('获取Steam组ID列表请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status === 200 && data.response?.Result?.includes('|')) {
        this.#groupInfo = Object.fromEntries(data.response.Result.split('\n').map((line: string) => {
          const [, name, id] = line.trim().split('|');
          if (name && id) {
            return [name, id];
          }
          return null;
        })
          .filter((ele: Array<string> | null) => ele) as Array<Array<string>>);
        debug('成功获取Steam组ID列表', { groupCount: Object.keys(this.#groupInfo).length });
        logStatus.success();
        return true;
      }

      debug('获取Steam组ID列表失败', { result: data?.response?.Result, message: data?.response?.Message });
      logStatus.error(`Error:${data?.response?.Result || data?.response?.Message || data?.statusText}(${data?.status})`);
      return false;
    } catch (error) {
      debug('获取Steam组ID列表时发生错误', { error });
      throwError(error as Error, 'SteamASF.getGroupID');
      return false;
    }
  }

  /**
   * 将指定的游戏添加到Steam的愿望单。
   *
   * @async
   * @function addToWishlist
   * @param {string} gameId - Steam游戏的AppId。
   * @returns {Promise<boolean>} - 返回一个Promise，表示添加操作的结果。
   *                              - true: 添加成功
   *                              - false: 添加失败
   *
   * @description
   * 该方法首先检查游戏是否已在愿望单中，如果是则直接返回成功。
   * 否则通过发送HTTP请求将指定的游戏添加到Steam的愿望单。
   * 如果请求成功且返回结果为'Success'，并且响应状态为200且包含成功信息，则返回true。
   * 如果请求失败或返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在请求过程中发生错误，将抛出错误并返回false。
   */
  async addToWishlist(gameId: string): Promise<boolean> {
    try {
      debug('开始添加游戏到愿望单', { gameId });
      const logStatus = echoLog({ type: 'addingToWishlist', text: gameId, before: '[ASF]' });
      const gameStatus = await this.#checkGame(gameId);
      if (gameStatus.wishlist === true) {
        debug('游戏已在愿望单中', { gameId });
        logStatus.success();
        return true;
      }

      const { result, statusText, status, data } = await httpRequest({
        ...this.#asfOptions,
        data: JSON.stringify({ Command: `!ADDWISHLIST ${this.#botName} ${gameId}` })
      });
      if (result !== 'Success') {
        debug('添加游戏到愿望单请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }
      if (data?.status === 200 &&
        ['成功', 'Success', 'Успех'].find((text) => (data.response?.Result?.includes(text)))
      ) {
        debug('成功添加游戏到愿望单', { gameId });
        logStatus.success();
        return true;
      }
      debug('添加游戏到愿望单失败', { result: data?.response?.Result, message: data?.response?.Message });
      logStatus.error(`Error:${data?.response?.Result || data?.response?.Message || data?.statusText}(${data?.status})`);
      return false;
    } catch (error) {
      debug('添加游戏到愿望单时发生错误', { error, gameId });
      throwError(error as Error, 'SteamASF.addToWishlist');
      return false;
    }
  }

  /**
   * 从Steam愿望单中移除指定的游戏。
   *
   * @async
   * @function removeFromWishlist
   * @param {string} gameId - Steam游戏的AppId。
   * @returns {Promise<boolean>} - 返回一个Promise，表示移除操作的结果。
   *                              - true: 移除成功
   *                              - false: 移除失败
   *
   * @description
   * 该方法首先检查游戏是否已在愿望单中，如果不在则直接返回成功。
   * 否则通过发送HTTP请求将指定的游戏从Steam的愿望单中移除。
   * 如果请求成功且返回结果为'Success'，并且响应状态为200且包含成功信息，则返回true。
   * 如果请求失败或返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在请求过程中发生错误，将抛出错误并返回false。
   */
  async removeFromWishlist(gameId: string): Promise<boolean> {
    try {
      debug('开始从愿望单移除游戏', { gameId });
      const logStatus = echoLog({ type: 'removingFromWishlist', text: gameId, before: '[ASF]' });
      const gameStatus = await this.#checkGame(gameId);
      if (gameStatus.wishlist === false) {
        debug('游戏已不在愿望单中', { gameId });
        logStatus.success();
        return true;
      }

      const { result, statusText, status, data } = await httpRequest({
        ...this.#asfOptions,
        data: JSON.stringify({ Command: `!REMOVEWISHLIST ${this.#botName} ${gameId}` })
      });
      if (result !== 'Success') {
        debug('从愿望单移除游戏请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }
      if (data?.status === 200 &&
        ['成功', 'Success', 'Успех'].find((text) => (data.response?.Result?.includes(text)))
      ) {
        debug('成功从愿望单移除游戏', { gameId });
        logStatus.success();
        return true;
      }
      debug('从愿望单移除游戏失败', { result: data?.response?.Result, message: data?.response?.Message });
      logStatus.error(`Error:${data?.response?.Result || data?.response?.Message || data?.statusText}(${data?.status})`);
      return false;
    } catch (error) {
      debug('从愿望单移除游戏时发生错误', { error, gameId });
      throwError(error as Error, 'SteamASF.removeFromWishlist');
      return false;
    }
  }

  /**
   * 关注或取关指定的Steam游戏。
   *
   * @async
   * @function toggleFollowGame
   * @param {string} gameId - Steam游戏的AppId。
   * @param {boolean} doTask - 指定操作，true表示关注游戏，false表示取关游戏。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 操作成功
   *                              - false: 操作失败
   *
   * @description
   * 该方法通过发送HTTP请求来关注或取关指定的Steam游戏。
   * 根据传入的参数`doTask`决定是关注还是取关游戏。
   * 如果请求成功且返回结果为'Success'，并且响应状态为200且包含成功信息，则返回true。
   * 如果请求失败或返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在请求过程中发生错误，将抛出错误并返回false。
   */
  async toggleFollowGame(gameId: string, doTask: boolean): Promise<boolean> {
    try {
      debug('开始处理游戏关注状态', { gameId, doTask });
      const logStatus = echoLog({ type: `${doTask ? '' : 'un'}followingGame`, text: gameId, before: '[ASF]' });
      const gameStatus = await this.#checkGame(gameId);
      if ((doTask && gameStatus.followed === true) || (!doTask && gameStatus.followed === false)) {
        debug('游戏关注状态已符合要求', { gameId, doTask, currentStatus: gameStatus.followed });
        logStatus.success();
        return true;
      }

      const { result, statusText, status, data } = await httpRequest({
        ...this.#asfOptions,
        data: JSON.stringify({ Command: `!${doTask ? '' : 'UN'}FOLLOWGAME ${this.#botName} ${gameId}` })
      });
      if (result !== 'Success') {
        debug('处理游戏关注状态请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }
      if (data?.status === 200 &&
        ['成功', 'Success', 'Успех'].find((text) => (data.response?.Result?.includes(text)))
      ) {
        debug('成功处理游戏关注状态', { gameId, doTask });
        logStatus.success();
        return true;
      }
      debug('处理游戏关注状态失败', { result: data?.response?.Result, message: data?.response?.Message });
      logStatus.error(`Error:${data?.response?.Result || data?.response?.Message || data?.statusText}(${data?.status})`);
      return false;
    } catch (error) {
      debug('处理游戏关注状态时发生错误', { error, gameId, doTask });
      throwError(error as Error, 'SteamASF.toggleFollowGame');
      return false;
    }
  }

  /**
   * 检查指定的Steam游戏状态。
   *
   * @async
   * @private
   * @function #checkGame
   * @param {string} gameId - Steam游戏的AppId。
   * @returns {Promise<{ wishlist?: boolean, followed?: boolean }>} - 返回一个Promise，包含游戏的愿望单和关注状态。
   *
   * @description
   * 该方法通过发送HTTP请求来检查指定的Steam游戏状态。
   * 返回一个对象，包含游戏的愿望单状态和关注状态。
   * 如果游戏在愿望单中，wishlist为true；如果已关注游戏，followed为true。
   */
  async #checkGame(gameId: string): Promise<{ wishlist?: boolean, followed?: boolean }> {
    try {
      debug('开始检查游戏状态', { gameId });
      const { result, data } = await httpRequest({
        ...this.#asfOptions,
        data: JSON.stringify({ Command: `!CHECK ${this.#botName} ${gameId}` })
      });
      if (result !== 'Success') {
        debug('检查游戏状态请求失败', { result });
        return {};
      }
      if (data?.status !== 200 || !data.response?.Result?.includes(gameId)) {
        debug('检查游戏状态响应无效', { status: data?.status });
        return {};
      }
      const matchedResult = data.response.Result.split('\n').find((result: string) => result.includes(gameId))
        ?.split('|');
      if (!matchedResult || matchedResult.length <= 3) {
        debug('未找到游戏状态信息', { gameId });
        return {};
      }
      const status = {
        wishlist: matchedResult.at(-3).trim() === '√' || matchedResult.at(-2).trim() === '√',
        followed: matchedResult.at(-1).trim() === '√'
      };
      debug('成功获取游戏状态', { gameId, status });
      return status;
    } catch (error) {
      debug('检查游戏状态时发生错误', { error, gameId });
      throwError(error as Error, 'SteamASF.checkGame');
      return {};
    }
  }

  /**
   * 关注或取关指定的Steam鉴赏家/开发商/发行商。
   *
   * @async
   * @function toggleCurator
   * @param {string} curatorId - 鉴赏家的ID。
   * @param {boolean} [doTask=true] - 指定操作，true表示关注，false表示取关。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 关注成功
   *                              - false: 关注失败
   *
   * @description
   * 该方法通过发送HTTP请求来关注或取关指定的Steam鉴赏家。
   * 根据传入的参数`doTask`决定是关注还是取关。
   * 如果请求成功且返回结果为'Success'，并且响应状态为200且包含成功信息，则返回true。
   * 如果请求失败或返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在请求过程中发生错误，将抛出错误并返回false。
   */
  async toggleCurator(curatorId: string, doTask = true): Promise<boolean> {
    try {
      debug('开始处理鉴赏家关注状态', { curatorId, doTask });
      const logStatus = echoLog({ type: doTask ? 'followingCurator' : 'unfollowingCurator', text: curatorId, before: '[ASF]' });

      const { result, statusText, status, data } = await httpRequest({
        ...this.#asfOptions,
        data: JSON.stringify({ Command: `!${doTask ? '' : 'UN'}FOLLOWCURATOR ${this.#botName} ${curatorId}` })
      });
      if (result !== 'Success') {
        debug('处理鉴赏家关注状态请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }
      if (data?.status === 200 &&
        ['成功', 'Success', 'Успех'].find((text) => (data.response?.Result?.includes(text)))
      ) {
        debug('成功处理鉴赏家关注状态', { curatorId, doTask });
        logStatus.success();
        return true;
      }
      if (data?.status === 200) {
        debug('处理鉴赏家关注状态失败', { result: data?.response?.Result, message: data?.response?.Message });
        logStatus.error(__('curatorLimitNotice'));
        return false;
      }
      debug('处理鉴赏家关注状态失败', { result: data?.response?.Result, message: data?.response?.Message });
      logStatus.error(`Error:${data?.response?.Result || data?.response?.Message || data?.statusText}(${data?.status})`);
      return false;
    } catch (error) {
      debug('处理鉴赏家关注状态时发生错误', { error, curatorId, doTask });
      throwError(error as Error, 'Steam.toggleCurator');
      return false;
    }
  }

  /**
   * 添加指定的Steam许可证。
   *
   * @async
   * @function addLicense
   * @param {string} id - 要添加的许可证ID，格式为'appid-<appid>'或'subid-<subid1>,<subid2>,...'。
   * @returns {Promise<boolean>} - 返回一个Promise，表示添加操作的结果。
   *                              - true: 添加成功
   *                              - false: 添加失败
   *
   * @description
   * 该方法根据传入的ID类型（appid或subid）添加Steam许可证。
   * 如果ID类型为'appid'，则发送请求以添加应用程序许可证。
   * 如果ID类型为'subid'，则将多个订阅ID分割并逐个添加。
   * 在请求成功的情况下，检查返回的状态和结果，记录成功或错误信息。
   * 如果在请求过程中发生错误，将抛出错误并返回false。
   */
  async addLicense(id: string): Promise<boolean> {
    try {
      debug('开始添加许可证', { id });
      const [type, ids] = id.split('-');
      const idsArr = ids.split(',');
      if (type === 'appid') {
        const logStatus = echoLog({ type: 'addingFreeLicense', text: ids, before: '[ASF]' });
        const { result, statusText, status, data } = await httpRequest({
          ...this.#asfOptions,
          data: JSON.stringify({ Command: `!addlicense ${this.#botName} ${idsArr.map((id) => `app/${id}`).join(',')}` })
        });
        if (result !== 'Success') {
          debug('添加应用许可证请求失败', { result, statusText, status });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status === 200 &&
          ['AlreadyPurchased', 'OK'].find((text) => (data.response?.Result?.includes(text)))
        ) {
          debug('成功添加应用许可证', { ids });
          logStatus.success();
          return true;
        }
        debug('添加应用许可证失败', { result: data?.response?.Result, message: data?.response?.Message });
        logStatus.error(`Error:${data?.response?.Result || data?.response?.Message || data?.statusText}(${data?.status})`);
        return false;
      }
      if (type === 'subid') {
        const logStatus = echoLog({ type: 'addingFreeLicenseSubid', text: ids, before: '[ASF]' });
        const { result, statusText, status, data } = await httpRequest({
          ...this.#asfOptions,
          data: JSON.stringify({ Command: `!addlicense ${this.#botName} ${idsArr.map((id) => `sub/${id}`).join(',')}` })
        });
        if (result !== 'Success') {
          debug('添加订阅许可证请求失败', { result, statusText, status });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status === 200 && data.response?.Result) {
          const resultLines = data.response.Result.split('\n');
          debug('处理订阅许可证结果', { resultLines });
          idsArr.forEach((subid) => {
            const targetLine = resultLines.find((text: string) => text.includes(subid));
            if (targetLine && ['成功', 'Success', 'Успех'].find((text) => (targetLine.includes(text)))) {
              debug('成功添加订阅许可证', { subid });
              echoLog({ before: '[ASF]' }).success(targetLine);
            } else {
              debug('添加订阅许可证失败', { subid, targetLine });
              echoLog({ before: '[ASF]' }).error(targetLine);
            }
          });
          return true;
        }
        debug('添加订阅许可证失败', { result: data?.response?.Result, message: data?.response?.Message });
        logStatus.error(`Error:${data?.response?.Result || data?.response?.Message || data?.statusText}(${data?.status})`);
        return false;
      }
      debug('无效的许可证类型', { type });
      return false;
    } catch (error) {
      debug('添加许可证时发生错误', { error, id });
      throwError(error as Error, 'SteamASF.addLicense');
      return false;
    }
  }

  /**
   * 请求访问指定Steam游戏的试玩权限。
   *
   * @async
   * @function requestPlayTestAccess
   * @param {string} id - Steam游戏的AppId。
   * @returns {Promise<boolean>} - 返回一个Promise，表示请求操作的结果。
   *                              - true: 请求成功
   *                              - false: 请求失败
   *
   * @description
   * 该方法通过发送HTTP请求来请求访问指定Steam游戏的试玩权限。
   * 请求的命令格式为`!REQUESTACCESS <botName> <id>`。
   * 如果请求成功且返回结果为'Success'，并且响应状态为200且包含成功信息，则返回true。
   * 如果请求失败或返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在请求过程中发生错误，将抛出错误并返回false。
   */
  async requestPlayTestAccess(id: string): Promise<boolean> {
    try {
      debug('开始请求游戏试玩权限', { id });
      const logStatus = echoLog({ type: 'requestingPlayTestAccess', text: id, before: '[ASF]' });
      const { result, statusText, status, data } = await httpRequest({
        ...this.#asfOptions,
        data: JSON.stringify({ Command: `!REQUESTACCESS ${this.#botName} ${id}` })
      });

      if (result !== 'Success') {
        debug('请求游戏试玩权限请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status === 200 &&
        ['成功', 'Success', 'Успех'].find((text) => (data.response?.Result?.includes(text)))
      ) {
        debug('成功请求游戏试玩权限', { id });
        logStatus.success();
        return true;
      }

      debug('请求游戏试玩权限失败', { result: data?.response?.Result, message: data?.response?.Message });
      logStatus.error(`Error:${data?.response?.Result || data?.response?.Message || data?.statusText}(${data?.status})`);
      return false;
    } catch (error) {
      debug('请求游戏试玩权限时发生错误', { error, id });
      throwError(error as Error, 'SteamASF.requestPlayTestAccess');
      return false;
    }
  }

  /**
   * Steam游戏挂游玩时长。
   *
   * @async
   * @function playGames
   * @param {string} ids - Steam游戏的AppId。
   * @returns {Promise<boolean>} - 返回一个Promise，表示请求操作的结果。
   *                              - true: 请求成功
   *                              - false: 请求失败
   *
   * @description
   * 该方法通过发送HTTP请求来挂游玩指定Steam游戏的时长。
   * 请求的命令格式为`!play <botName> <ids>`，其中`ids`可以是多个游戏的AppId，以逗号分隔。
   * 如果请求成功且返回结果为'Success'，并且响应状态为200且包含正在运行的状态，则返回true。
   * 如果请求失败或返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在请求过程中发生错误，将抛出错误并返回false。
   */
  async playGames(ids: string): Promise<boolean> {
    try {
      debug('开始挂游戏时长', { ids });
      // await this.addLicense(`appid-${ids}`);
      const logStatus = echoLog({ text: __('playingGames', ids), before: '[ASF]' });
      const { result, statusText, status, data } = await httpRequest({
        ...this.#asfOptions,
        data: JSON.stringify({ Command: `!play ${this.#botName} ${ids}` })
      });
      if (result !== 'Success') {
        debug('挂游戏时长请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }
      if (data?.status === 200 &&
        ['正在运行', '正在掛', 'Playing', 'Играет'].find((text) => (data.response?.Result?.includes(text)))
      ) {
        debug('成功开始挂游戏时长', { ids });
        logStatus.success();
        return true;
      }
      debug('开始挂游戏时长失败', { result: data?.response?.Result, message: data?.response?.Message });
      logStatus.error(`Error:${data?.response?.Result || data?.response?.Message || data?.statusText}(${data?.status})`);
      return false;
    } catch (error) {
      debug('挂游戏时长时发生错误', { error, ids });
      throwError(error as Error, 'SteamASF.playGames');
      return false;
    }
  }

  /**
   * 通过ASF API获取Steam ID。
   *
   * @async
   * @function getSteamIdASF
   * @returns {Promise<string>} 返回一个Promise，解析为Steam ID字符串
   *                           - 成功时返回Steam ID
   *                           - 失败时返回空字符串
   *
   * @description
   * 该方法通过ASF的API接口获取Steam ID。
   * 发送一个包含`!steamid`命令的请求到ASF服务器。
   * 如果请求成功，从响应中解析出Steam ID并返回。
   * 如果请求失败或解析失败，返回空字符串。
   */
  async getSteamIdASF(): Promise<string> {
    try {
      debug('开始获取Steam ID');
      const logStatus = echoLog({ text: __('gettingSteamId'), before: '[ASF]' });
      const { result, statusText, status, data } = await httpRequest({
        ...this.#asfOptions,
        data: JSON.stringify({ Command: `!steamid ${this.#botName}` })
      });
      if (result !== 'Success' || data?.status !== 200) {
        debug('获取Steam ID请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return '';
      }
      if (data.response?.Result) {
        const steamId = data.response.Result.trim()?.split(/\s+/)
          ?.at(-1);
        if (steamId) {
          debug('成功获取Steam ID', steamId);
          logStatus.success();
          return steamId;
        }
      }
      debug('获取Steam ID失败', { result: data?.response?.Result, message: data?.response?.Message });
      logStatus.error(`Error:${data?.response?.Result || data?.response?.Message || data?.statusText}(${data?.status})`);
      return '';
    } catch (error) {
      debug('获取Steam ID时发生错误', { error });
      throwError(error as Error, 'SteamASF.getSteamIdASF');
      return '';
    }
  }

  /**
   * 通过Steam网站获取Steam ID。
   *
   * @async
   * @function getSteamIdWeb
   * @returns {Promise<string>} 返回一个Promise，解析为Steam ID字符串
   *                           - 成功时返回Steam ID
   *                           - 失败时返回空字符串
   *
   * @description
   * 该方法通过访问Steam商店网站来获取Steam ID。
   * 发送GET请求到store.steampowered.com，
   * 从返回的HTML内容中通过正则表达式提取Steam ID。
   * 如果提取成功返回Steam ID，否则返回空字符串。
   */
  async getSteamIdWeb(): Promise<string> {
    try {
      debug('开始获取Steam ID');
      const logStatus = echoLog({ text: __('gettingSteamId'), before: '[Web]' });
      const { result, statusText, status, data } = await httpRequest({
        url: 'https://store.steampowered.com',
        method: 'GET',
        headers: {
          host: 'store.steampowered.com'
        }
      });
      if (result !== 'Success' || data?.status !== 200) {
        debug('获取Steam ID请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return '';
      }
      const steamId = data.responseText.match(/steamid&quot;:&quot;(\d+)/)?.[1];
      if (steamId) {
        debug('成功获取Steam ID', steamId);
        logStatus.success();
        return steamId;
      }
      debug('获取Steam ID失败', { data });
      logStatus.error(`${result}:${statusText}(${status})`);
      return '';
    } catch (error) {
      debug('获取Steam ID时发生错误', { error });
      throwError(error as Error, 'SteamASF.getSteamIdWeb');
      return '';
    }
  }

  /**
   * 获取Steam ID的主方法。
   *
   * @async
   * @function getSteamId
   * @returns {Promise<string>} 返回一个Promise，解析为Steam ID字符串
   *
   * @description
   * 该方法首先尝试通过Web方式获取Steam ID，
   * 如果Web方式失败，则尝试通过ASF API获取。
   * 返回第一个成功获取的Steam ID。
   */
  async getSteamId(): Promise<string> {
    const steamId = await this.getSteamIdWeb();
    if (steamId) {
      return steamId;
    }
    return this.getSteamIdASF();
  }

  /**
   * 检查指定游戏的挂机状态。
   *
   * @async
   * @function checkPlayStatus
   * @param {string} ids - 要检查的游戏ID列表，多个ID用逗号分隔
   * @returns {Promise<'skip' | boolean>} 返回一个Promise，解析为检查结果
   *                                     - 'skip': 跳过检查（未设置API key或未获取到Steam ID）
   *                                     - true: 至少有一个游戏正在挂机
   *                                     - false: 没有游戏在挂机或检查失败
   *
   * @description
   * 该方法通过Steam Web API检查指定游戏的挂机状态。
   * 首先验证是否设置了Steam Web API密钥和Steam ID。
   * 然后通过API获取玩家状态信息，比对正在运行的游戏ID和需要检查的游戏ID。
   * 如果有交集则表示正在挂机指定的游戏。
   */
  async checkPlayStatus(ids: string): Promise<'skip' | boolean> {
    try {
      debug('开始检查挂游戏时长状态');
      if (!this.#steamWebApiKey) {
        debug('未设置Steam Web API Key');
        return 'skip';
      }
      if (!this.#steamId) {
        const steamId = await this.getSteamId();
        if (!steamId) {
          debug('未获取到Steam ID');
          return 'skip';
        }
        this.#steamId = steamId;
      }
      const logStatus = echoLog({ text: __('checkingPlayStatus'), before: '[Web]' });
      const { result, statusText, status, data } = await httpRequest({
        url: `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${this.#steamWebApiKey}&steamids=${this.#steamId}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (result !== 'Success') {
        debug('检查挂游戏时长状态请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }
      if (data?.status === 200) {
        debug('挂游戏时长状态正常', { data });
        const playedIds = new Set(data.responseText?.match(/\d+/g));
        const neededIds = new Set(ids.match(/\d+/g));
        if (neededIds.intersection(playedIds).size > 0) {
          logStatus.success();
          return true;
        }
        logStatus.warning(__('noPlayStatus'));
        return false;
      }
      debug('挂游戏时长状态异常', { data });
      logStatus.error(`Error:${data?.statusText}(${data?.status})`);
      return false;
    } catch (error) {
      debug('检查挂游戏时长状态时发生错误', { error });
      throwError(error as Error, 'SteamASF.checkPlayStatus');
      return false;
    }
  }

  /**
   * Steam游戏停止挂游玩时长。
   *
   * @async
   * @function stopPlayGames
   * @returns {Promise<boolean>} - 返回一个Promise，表示请求操作的结果。
   *                              - true: 请求成功
   *                              - false: 请求失败
   *
   * @description
   * 该方法通过发送HTTP请求来停止挂游玩指定Steam游戏的时长。
   * 请求的命令格式为`!resume <botName>`。
   * 如果请求成功且返回结果为'Success'，并且响应状态为200且包含恢复的状态，则返回true。
   * 如果请求失败或返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在请求过程中发生错误，将抛出错误并返回false.
   */
  async stopPlayGames(): Promise<boolean> {
    try {
      debug('开始停止挂游戏时长');
      const logStatus = echoLog({ text: __('stoppingPlayGames'), before: '[ASF]' });
      const { result, statusText, status, data } = await httpRequest({
        ...this.#asfOptions,
        data: JSON.stringify({ Command: `!resume ${this.#botName}` })
      });
      if (result !== 'Success') {
        debug('停止挂游戏时长请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }
      if (data?.status === 200 &&
        ['已经恢复', '已恢复', '已經繼續', '已繼續', 'resumed', 'возобновлён'].find((text) => (data.response?.Result?.includes(text)))
      ) {
        debug('成功停止挂游戏时长');
        logStatus.success();
        return true;
      }
      debug('停止挂游戏时长失败', { result: data?.response?.Result, message: data?.response?.Message });
      logStatus.error(`Error:${data?.response?.Result || data?.response?.Message || data?.statusText}(${data?.status})`);
      return false;
    } catch (error) {
      debug('停止挂游戏时长时发生错误', { error });
      throwError(error as Error, 'SteamASF.stopPlayGames');
      return false;
    }
  }

  /**
   * 处理不支持的功能。
   *
   * @async
   * @private
   * @function #unsupportted
   * @param {string} name - 不支持的功能名称。
   * @returns {Promise<boolean>} - 返回一个Promise，始终返回false。
   *
   * @description
   * 该方法用于处理ASF不支持的功能，显示警告信息并返回false。
   */
  async #unsupportted(name: string): Promise<boolean> {
    try {
      debug('尝试使用不支持的功能', { name });
      echoLog({ before: '[ASF]' }).warning(__('ASFNotSupportted', name));
      return false;
    } catch (error) {
      debug('处理不支持的功能时发生错误', { error, name });
      throwError(error as Error, 'SteamASF.unsupportted');
      return false;
    }
  }
  async toggleForum(): Promise<boolean> {
    return this.#unsupportted('toggleForum');
  }
  async toggleFavoriteWorkshop(): Promise<boolean> {
    return this.#unsupportted('toggleFavoriteWorkshop');
  }
  async voteUpWorkshop(): Promise<boolean> {
    return this.#unsupportted('voteUpWorkshop');
  }
  async likeAnnouncement(): Promise<boolean> {
    return this.#unsupportted('likeAnnouncement');
  }
}
export default SteamASF;
