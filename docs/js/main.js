"use strict";function _createForOfIteratorHelper(e,t){var o;if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(o=_unsupportedIterableToArray(e))||t&&e&&"number"==typeof e.length){o&&(e=o);var n=0,r=function(){};return{s:r,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,l=!0,i=!1;return{s:function(){o=e[Symbol.iterator]()},n:function(){var e=o.next();return l=e.done,e},e:function(e){i=!0,a=e},f:function(){try{l||null==o.return||o.return()}finally{if(i)throw a}}}}function asyncGeneratorStep(e,t,o,n,r,a,l){try{var i=e[a](l),s=i.value}catch(e){return void o(e)}i.done?t(s):Promise.resolve(s).then(n,r)}function _asyncToGenerator(i){return function(){var e=this,l=arguments;return new Promise(function(t,o){var n=i.apply(e,l);function r(e){asyncGeneratorStep(n,t,o,r,a,"next",e)}function a(e){asyncGeneratorStep(n,t,o,r,a,"throw",e)}r(void 0)})}}function _slicedToArray(e,t){return _arrayWithHoles(e)||_iterableToArrayLimit(e,t)||_unsupportedIterableToArray(e,t)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var o=Object.prototype.toString.call(e).slice(8,-1);return"Object"===o&&e.constructor&&(o=e.constructor.name),"Map"===o||"Set"===o?Array.from(e):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?_arrayLikeToArray(e,t):void 0}}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var o=0,n=new Array(t);o<t;o++)n[o]=e[o];return n}function _iterableToArrayLimit(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var o=[],n=!0,r=!1,a=void 0;try{for(var l,i=e[Symbol.iterator]();!(n=(l=i.next()).done)&&(o.push(l.value),!t||o.length!==t);n=!0);}catch(e){r=!0,a=e}finally{try{n||null==i.return||i.return()}finally{if(r)throw a}}return o}}function _arrayWithHoles(e){if(Array.isArray(e))return e}var defaultConf={global:{fuck:{joinSteamGroup:!0,followCurator:!0,followDeveloper:!0,followPublisher:!0,likeAnnouncement:!0,addToWishlist:!0,followGame:!0,joinDiscordServer:!0,followIns:!0,visitLink:!0,verifyTask:!0,doTask:!0,autoLogin:!1},verify:{verifyTask:!0},remove:{leaveSteamGroup:!0,unfollowCurator:!0,unfollowDeveloper:!0,unfollowPublisher:!0,removeFromWishlist:!0,unfollowGame:!0,leaveDiscordServer:!0,unfollowIns:!0},other:{showLogs:!0,showDetails:!0,checkLogin:!0,checkLeft:!0,autoOpen:!0,reCaptcha:!1},hotKey:{fuckKey:"Alt + A",verifyKey:"Alt + V",removeKey:"Alt + R",toggleLogKey:"Alt + L"}},giveawaysu:{fuck:{joinSteamGroup:!0,followCurator:!0,followDeveloper:!0,followPublisher:!0,likeAnnouncement:!0,addToWishlist:!0,followGame:!0,joinDiscordServer:!0,followIns:!0,visitLink:!0},remove:{leaveSteamGroup:!0,unfollowCurator:!0,unfollowDeveloper:!0,unfollowPublisher:!0,removeFromWishlist:!0,unfollowGame:!0,leaveDiscordServer:!0,unfollowIns:!0},enable:!1},marvelousga:{fuck:{joinSteamGroup:!0,followCurator:!0,followDeveloper:!0,followPublisher:!0,likeAnnouncement:!0,addToWishlist:!0,followGame:!0,visitLink:!0,verifyTask:!0},remove:{leaveSteamGroup:!0,unfollowCurator:!0,unfollowDeveloper:!0,unfollowPublisher:!0,removeFromWishlist:!0,unfollowGame:!0},enable:!1},banana:{fuck:{joinSteamGroup:!0,followCurator:!0,followDeveloper:!0,followPublisher:!0,likeAnnouncement:!0,addToWishlist:!0,followGame:!0,visitLink:!0,verifyTask:!0},remove:{leaveSteamGroup:!0,unfollowCurator:!0,unfollowDeveloper:!0,unfollowPublisher:!0,removeFromWishlist:!0,unfollowGame:!0},enable:!1},gamehag:{fuck:{joinSteamGroup:!0,visitLink:!0,verifyTask:!0},remove:{leaveSteamGroup:!0},enable:!1},prys:{fuck:{joinSteamGroup:!0,followCurator:!0,verifyTask:!0},remove:{leaveSteamGroup:!0,unfollowCurator:!0},enable:!1},takekey:{fuck:{joinSteamGroup:!0,visitLink:!0},remove:{leaveSteamGroup:!0},enable:!1},gleam:{fuck:{joinSteamGroup:!0,visitLink:!0,verifyTask:!0},remove:{leaveSteamGroup:!0},enable:!1},opiumpulses:{other:{limitPoint:""},enable:!1},freegamelottery:{fuck:{autoLogin:!0,doTask:!0},userInfo:{username:"",password:""},enable:!1},announcement:""},i18n={"zh-CN":{confirm:"确定",cancel:"取消",canceled:"已取消",fuckButton:"FuckTask按钮功能",verifyButton:"Verify按钮功能",joinButton:"Join按钮功能",removeButton:"Remove按钮功能",userInfoButton:"用户信息(可选)",otherButton:"其他功能",joinSteamGroup:"加组",leaveSteamGroup:"退组",addToWishlist:"添加至愿望单",removeFromWishlist:"从愿望单移除",followGame:"关注游戏",unfollowGame:"取关游戏",followCurator:"关注鉴赏家",unfollowCurator:"取关鉴赏家",followDeveloper:"关注开发商",unfollowDeveloper:"取关开发商",followPublisher:"关注发行商",unfollowPublisher:"取关发行商",joinDiscordServer:"加入Discord",leaveDiscordServer:"退出Discord",followIns:"关注Ins",unfollowIns:"取关Ins",likeAnnouncement:"点赞通知",visitLink:"访问链接",verifyTask:"验证任务",autoLogin:"自动登录",doTask:"做任务",showLogs:"默认显示日志",showDetails:"输出详细日志",checkLogin:"登录检测",checkLeft:"剩余key检测",autoOpen:"自动打开任务页面",autoCheckUpdate:"自动检测更新",reCaptcha:"人机验证修复",limitPoint:"点数限制",joinSteamGroupDes:"加入Steam组(Group)",leaveSteamGroupDes:"退出Steam组(Group)",addToWishlistDes:"添加游戏至愿望单(Wishlist)",removeFromWishlistDes:"从愿望单移除游戏(Wishlist)",followGameDes:"关注游戏(Follow game)",unfollowGameDes:"取关游戏(Unfollow game)",followCuratorDes:"关注鉴赏家(Curator)",unfollowCuratorDes:"取关鉴赏家(Curator)",followDeveloperDes:"关注开发商(Developer)",unfollowDeveloperDes:"取关开发商(Developer)",followPublisherDes:"关注发行商(Publisher)",unfollowPublisherDes:"取关发行商(Publisher)",joinDiscordServerDes:"加入Discord服务器(Discord Server)",leaveDiscordServerDes:"退出Discord服务器(Discord Server)",followInsDes:"关注Instagram用户",unfollowInsDes:"取关Instagram用户",likeAnnouncementDes:"点赞通知(Announcement)",visitLinkDes:"访问链接(Visit link)",verifyTaskDes:"验证任务",autoLoginDes:"自动登录，第一次需要手动登录（仅适用于freegamelottery网站）",doTaskDes:'依次做"MAIN DRAW","SURVEY DRAW","VIDEO DRAW","STACKPOT"等任务（仅适用于freegamelottery网站）',showLogsDes:"默认显示右下角任务日志",showDetailsDes:"浏览器控制台输出详细日志",checkLoginDes:"检测是否已登录，没登录则跳转到登录页面",checkLeftDes:"检测是否有剩余key，没有剩余key则提醒",autoOpenDes:"未完成的任务自动打开任务页面手动完成（需要关闭浏览器弹窗拦截）",autoCheckUpdateDes:"自动检测脚本最新版本",reCaptchaDes:"如果Gamehag网站人机验证出错，请尝试打开/关闭此选项",limitPointDes:"每个点数抽奖的最大允许点数,0为不限制（仅适用于opiumpulses网站）",websiteSetting:"%s 网站设置",selectAll:"全选",globalSetting:"全局设置",saveSetting:"保存设置",saveSuccess:"保存成功",saveError:"保存失败",resetSetting:"重置设置",resetSettingNotice:"是否重置所有设置?",resetSettingSuccess:"重置成功",resetSettingFailed:"重置失败",resetSettingCancel:"已取消重置",exportSetting:"导出配置",importSetting:"加载配置",processSetting:"正在处理设置...",function:"功能",description:"描述",option:"选项",enable:"启用",username:"用户名",password:"密码",usernameDes:"freegamelottery网站的用户名(用于自动登录)",passwordDes:"freegamelottery网站的密码(用于自动登录)",creatUrlFailed:"创建下载链接失败！",loadSetting:"加载设置文件",readSetting:"正在读取设置文件...",readSettingComplete:"设置文件读取完成！",readSettingFailed:"读取设置文件失败！",loadSettingComplete:"设置加载完成！",loadSettingFailed:"设置加载失败",notSupport:"当前浏览器不支持直接读取文件，已触发备用方案！",copySetting:"请将设置文件里的内容复制到下面！",loadSettingText:"正在加载设置...",settingTitle:'<a href="https://github.com/HCLonely/auto-task" target="_blank">自动任务脚本</a>设置',currentVersion:'当前版本: <a href="https://github.com/HCLonely/auto-task/tree/%s" target="_blank">V%s</a>',latestVersion:'最新版本: <a href="https://github.com/HCLonely/auto-task/raw/%s/auto-task-test.user.js" target="_blank">V<span id="latestVersion"></span></a>',loadVersionFailed:"获取失败",hotKeyButton:"快捷键",fuckKey:"FuckTask",verifyKey:"Verify",removeKey:"Remove",toggleLogKey:"显示/隐藏日志",fuckKeyDes:"<code>FuckTask</code>功能快捷键",verifyKeyDes:"<code>Verify</code>功能快捷键",removeKeyDes:"<code>Remove</code>功能快捷键",toggleLogKeyDes:"<code>显示/隐藏日志</code>快捷键"},en:{confirm:"OK",cancel:"Cancel",cancelled:"Cancelled",fuckButton:"FuckTask Button",verifyButton:"Verify Button",joinButton:"Join Button",removeButton:"Remove Button",otherButton:"Other",userInfoButton:"User info (optional)",joinSteamGroup:"joinSteamGroup",leaveSteamGroup:"leaveSteamGroup",addToWishlist:"addToWishlist",removeFromWishlist:"removeFromWishlist",followGame:"followGame",unfollowGame:"unfollowGame",followCurator:"followCurator",unfollowCurator:"unfollowCurator",followDeveloper:"followDeveloper",unfollowDeveloper:"unfollowDeveloper",followPublisher:"followPublisher",unfollowPublisher:"unfollowPublisher",joinDiscordServer:"joinDiscordServer",leaveDiscordServer:"leaveDiscordServer",followIns:"followIns",unfollowIns:"unfollowIns",likeAnnouncement:"likeAnnouncement",visitLink:"visitLink",verifyTask:"verifyTask",autoLogin:"autoLogin",doTask:"doTask",showLogs:"showLogs",showDetails:"showDetails",checkLogin:"checkLogin",checkLeft:"checkLeft",autoOpen:"autoOpen",autoCheckUpdate:"autoCheckUpdate",reCaptcha:"reCaptcha",limitPoint:"limitPoint",joinSteamGroupDes:"Join steam group.",leaveSteamGroupDes:"Leave steam group.",addToWishlistDes:"Add game to wishlist.",removeFromWishlistDes:"Remove game from wishlist.",followGameDes:"Follow game.",unfollowGameDes:"Unfollow game.",followCuratorDes:"Follow curator.",unfollowCuratorDes:"Unfollow curator.",followDeveloperDes:"Follow developer.",unfollowDeveloperDes:"Unfollow developer.",followPublisherDes:"Follow publisher.",unfollowPublisherDes:"Unfollow publisher.",joinDiscordServerDes:"Join discord server",leaveDiscordServerDes:"Leave discord server",followInsDes:"Follow Instagram users",unfollowInsDes:"Unfollow Instagram users",likeAnnouncementDes:"Like announcement.",visitLinkDes:"Visit link.",verifyTaskDes:"Verify tasks.",autoLoginDes:"Automatic login, manual login required for the first time (only for freegamelottery website).",doTaskDes:'Do "MAIN DRAW", "SURVEY DRAW", "VIDEO DRAW", and "STACKPOT" tasks in that order (only for freegamelottery website).',showLogsDes:"Show task log in bottom right corner by default.",showDetailsDes:"Output verbose logs to the console.",checkLoginDes:"Check if you are logged in, jump to login page if not logged in.",checkLeftDes:"Check if there are remaining keys, and remind if there are no remaining keys.",autoOpenDes:"Unfinished tasks automatically open the task page for manual completion (requires closing the browser pop-up block).",autoCheckUpdateDes:"Automatically check if the script is the latest version.",reCaptchaDes:"If the Gamehag website has an ergonomic error, try turning this option on/off",limitPointDes:"Maximum allowable points for each point draw, 0 is unlimited (only for opiumpulses website).",websiteSetting:"%s website settings",selectAll:"All",globalSetting:"Global settings",saveSetting:"Save",saveSuccess:"Saved successfully",saveError:"Saved failed",resetSetting:"Reset",resetSettingNotice:"Do you want to reset all settings?",resetSettingSuccess:"Reset succeeded",resetSettingFailed:"Reset failed",resetSettingCancel:"Canceled reset",exportSetting:"Export",importSetting:"Import",processSetting:"Processing settings...",function:"Function",description:"Description",option:"Option",enable:"Enable",username:"Username",password:"Password",usernameDes:"Username of freegamelottery website (for automatic login)",passwordDes:"Password of freegamelottery website (for automatic login)",creatUrlFailed:"Failed to create download link!",loadSetting:"Load settings file",readSetting:"Reading settings file...",readSettingComplete:"Setting file read completed!",readSettingFailed:"Failed to read the settings file!",loadSettingComplete:"Settings are loaded!",loadSettingFailed:"Failed to load settings",notSupport:"The current browser does not support reading files directly, an alternative has been triggered!",copySetting:"Please copy the contents of the settings file to the following",loadSettingText:"Loading settings...",settingTitle:'<a href="https://github.com/HCLonely/auto-task" target="_blank">Auto Task Script</a> Settings',currentVersion:'Current version: <a href="https://github.com/HCLonely/auto-task/tree/%s" target="_blank">V%s</a>, ',latestVersion:'Latest version: <a href="https://github.com/HCLonely/auto-task/raw/%s/auto-task-test.user.js" target="_blank">V<span id="latestVersion"></span></a>',loadVersionFailed:"Error",hotKeyButton:"Hot keys",fuckKey:"FuckTask",verifyKey:"Verify",removeKey:"Remove",toggleLogKey:"Show/Hide logs",fuckKeyDes:"Hot key for <code>FuckTask</code>.",verifyKeyDes:"Hot key for <code>Verify</code>.",removeKeyDes:"Hot key for <code>Remove</code>.",toggleLogKeyDes:"Hot key for <code>Show/Hide logs</code>."}};function getI18n(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:"";return i18n[language][e]?i18n[language][e].replace(/%s/g,t):"{{".concat(e,"}}")}function loadSettings(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:defaultConf,t=$("form").html("");$(".center").remove(),t.before('<h2 class="center">'.concat(getI18n("settingTitle"),'</h2><p class="center">').concat(getI18n("currentVersion",GM_info.script.version)+getI18n("latestVersion","master"),"</p>")),loadLatestVersion();for(var o=0,n=Object.entries(e);o<n.length;o++){var r=_slicedToArray(n[o],2),a=r[0],l=r[1],i="";if(["announcement"].includes(a)||null===l){var s='<div class="form-group row" style="display:none"><div class="col-sm-10"><input type="text" class="form-control" value="'.concat(l,'" name="').concat(a,'" id="').concat(a,'"></div></div>');t.append(s)}else{for(var c=0,u=Object.entries(l);c<u.length;c++){for(var f=_slicedToArray(u[c],2),d=f[0],g=f[1],p="",m=0,v=Object.entries(g);m<v.length;m++){var h=_slicedToArray(v[m],2),w=h[0],y=h[1];p+="\n<tr>\n  ".concat(""===p?'<th rowspan="'.concat("verify"===d?Object.keys(g).length:Object.keys(g).length+1,'">').concat(getI18n(d+"Button"),"</th>"):"","\n  <td>").concat(getI18n(w),"</td>\n  <td>").concat(getI18n(w+"Des"),"</td>\n  <td>").concat("boolean"==typeof y?'<div class="custom-control custom-'.concat("verify"===d?"radio":"checkbox",'"><input type="').concat("verify"===d?"radio":"checkbox",'" class="custom-control-input" name="').concat(a+"-"+d+"-"+w,'" id="').concat(a+"-"+d+"-"+w,'"').concat(y?' checked="checked"':"",'><label class="custom-control-label" for="').concat(a+"-"+d+"-"+w,'">').concat(getI18n("enable"),"</label></div>"):'<div class="form-group row"><div class="col-sm-10"><input type="text" class="form-control" value="'.concat(y,'" name="').concat(a+"-"+d+"-"+w,'" id="').concat(a+"-"+d+"-"+w,'"></div></div>'),"\n  </td>\n</tr>")}i+=p+(["fuck","remove","other","hotKey"].includes(d)?'<tr>\n  <td colspan="2"></td>\n  <td>\n  <div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input" name="'.concat(a+"-"+d+"-all",'" id="').concat(a+"-"+d+"-all",'"><label class="custom-control-label" for="').concat(a+"-"+d+"-all",'">').concat(getI18n("selectAll"),"</label></div>\n  </td>\n</tr>"):"")}var S='\n<table class="table table-bordered table-striped table-hover">\n  <thead>\n    <tr>\n      <th scope="col" colspan="4" class="table-header">\n        '.concat("global"===a?getI18n("globalSetting"):getI18n("websiteSetting",a),"\n        ").concat(void 0===l.enable?"":'<div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input" name="'.concat(a+"-enable",'" id="').concat(a+"-enable",'"').concat(l.enable?' checked="checked"':"",'><label class="custom-control-label" for="').concat(a+"-enable",'">').concat(getI18n("enable"),"</label></div>"),'\n      </th>\n    </tr>\n    <tr>\n      <th scope="col"></th>\n      <th scope="col">').concat(getI18n("function"),'</th>\n      <th scope="col">').concat(getI18n("description"),'</th>\n      <th scope="col">').concat(getI18n("option"),"</th>\n    </tr>\n  </thead>\n  <tbody>\n    ").concat(i,"\n  </tbody>\n</table>");t.append(S)}}return 0===$(".btn-group-vertical").length&&t.after('\n<div class="btn-group-vertical" role="group" aria-label="Basic example">\n  <button type="button" class="btn btn-primary" onclick="saveSetting()">'.concat(getI18n("saveSetting"),'</button>\n  <button type="button" class="btn btn-primary" onclick="resetSetting()">').concat(getI18n("resetSetting"),'</button>\n  <button type="button" class="btn btn-primary" onclick="exportConfig()">').concat(getI18n("exportSetting"),'</button>\n  <button type="button" class="btn btn-primary" onclick="importConfig()">').concat(getI18n("importSetting"),"</button>\n</div>")),$('input[name$="-all"]').unbind("click").click(function(e){var t=$(this).attr("name").replace("-all",""),o=$('input[name^="'+t+'"]');$(this).is(":checked")?o.prop("checked",!0):o.prop("checked",!1)}),$('input[name^="global-hotKey-"]').attr("readonly","readonly").unbind("keydown").keydown(function(e){var t="";e.altKey?t+="Alt + ":e.ctrlKey?t+="Ctrl + ":e.metaKey?t+="Meta + ":e.shiftKey&&(t+="Shift + "),$(this).val(t+(1===e.key.length?e.key.toUpperCase():""))}),$(".non-js").hide(),!0}function loadLatestVersion(){$.get("/version.json?t="+(new Date).getTime(),function(e,t,o){"success"===t?$("#latestVersion").text(e.version):$("#latestVersion").text(getI18n("loadVersionFiled"))},"json")}function exportConfig(){Swal.fire({title:getI18n("processSetting"),onBeforeOpen:function(){Swal.showLoading();var e=creatConfig(),t=new FileReader;t.onload=function(){$('<a href="'.concat(t.result,'" download="auto-task.conf.json" target="_blank"></a> '))[0].click(),Swal.close()},t.onerror=function(e){console.log(e),Swal.hideLoading(),Swal.update({icon:"error",title:getI18n("creatUrlFailed")})},t.readAsDataURL(new File([JSON.stringify(e,null,4)],"setting.conf.txt"))}})}function importConfig(){return _importConfig.apply(this,arguments)}function _importConfig(){return(_importConfig=_asyncToGenerator(regeneratorRuntime.mark(function e(){var t,o,n;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Swal.fire({title:"Select file",input:"file",inputAttributes:{accept:"json,txt"}});case 2:t=e.sent,(o=t.value)&&(Swal.fire({title:getI18n("readSetting")}),Swal.showLoading(),window.FileReader?((n=new FileReader).onload=function(){Swal.hideLoading(),Swal.update({icon:"success",title:getI18n("readSettingComplete")});try{GM_setValue("conf",JSON.parse(n.result)),loadSettings(JSON.parse(n.result)),Swal.update({icon:"success",title:getI18n("loadSettingComplete")})}catch(e){Swal.update({icon:"error",title:"".concat(getI18n("loadSettingFailed"),"！")}),console.log("".concat(getI18n("loadSettingFailed"),": "),e)}},n.onerror=function(e){console.log(e),Swal.hideLoading(),Swal.update({icon:"error",title:getI18n("readSettingFailed")})},n.readAsText(o)):(Swal.hideLoading(),Swal.update({icon:"warning",title:getI18n("notSupport"),confirmButtonText:getI18n("confirm"),cancelButtonText:getI18n("cancel"),showCancelButton:!0}).then(function(e){e.value&&Swal.fire({title:getI18n("copySetting"),icon:"info",input:"textarea",confirmButtonText:getI18n("confirm"),cancelButtonText:getI18n("cancel"),showCancelButton:!0}).then(function(e){var t=e.value;Swal.update({icon:"info",title:getI18n("loadSettingText")});try{GM_setValue("conf",JSON.parse(t)),loadSettings(JSON.parse(t)),Swal.update({icon:"success",title:getI18n("loadSettingComplete")})}catch(e){Swal.update({icon:"error",title:"".concat(getI18n("loadSettingFailed"),"！")}),console.log("".concat(getI18n("loadSettingFailed"),": "),e)}}).catch(function(e){Swal.update({icon:"info",title:getI18n("cancelled")})})})));case 5:case"end":return e.stop()}},e)}))).apply(this,arguments)}function creatConfig(){var e,t={},o=_createForOfIteratorHelper($("form").serializeArray());try{for(o.s();!(e=o.n()).done;){var n=e.value,r=n.name.split("-");switch(r.length){case 1:t[r[0]]="on"===n.value||n.value;break;case 2:t[r[0]]||(t[r[0]]={}),t[r[0]][r[1]]="on"===n.value||n.value;break;case 3:t[r[0]]||(t[r[0]]={}),t[r[0]][r[1]]||(t[r[0]][r[1]]={}),t[r[0]][r[1]][r[2]]="on"===n.value||n.value;break;default:console.warn("Unknown key: defaultConfig."+n.replace(/-/g,"."),defaultConf)}}}catch(e){o.e(e)}finally{o.f()}for(var a=0,l=Object.entries(defaultConf);a<l.length;a++){var i=_slicedToArray(l[a],2),s=i[0],c=i[1];if("[object Object]"===Object.prototype.toString.call(c))for(var u=0,f=Object.entries(c);u<f.length;u++){var d=_slicedToArray(f[u],2),g=d[0],p=d[1];if("[object Object]"===Object.prototype.toString.call(p))for(var m=0,v=Object.entries(p);m<v.length;m++){var h=_slicedToArray(v[m],2),w=h[0];h[1];t[s]||(t[s]={}),t[s][g]||(t[s][g]={}),t[s][g][w]||(t[s][g][w]=!1)}else t[s]||(t[s]={}),t[s][g]||(t[s][g]=!1)}else t[s]||(t[s]=!1)}return t}function saveSetting(){try{GM_setValue("conf",creatConfig()),Swal.fire({icon:"success",title:getI18n("saveSuccess")})}catch(e){console.log(e),Swal.fire({icon:"error",title:getI18n("saveError"),text:e.message})}}function resetSetting(){Swal.fire({icon:"warning",title:getI18n("resetSettingNotice"),confirmButtonText:getI18n("confirm"),cancelButtonText:getI18n("cancel"),showCancelButton:!0}).then(function(e){e.value?($("h2.center").remove(),loadSettings()&&Swal.update({icon:"success",title:getI18n("resetSettingSuccess"),showCancelButton:!1})):Swal.update({icon:"warning",title:getI18n("resetSettingCancel"),showCancelButton:!1})})}window.exportConfig=exportConfig,window.importConfig=importConfig,window.loadSettings=loadSettings,window.resetSetting=resetSetting,window.saveSetting=saveSetting;