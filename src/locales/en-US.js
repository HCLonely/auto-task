/*
 * @Author       : HCLonely
 * @Date         : 2021-12-30 17:08:27
 * @LastEditTime : 2023-03-12 10:28:32
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task-new/src/locales/en-US.js
 * @Description  : i18n英文
 */
const data = {
  // 通用任务
  website: 'Website',
  type: 'Type',
  edit: 'Edit',
  whiteList: 'Whitelist',
  skipTask: 'Skip undo task',
  whiteListOptions: 'Whitelist options',
  changeWhiteListOption: 'Whitelist option(%0)',
  whiteListNotFound: 'Cannot find this whitelist: %0',
  changeWhiteListSuccess: 'The whitelist is successfully modified, and the page refresh will take effect!',
  changeWebsiteOptions: 'Website options',
  changeGlobalOptions: 'Global options',
  ok: 'OK',
  save: 'Save',
  close: 'Close',
  return: 'Return',
  option: 'Option',
  value: 'Value',
  websiteOptions: 'Current website settings',
  changeWebsiteOptionsSuccess: 'The current website setting is changed successfully, and the page refresh will take effect!',
  changeGlobalOptionsSuccess: 'The global setting is changed successfully, and the refresh will take effect!',
  needLogin: 'Please log in first!',
  getTasksInfo: 'Obtaining and processing task information...',
  gettingKey: 'Getting Key...',
  verifyingTask: 'Verifying task',
  notice: 'Automatic task script notice',
  noKeysLeft: 'There are no more keys left on this page. Do you want to close it?',
  giveawayEnded: 'This event has ended, do you want to close it?',
  giveawayNotWork: 'This activity is unavailable for some reasons (banned/ended/paused/not started...)' +
  ' (if it is a script misjudgment, please give us feedback in time), is it closed?',
  confirm: 'Confirm',
  cancel: 'Cancel',
  unKnown: 'Unknown',
  unKnownTaskType: 'Unrecognized task',
  doing: 'Doing a task',
  allTasksComplete: 'All tasks have been completed!',
  getTaskIdFailed: 'Failed to obtain task Id!',
  initSuccess: '%0 was initialized successfully!',
  initFailed: '%0 initialization failed!',
  errorLink: 'Link error: %0',
  needInit: 'Please initialize first',
  verifyingAuth: 'Verifying %0 token...',
  updatingAuth: 'Update %0 token...',
  initing: 'Initializing...',
  getFailed: 'Failed to get %0!',
  checkLoginFailed: 'Failed to detect login status!',
  checkLeftKeyFailed: 'Failed to detect the remaining keys!',
  userId: 'User Id',
  joiningGiveaway: 'Joining giveaway',
  needJoinGiveaway: 'Need to join the giveaway first',
  cannotUndo: 'This website does not support canceling tasks',
  verifyAuth: 'Verifying %0 token...',
  closePageNotice: 'f this page does not close automatically, please close this page yourself.',
  errorReport: 'A script error is detected, do you want to report the BUG?',
  visitingLink: 'Visiting link: ',
  doTask: 'DoTask',
  undoTask: 'UndoTask',
  verifyTask: 'Verify',
  getKey: 'GetKey',
  selectAll: 'SelectAll',
  selectNone: 'SelectNone',
  invertSelect: 'InvertSelect',
  doFreeTask: 'FreeTask',
  doPointTask: 'PointTask',
  skipTaskOption: 'Skip task has been configured in the settings',
  other: 'Other',
  globalOptions: 'Global Options',
  checkLogin: 'Login detection</br>Need to log in to the website automatically log in, part of this website supports.',
  checkLeftKey: 'Key remaining detection</br>The end of the giveaway event prompts whether to close or not, part of this website supports.',
  twitterVerifyId: 'Verify Twitter token by trying to follow the account.</br>The default is the official Twitter account 783214.</br>' +
    'If you don\'t want to follow the official account, you can change it to your own account.',
  youtubeVerifyChannel: 'Verify YouTube token by trying to subscribe to the channel.</br>' +
    'The default is the official YouTube channel UCrXUsMBcfTVqwAS7DKg9C0Q.</br>' +
    'If you don\'t want to follow the official channel, you can change it to your own channel.',
  autoUpdateSource: 'The source to update</br>github: Fast update.</br>jsdelivr: Update is delayed.</br>' +
    'standby: Standby source.</br>auto: Try to update using github, jsdelivr, standby sources in turn.',
  saveGlobalOptions: 'SaveSettings',
  settingPage: 'Setting Page',
  name: 'Name',
  version: 'Version',
  scriptManager: 'Script Manager',
  script: 'Script',
  environment: 'Environment',
  os: 'OS',
  browser: 'Browser',
  getId: 'Get %0 id',
  getTwitterUserId: 'Get Twitter user id (Get id function is only available on the settings page).',
  getYoutubeChannelId: 'Get Youtube channel id (Get id function is only available on the settings page).',
  showButton: 'ShowButton',
  hideButton: 'HideButton',
  showLog: 'ShowLog',
  hideLog: 'HideLog',
  defaultShowButton: 'Default display button',
  defaultShowLog: 'Display log by default',
  debug: 'Output debug log, do not enable this option!',
  receivePreview: 'Receive preview updates',
  position: 'Component position',
  buttonSideX: 'Horizontal positioning of the button area (real-time preview function is only available on the setting page).' +
    '</br>left: left | right: right',
  buttonSideY: 'The button area is positioned in the vertical direction (real-time preview function is only available on the settings page).' +
    '</br>top: top | bottom: bottom',
  buttonDistance: 'The distance between the button area and the edge (the real-time preview function is only available on the setting page).' +
    '</br> Format: X distance, Y distance',
  showButtonSideX: 'ShowButton horizontal positioning (real-time preview function is only available on the setting page).' +
    '</br>left: left | right: right',
  showButtonSideY: 'ShowButton vertical positioning (real-time preview function is only available on the setting page).' +
    '</br>top: top | bottom: bottom',
  showButtonDistance: 'The distance between the ShowButton and the edge (real-time preview function is only available on the setting page).' +
    '</br> Format: X distance, Y distance',
  logSideX: 'Horizontal positioning of the log area (real-time preview function is only available on the setting page).' +
    '</br>left: left | right: right',
  logSideY: 'Vertical positioning of the log area (real-time preview function is only available on the setting page).' +
    '</br>top: top | bottom: bottom',
  logDistance: 'The distance between the log area and the edge (the real-time preview function is only available on the setting page).' +
    '</br> Format: X distance, Y distance',
  hotKey: 'Shortcut key',
  doTaskKey: 'DoTask shortcut keys</br> (real-time preview function is only available on the settings page).',
  undoTaskKey: 'UndoTask shortcut keys</br> (real-time preview function is only available on the settings page).',
  toggleLogKey: 'ShowLog/HideLog shortcut keys</br> (real-time preview function is only available on the settings page).',
  tasksHistory: 'TasksHistory',
  clearHistory: 'Clear history',
  clearHistoryFinished: 'The mission history has been cleared!',
  deleteTask: 'Delete task',
  lastChangeTime: 'Last Change Time',
  clearTaskFinished: 'Delete the following tasks completed!',
  clearTaskFailed: 'Failed to delete the task, the task name was not found!',
  syncData: 'DataSync',
  settingData: 'Uploading data...',
  gettingData: 'Getting data...',
  help: 'Help',
  fileName: 'Filename',
  upload2gist: 'Sync to Gist',
  downloadFromGist: 'Sync from Gist',
  saveAndTest: 'Save configuration and test',
  testSuccess: 'Test success!',
  testFailed: 'Test failed!',
  saveAndTestNotice: 'Please save the configuration and test first!',
  processingData: 'Processing data...',
  updatingData: 'Uploading data...',
  syncDataSuccess: 'Synchronized data successfully!',
  syncDataFailed: 'Failed to synchronize data, please check the error message on the console!',
  downloadingData: 'Downloading data...',
  checkedNoData: 'No remote data is detected, please confirm whether the configuration is correct!',
  savingData: 'Saving data...',
  syncHistory: 'Synchronize tasks history',
  checkUpdateFailed: 'Check update failed',
  newVersionNotice: 'Checked a new version V%0, <a class="high-light" href="%1" target="_blank">click to update</a>',
  language: 'Language</br> Currently only supports zh: Chinese, en: English',
  gistOptions: 'Gist Settings',
  swalNotice: 'It is detected that you are installing the V4 version script for the first time' +
    ', please go to read the READ ME FIRST content before use!',
  echoNotice: 'It is detected that you are installing the V4 version script for the first time' +
    ', please <a class="high-light" href="%0" target="_blank">click here</a> to read the READ ME FIRST content before use!',
  noticeLink: 'https://auto-task-doc.js.org/en/guide/#read-me-first',
  toGithub: 'Feedback(Github)',
  toKeylol: 'Feedback(Keylol)',
  copySuccess: 'The error message has been copied to the clipboard. Do you want to go to the Keylol forum to give feedback?',
  copyFailed: 'Please copy the error information below and report back to the Keylol forum!',
  updateText: 'Updates in version %0:',
  Active: 'Active',
  Ended: 'Ended',
  Banned: 'Banned',
  Paused: 'Paused',
  notStart: 'notStart',
  noRemoteData: 'No data remotely',
  errorRemoteDataFormat: 'Remote data has wrong format',
  updateHistory: '<a class="high-light" href="https://auto-task-doc.js.org/logs/" target="_blank">Click here</a>' +
    ' to view the historical update record.',
  AsfEnabled: 'Use ASF to do Steam related tasks (requires <a href="https://github.com/chr233/ASFEnhance" target="_blank">ASFEnhance</a> plugin)',
  AsfIpcUrl: 'ASF IPC URL',
  AsfIpcPassword: 'ASF IPC Password',

  // Steam
  groups: 'Group',
  officialGroups: 'Official Group',
  wishlists: 'Wishlist',
  follows: 'Follow Game',
  forums: 'Forum',
  workshops: 'Favorite Workshop',
  curators: 'Curator',
  workshopVotes: 'Voteup Workshop',
  announcements: 'Announcement',
  steamCommunity: 'Steam Community',
  steamStore: 'Steam Store',
  licenses: 'Add License',
  playtests: 'Playtest Access',
  needLoginSteamStore: 'Please <a href="https://store.steampowered.com/login/" target="_blank">log in to the Steam Store</a>',
  needLoginSteamCommunity: 'Please <a href="https://steamcommunity.com/login/home/" target="_blank">log in to the Steam Community</a>',
  joiningSteamGroup: 'Joining Steam Group',
  leavingSteamGroup: 'Leaving Steam Group',
  gettingSteamGroupId: 'Getting Steam Group Id',
  joiningSteamOfficialGroup: 'Joining Steam Official Group',
  leavingSteamOfficialGroup: 'Leaving Steam Official Group',
  gettingSteamOfficialGroupId: 'Getting Steam Official Group Id',
  subscribingForum: 'Subscribing the Steam Forum',
  unsubscribingForum: 'Unsubscribing the Steam Forum',
  gettingForumId: 'Getting Steam Forum Id',
  followingCurator: 'Following Steam Curator',
  unfollowingCurator: 'Unfollowing Steam Curator',
  gettingCuratorId: 'Getting Steam Curator Id',
  addingToWishlist: 'Adding the game to the Steam wishlist',
  removingFromWishlist: 'Removing the game from the Steam wishlist',
  followingGame: 'Following Steam games',
  unfollowingGame: 'Unfollowing Steam games',
  favoritingWorkshop: 'Favouring Steam Workshop Items',
  unfavoritingWorkshop: 'Unfavoriting Steam Workshop Items',
  gettingWorkshopAppId: 'Getting Steam Workshop Item Id',
  votingUpWorkshop: 'Liking Steam workshop items',
  gettingAnnouncementParams: 'Getting Steam announcement information',
  likingAnnouncement: 'Liking Steam announcement',
  changingArea: 'Changing Steam area: %0...',
  notNeededChangeArea: 'The current area does not need to be changed',
  noAnotherArea: 'Please check whether the proxy is turned on correctly',
  gettingAreaInfo: 'Getting Steam area information...',
  changeAreaNotice: 'Suspected of a locked zone game, try to change the zone to execute',
  steamFinishNotice: 'Steam task completed, try to change the shopping cart area back to CN',
  gettingSubid: 'Getting subid',
  addingFreeLicense: 'Adding free license',
  missParams: 'Missing parameters',
  gettingLicenses: 'Getting licenses...',
  requestingPlayTestAccess: 'Requesting play test access',
  tryChangeAreaNotice: 'This function cannot detect whether the game is limited, so it will try to change the area before entering the library' +
    '. Failure to change the area will not affect the subsequent storage.',
  versionNotMatched: 'The script manager version is too low, requiring TamperMonkey >= 5.2.0 or TamperMonkey Beta >= 5.2.6196',
  gettingUserLink: 'Getting steam user community link...',
  retry: 'Retry',

  // Steam ASF
  initingASF: 'Initing ASF...',

  // Discord
  servers: 'Server',
  joiningDiscordServer: 'Joining Discord Server',
  leavingDiscordServer: 'Leaving Discord Server',
  gettingDiscordGuild: 'Getting Discord server Id',
  getDiscordAuthFailed: 'Failed to get Discord token, please check whether the Discord account is logged in',
  discordImportantNotice: 'Important Reminder! ! !',
  // eslint-disable-next-line max-len
  discordImportantNoticeText: 'Due to the background update of the Discord website, currently using this script to join a group may cause the Discord account to be forcibly logged out, and two-step verification is required to log in normally, please use it with caution! ! !',
  continue: 'Continue',
  skipDiscordTask: 'Skip',
  continueAndDontRemindAgain: 'Continue without Reminders',

  // Instagram
  users: 'User',
  loginIns: 'Please <a href="https://www.instagram.com/accounts/login/" target="_blank">log in to Instagram</a>',
  insBanned: 'Your Instagram account has been banned',
  verifyingInsAuth: 'Verifying Instagram token...',
  gettingInsUserId: 'Getting Instagram user Id',
  followingIns: 'Following Instagram user',
  unfollowingIns: 'Unfollowing Instagram user',

  // Reddit
  reddits: 'Reddit/User',
  loginReddit: 'Please <a href="https://www.reddit.com/login/" target="_blank">log in to Reddit</a>',
  changingRedditVersion: 'Switching Reddit to a new version page...',
  joiningReddit: 'Joining the Reddit',
  leavingReddit: 'Leaving the Reddit',
  followingRedditUser: 'Following Reddit User',
  unfollowingRedditUser: 'Unfollowing Reddit User',

  // Twitch
  channels: 'Channel',
  followingTwitchChannel: 'Following Twitch Channel',
  unfollowingTwitchChannel: 'Unfollowing Twitch Channel',
  gettingTwitchChannelId: 'Getting Twitch Channel Id',
  checkingTwitchIntegrity: 'Checking Twitch integrity...',

  // Twitter
  twitterUser: 'Twitter User',
  retweets: 'Retweet',
  gettingTwitterUserId: 'Getting Twitter User Id',
  followingTwitterUser: 'Following Twitter User',
  unfollowingTwitterUser: 'Unfollowing Twitter User',
  retweetting: 'Retweetting',
  unretweetting: 'Unretweetting',

  // Vk
  names: 'Group/Public/Wall',
  loginVk: 'Please <a href="https://vk.com/login/" target="_blank">log in to Vk</a>',
  gettingVkId: 'Getting Vk task Id',
  joiningVkGroup: 'Joining Vk Group',
  leavingVkGroup: 'Leaving Vk Group',
  joiningVkPublic: 'Joining Vk Public',
  leavingVkPublic: 'Leaving Vk Public',
  sendingVkWall: 'Sending Vk Wall',
  deletingVkWall: 'Deleting Vk Wall',

  // YouTube
  youtubeChannel: 'YouTube Channel',
  likes: 'Like',
  loginYtb: 'Please <a href="https://accounts.google.com/ServiceLogin?service=youtube" target="_blank">log in to YouTube</a>',
  tryUpdateYtbAuth: 'Please try to <a href="https://www.youtube.com/#auth" target="_blank">update YouTube token</a>',
  gettingYtbToken: 'Getting YouTube Token...',
  followingYtbChannel: 'Subscribing to YouTube channel',
  unfollowingYtbChannel: 'Unsubscribing to YouTube channel',
  likingYtbVideo: 'Liking YouTube video',
  unlikingYtbVideo: 'Unliking YouTube video',

  // GiveKey
  giveKeyNoticeBefore: 'Each verification interval is 15s',
  giveKeyNoticeAfter: 'If there is no key, please check at <a href="https://givekey.ru/profile" target="_blank">https://givekey.ru/profile</a>',

  // OpiumPulses
  noPoints: 'Not enough points, skip the lottery',
  getNeedPointsFailed: 'ailed to obtain the required points, skip the lottery',
  joiningLottery: 'Joining the lottery',

  // Gleam
  doingGleamTask: 'Doing Gleam Task...',
  gettingGleamLink: 'Getting Gleam task link...',
  gleamTaskNotice: 'If this page has not been closed for a long time, please close it yourself after completing any task!',
  verifiedGleamTasks: 'Attempted to verify all tasks. If the verification fails, please try to verify manually or complete it!',
  campaign: 'ReCAPTCHA detected, please complete it and re-verify the tasks!',

  // GiveawaySu
  gsNotice: 'In order to avoid getting the "0000-0000-0000" key, the "Grab Key" button has been hidden,' +
    ' please close the script when obtaining the key!',

  // GiveeClub
  giveeClubVerifyNotice: 'Verifying task...',
  giveeClubVerifyFinished: 'Wait for the verification to complete and join it by yourself',

  // Keyhub
  doingKeyhubTask: 'Doing Keyhub Task...',

  // SweepWidget
  SweepWidgetNotice: 'The task is being processed and verified. ' +
    'There is an interval of 1~3s for each verification task to prevent the triggering of too fast verification warning...',

  // opquests
  confirmingTask: 'Confirming task...'
};
export default data;
