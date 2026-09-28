// ==UserScript==
// @name               auto-task.min
// @namespace          auto-task.min
// @version            5.2.2
// @description        自动完成 Freeanywhere，Giveawaysu，GiveeClub，Givekey，Gleam，Indiedb，keyhub，OpiumPulses，Opquests，SweepWidget 等网站的任务。
// @description:en     Automatically complete the tasks of FreeAnyWhere, GiveawaySu, GiveeClub, Givekey, Gleam, Indiedb, keyhub, OpiumPulses, Opquests, SweepWidget websites.
// @author             HCLonely
// @license            MIT
// @run-at             document-start
// @homepage           https://auto-task-doc.js.org/
// @supportURL         https://github.com/HCLonely/auto-task/issues
// @updateURL          https://github.com/HCLonely/auto-task/raw/main/dist/auto-task.min.user.js
// @installURL         https://github.com/HCLonely/auto-task/raw/main/dist/auto-task.min.user.js
// @downloadURL        https://github.com/HCLonely/auto-task/raw/main/dist/auto-task.min.user.js
// @icon               https://auto-task.hclonely.com/favicon.ico
// @tag                games

// @include            *://freeanywhere.net/*
// @include            *://giveaway.su/giveaway/view/*
// @include            *://givee.club/*/event/*
// @include            *://givekey.ru/giveaway/*
// @include            *://www.indiedb.com/giveaways*
// @include            *://key-hub.eu/giveaway/*
// @include            *://keylol.com/*
// @include            *://www.opiumpulses.com/giveaways
// @include            *://prys.revadike.com/giveaway/?id=*
// @include            *://opquests.com/quests/*
// @include            *://gleam.io/*
// @include            *://sweepwidget.com/view/*
// @include            *://giveawayhopper.com/c/*
// @include            *://freeru.cc/en/games/giveaways/games/*

// @include            *://www.twitch.tv/*
// @include            *://twitch.tv/*
// @include            *://www.youtube.com/*
// @include            *://m.youtube.com/*
// @include            *://*.reddit.com/*
// @include            *://twitter.com/settings/account?k*
// @include            *://x.com/settings/account*
// @include            *://steamcommunity.com/*
// @include            *://store.steampowered.com/*

// @include            *://give.gamesforfarm.local/*
// @include            *://gamesforfarm-testing.ru/*
// @include            *://mee6.xyz/*
// @include            *://gamesforfarm.com/*

// @include            https://auto-task.hclonely.com/setting.html
// @include            https://auto-task.hclonely.com/history.html
// @include            https://auto-task-doc.js.org/setting.html
// @include            https://auto-task-doc.js.org/history.html

// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_listValues
// @grant              GM_deleteValue
// @grant              GM_addStyle
// @grant              GM_xmlhttpRequest
// @grant              GM_registerMenuCommand
// @grant              GM_info
// @grant              GM_openInTab
// @grant              GM_setClipboard
// @grant              GM_getResourceText
// @grant              GM_cookie
// @grant              GM_addValueChangeListener
// @grant              GM_removeValueChangeListener
// @grant              unsafeWindow
// @grant              window.close
// @grant              window.localStorage
// @grant              window.sessionStorage
// @grant              window.focus

// @connect            login.vk.com
// @connect            web.api.vk.com
// @connect            web.api.vk.ru
// @connect            vk.ru
// @connect            auto-task.hclonely.com
// @connect            auto-task-doc.js.org
// @connect            cdn.jsdelivr.net
// @connect            store.steampowered.com
// @connect            steamcommunity.com
// @connect            login.steampowered.com
// @connect            twitter.com
// @connect            x.com
// @connect            abs.twimg.com
// @connect            api.twitter.com
// @connect            youtube.com
// @connect            www.youtube.com
// @connect            facebook.com
// @connect            instagram.com
// @connect            vk.com
// @connect            twitch.tv
// @connect            www.twitch.tv
// @connect            gql.twitch.tv
// @connect            github.com
// @connect            www.reddit.com
// @connect            oauth.reddit.com
// @connect            raw.githubusercontent.com
// @connect            t.me
// @connect            bit.ly
// @connect            giveaway.su
// @connect            google.com
// @connect            www.vloot.io
// @connect            givee.club
// @connect            gleam.io
// @connect            www.indiedb.com
// @connect            key-hub.eu
// @connect            opquests.com
// @connect            itch.io
// @connect            auto-task.hclonely.com
// @connect            giveawayhopper.com
// @connect            freeanywhere.net
// @connect            *

// @require            https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require            https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js
// @require            https://cdn.jsdelivr.net/npm/js-sha1@0.6.0/src/sha1.min.js
// @require            https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.js
// @resource           autoTaskStyle https://cdn.jsdelivr.net/gh/HCLonely/auto-task@v5.2.2/dist/auto-task.css
// @resource           style https://cdn.jsdelivr.net/npm/sweetalert2@11.3.5/dist/sweetalert2.min.css
// @require            https://cdn.jsdelivr.net/npm/keyboardjs@2.6.4/dist/keyboard.min.js
// @require            https://cdn.jsdelivr.net/npm/dayjs@1.10.7/dayjs.min.js
// @require            https://cdn.jsdelivr.net/gh/tinygo-org/tinygo@3e60eeb368f25f237a512e7553fd6d70f36dc74c/targets/wasm_exec.min.js
// @require            https://cdn.jsdelivr.net/npm/node-inspect-extracted@3.1.0/dist/inspect.min.js
// @require            https://cdn.jsdelivr.net/npm/browser-tool@1.3.2/dist/browser.min.js
// @require            https://github.com/HCLonely/auto-task/raw/main/dist/auto-task.modules.js
// @require            https://github.com/HCLonely/auto-task/raw/main/dist/auto-task.website.js

// @noframes
// ==/UserScript==

console.log('%c%s', 'color:blue', 'Auto-Task[Load]: 脚本开始加载');

/*
 * @Author       : HCLonely
 * @Date         : 2025-06-15 14:59:17
 * @LastEditTime : 2025-08-18 19:05:01
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/checkDependence.js
 * @Description  :
 */
const neededDependencies = ['jQuery', 'Cookies', 'sha1', 'Swal', 'keyboardJS', 'dayjs', 'Go', 'util', 'browser'];

const missingDependencies = neededDependencies.filter(dependency => typeof window[dependency] === 'undefined');
if (typeof AutoTaskModules === 'undefined') missingDependencies.push('AutoTaskModules');
if (typeof AutoTaskWebsite === 'undefined') missingDependencies.push('AutoTaskWebsite');

if (missingDependencies.length > 0) {
  console.log('%c%s', 'color:red', `[Auto-Task] 脚本加载失败，缺少的依赖：${missingDependencies.join(', ')}`);
  if (confirm(`[Auto-Task] 脚本依赖加载失败，请刷新重试或安装全依赖版本，是否前往安装全依赖版本？\n缺少的依赖：${missingDependencies.join(', ')}`)) {
    GM_openInTab('https://github.com/HCLonely/auto-task/raw/main/dist/auto-task.min.all.user.js', { active: true });
  }
}


function t(t,o){return b(t)||e(t,o)||l(t,o)||u()}function e(t,e){var o=null==t?null:'undefined'!=typeof Symbol&&t[Symbol.iterator]||t['@@iterator'];if(null!=o){var n,a,s,r,i=[],u=!0,l=!1;try{if(s=(o=o.call(t)).next,0===e){if(Object(o)!==o){return}u=!1}else{for(;!(u=(n=s.call(o)).done)&&(i.push(n.value),i.length!==e);u=!0){}}}catch(t){l=!0,a=t}finally{try{if(!u&&null!=o.return&&(r=o.return(),Object(r)!==r)){return}}finally{if(l){throw a}}}return i}}function o(t,e){var o=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),o.push.apply(o,n)}return o}function n(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?o(Object(n),!0).forEach((function(e){a(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function a(t,e,o){return(e=s(e))in t?Object.defineProperty(t,e,{value:o,enumerable:!0,configurable:!0,writable:!0}):t[e]=o,t}function s(t){var e=r(t,'string');return'symbol'==typeof e?e:e+''}function r(t,e){if('object'!=typeof t||!t){return t}var o=t[Symbol.toPrimitive];if(void 0!==o){var n=o.call(t,e||'default');if('object'!=typeof n){return n}throw new TypeError('@@toPrimitive must return a primitive value.')}return('string'===e?String:Number)(t)}function i(t){return b(t)||d(t)||l(t)||u()}function u(){throw new TypeError('Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.')}function l(t,e){if(t){if('string'==typeof t){return c(t,e)}var o={}.toString.call(t).slice(8,-1);return'Object'===o&&t.constructor&&(o=t.constructor.name),'Map'===o||'Set'===o?Array.from(t):'Arguments'===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?c(t,e):void 0}}function c(t,e){(null==e||e>t.length)&&(e=t.length);for(var o=0,n=Array(e);o<e;o++){n[o]=t[o]}return n}function d(t){if('undefined'!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t['@@iterator']){return Array.from(t)}}function b(t){if(Array.isArray(t)){return t}}!function(e,o,a,s,r,u,l,c,d,b,g,p,f,h,w,y){'use strict';const m=/token|auth|session|jwt|key|secret|api[-_]?key|bearer|authorization|access[-_]?token|refresh[-_]?token|sid/i,v=[/([A-Za-z0-9-_]{10,})\.([A-Za-z0-9-_]{10,})\.([A-Za-z0-9-_]{10,})/g,/(Bearer|Basic)\s+([A-Za-z0-9\-._~+/]+=*)/gi,/\b([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\b/gi,/\b(eyJ[A-Za-z0-9\-_]+)\b/g],k=t=>{if(Array.isArray(t)){return t.map(k)}if(t&&'object'==typeof t){const o={};for(const n in t){m.test(n)&&'string'==typeof t[n]?o[n]='string'!=typeof(e=t[n])||e.length<8?e:e.replace(/^([A-Za-z0-9\-_+/=]{4})[A-Za-z0-9\-_+/=]+([A-Za-z0-9\-_+/=]{4})$/,'$1***$2'):o[n]=k(t[n])}return o}var e;return'string'==typeof t&&t.length>8?T(t):t},T=t=>{let e=t;for(const t of v){e=e.replace(t,(function(t){for(var e=arguments.length,o=new Array(e>1?e-1:0),n=1;n<e;n++){o[n-1]=arguments[n]}return o.length>=3&&t.includes('.')?o.map((t=>t.length>8?''.concat(t.slice(0,4),'***').concat(t.slice(-4)):t)).join('.'):t.length>8?''.concat(t.slice(0,4),'***').concat(t.slice(-4)):t}))}return e},S=()=>{const t=console.log;window.__allLogs=window.__allLogs||[],console.log=function(){for(var e=arguments.length,o=new Array(e),n=0;n<e;n++){o[n]=arguments[n]}const a=(t=>t.map((t=>'string'==typeof t?T(t):'object'==typeof t&&null!==t?k(t):t)))(o);window.__allLogs.push(a),t.apply(console,a)}},A=()=>{p.debug('开始获取运行日志');const t=$('#auto-task-info>li'),e=t.length>0?$.makeArray(t).map((t=>t.innerText)).join('\n'):'';return p.debug('运行日志获取完成',{logsLength:e.length}),e},O=async(t,e,o)=>{p.debug('开始生成GitHub Issue链接');const n=new URLSearchParams(await(async(t,e,o)=>{p.debug('开始构建GitHub Issue参数',{name:t,errorStackLength:e.length});const n={title:'[BUG] 脚本报错: '.concat(t),labels:'bug',template:'bug_report.yml',website:o.website,browser:o.browser,manager:o.manager,'user-script':o.userScript,logs:e||'','run-logs':''},a=window.__allLogs.join('\n');return await GM_setClipboard(a),p.debug('GitHub Issue参数构建完成',n),n})(t,e,o)),a='https://github.com/HCLonely/auto-task/issues/new?'.concat(n.toString());return p.debug('GitHub Issue链接生成完成',{link:a}),a};async function _(t,e){p.debug('开始处理错误',{name:e,error:t}),window.TRACE&&(p.debug('启用跟踪模式'),console.trace('%cAuto-Task[Trace]:','color:blue'));const n=t.stack||'';((t,e)=>{p.debug('记录错误日志',{name:t}),console.log('%c%s','color:white;background:red','Auto-Task[Error]: '.concat(t,'\n').concat(e))})(e,n),p.debug('获取环境信息');const a=await(async()=>{p.debug('开始获取环境信息');const t={website:window.location.href,browser:JSON.stringify(await g.getInfo(),null,2),manager:''.concat(GM_info.scriptHandler,' ').concat(GM_info.version),userScript:GM_info.script.version,logs:'',runLogs:A()};return p.debug('环境信息获取完成',t),t})();a.logs=n,p.debug('显示错误报告对话框');(await o.fire({title:c.default('errorReport'),icon:'error',showCancelButton:!0,confirmButtonText:c.default('toGithub'),cancelButtonText:c.default('close')})).isConfirmed?(p.debug('用户确认提交错误报告'),await(async(t,e,o,n)=>{p.debug('开始处理错误报告',{platform:t,name:e});{const t=await O(e,o,n);p.debug('打开GitHub Issue链接',{githubLink:t}),GM_openInTab(t,{active:!0})}})('github',e,n,a),o.fire({title:c.default('logCopied'),icon:'success',showConfirmButton:!1,showCancelButton:!0,cancelButtonText:c.default('close')})):p.debug('用户取消提交错误报告')}const G=(t,e)=>{p.debug('开始处理响应数据',{responseType:e.responseType});const o=(t=>{p.debug('开始解析HTTP头',{headerString:t});const e={};return t?(t.split('\n').forEach((t=>{const o=i(t.trim().split(':')),n=o[0],a=o.slice(1).join(':').trim();n&&a&&(e[n]?e[n]=Array.isArray(e[n])?[...e[n],a]:[e[n],a]:e[n]=a)})),e['set-cookie']&&!Array.isArray(e['set-cookie'])&&(e['set-cookie']=[e['set-cookie']]),p.debug('HTTP头解析完成',{headers:e}),e):(p.debug('HTTP头为空，返回空对象'),e)})(t.responseHeaders);if(t.responseHeadersText=t.responseHeaders,t.responseHeaders=o,t.finalUrl=o.location||t.finalUrl,p.debug('响应头处理完成',{finalUrl:t.finalUrl}),'json'===e.responseType&&null!=t&&t.response&&'object'!=typeof t.response){p.debug('尝试解析JSON响应');try{t.response=JSON.parse(t.responseText),p.debug('JSON解析成功')}catch(t){p.debug('JSON解析失败，保持原始响应')}}},j=async function(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;p.debug('开始HTTP请求',{url:t.url,method:t.method,retryTimes:e}),window.TRACE&&console.trace('%cAuto-Task[Trace]:','color:blue');try{const o=await new Promise((e=>{const o=n(n({fetch:!0,timeout:3e4,ontimeout:o=>{p.debug('请求超时',{url:t.url}),e({result:'Error',statusText:'Timeout',status:601,data:o,options:t})},onabort:()=>{p.debug('请求被中止',{url:t.url}),e({result:'Error',statusText:'Aborted',status:602,data:void 0,options:t})},onerror:o=>{p.debug('请求发生错误',{url:t.url,error:o}),e({result:'Error',statusText:'Error',status:603,data:o,options:t})},onload:o=>{p.debug('请求加载完成',{url:t.url,status:o.status}),G(o,t),e({result:'Success',statusText:'Load',status:600,data:o,options:t})}},t),{},{responseType:t.dataType||t.responseType});p.debug('发送请求',{requestObj:o}),GM_xmlhttpRequest(o)}));return window.DEBUG&&console.log('%cAuto-Task[httpRequest]:','color:blue',o),600!==o.status&&e<2?(p.debug('请求失败，准备重试',{status:o.status,retryTimes:e+1}),await j(t,e+1)):(p.debug('请求完成',{status:o.status,result:o.result}),o)}catch(e){return p.debug('请求发生JavaScript错误',{error:e}),console.log('%cAuto-Task[httpRequest]:','color:red',JSON.stringify({errorMsg:e,options:t})),_(e,'httpRequest'),{result:'JsError',statusText:'Error',status:604,error:e,options:t}}},M={github:'https://github.com/HCLonely/auto-task/raw/main/',jsdelivr:'https://cdn.jsdelivr.net/gh/HCLonely/auto-task@main/',standby:'https://auto-task.hclonely.com/'},L=async(t,e)=>{try{var o;p.debug('开始检查更新',{updateLink:t,auto:e});const a=''.concat(t,'package.json?time=').concat(Date.now());p.debug('构建检查URL',{checkUrl:a});const s=await j({url:a,responseType:'json',method:'GET',timeout:3e4}),r=s.result,i=s.statusText,u=s.status,l=s.data;if('Success'===r&&null!=l&&null!==(o=l.response)&&void 0!==o&&o.version){return p.debug('成功获取更新信息',{version:l.response.version}),l.response}if(e){p.debug('自动检查更新失败',{result:r,statusText:i,status:u})}else{var n;const t=null!=l&&null!==(n=l.response)&&void 0!==n&&n.version?''.concat(c.default('checkUpdateFailed'),'[').concat(null==l?void 0:l.statusText,'(').concat(null==l?void 0:l.status,')]'):''.concat(c.default('checkUpdateFailed'),'[').concat(r,':').concat(i,'(').concat(u,')]');p.debug('检查更新失败',{errorMessage:t}),f.default({}).error(t)}return!1}catch(t){return p.debug('检查更新发生错误',{error:t}),_(t,'checkUpdate'),!1}},x=t=>{p.debug('获取更新链接',{updateSource:t});const e=t.toLowerCase(),o=M[e]||M.github;return p.debug('选择的更新链接',{source:e,link:o}),o},P=(o,n,a)=>{if(p.debug('准备显示更新信息',{currentVersion:n,newVersion:o.version}),((o,n)=>{try{p.debug('开始比较版本号',{currentVersion:o,remoteVersion:n});const a=t(o.split('-'),1)[0],s=t(n.split('-'),2),r=s[0],i=s[1];if(i&&!e.globalOptions.other.receivePreview){return p.debug('不接收预览版本',{isPreview:i}),!1}const u=a.split('.').map(Number),l=r.split('.').map(Number);p.debug('版本号解析',{currentVersionParts:u,remoteVersionParts:l});for(let t=0;t<3;t++){if(l[t]>u[t]){return p.debug('发现新版本',{position:t,current:o,remote:n}),!0}if(l[t]<u[t]){return p.debug('远程版本较旧',{position:t,current:o,remote:n}),!1}}return p.debug('版本号相同'),!1}catch(t){return p.debug('比较版本号时发生错误',{error:t}),_(t,'compareVersion'),!1}})(n,o.version)){var s,r;const t=''.concat(a,'dist/').concat(GM_info.script.name,'.user.js');p.debug('发现新版本，显示更新通知',{scriptUrl:t}),f.default({html:'<li><font>'.concat(c.default('newVersionNotice',o.version,t),'</font></li>')});const e=(null===(s=o.change)||void 0===s?void 0:s.map((t=>'<li>'.concat(t,'</li>'))).join(''))||'';p.debug('显示更新日志',{changeListLength:null===(r=o.change)||void 0===r?void 0:r.length}),f.default({html:'<li>'.concat(c.default('updateText',o.version),'</li><ol class="update-text">').concat(e,'<li>').concat(c.default('updateHistory'),'</li></ol>')})}else{p.debug('当前已是最新版本')}};try{S()}catch(t){console.error('Auto-Task[Warning]: consoleLogHook 初始化失败',t)}try{const t=GM_getResourceText('autoTaskStyle');if(null==t||!t.trim()){throw new Error('Auto-Task CSS resource is empty')}window.STYLE=GM_addStyle(t+GM_getResourceText('style'))}catch(t){throw console.error('Auto-Task[Error]: 样式初始化失败，请重新安装脚本或使用全资源版本 (.all.user.js)',t),t}window.DEBUG=!(null===(w=e.globalOptions.other)||void 0===w||!w.debug),window.TRACE=!(null===(y=e.globalOptions.other)||void 0===y||!y.debug)&&'function'==typeof console.trace;const B=async()=>{let n;p.debug('主程序入口 loadScript 开始');for(const t of u.Websites){if(t.test()){p.debug('识别到支持的网站',{website:t.name}),n=new t;break}}if(!n){return p.debug('未识别到支持的网站，脚本停止加载'),void console.log('%c%s','color:#ff0000','Auto-Task[Warning]: 脚本停止加载，当前网站不支持！')}n.before&&(p.debug('执行网站 before 钩子'),await n.before()),(t=>{p.debug('初始化UI元素',{website:t.name}),$('body').append('\n    <div id="auto-task-info"\n        style="display:'.concat(e.globalOptions.other.defaultShowLog?'block':'none',';\n                ').concat(e.globalOptions.position.logSideX,':').concat(e.globalOptions.position.logDistance.split(',')[0],'px;\n                ').concat(e.globalOptions.position.logSideY,':').concat(e.globalOptions.position.logDistance.split(',')[1],'px;\n                opacity: 0;\n                animation: fadeInUp 0.6s ease forwards;">\n    </div>\n    <div id="auto-task-buttons"\n        style="display:').concat(e.globalOptions.other.defaultShowButton?'block':'none',';\n                ').concat(e.globalOptions.position.buttonSideX,':').concat(e.globalOptions.position.buttonDistance.split(',')[0],'px;\n                ').concat(e.globalOptions.position.buttonSideY,':').concat(e.globalOptions.position.buttonDistance.split(',')[1],'px;\n                opacity: 0;\n                animation: fadeInUp 0.6s ease 0.2s forwards;">\n    </div>\n    <div class="show-button-div"\n        style="display:').concat(e.globalOptions.other.defaultShowButton?'none':'block',';\n                ').concat(e.globalOptions.position.showButtonSideX,':').concat(e.globalOptions.position.showButtonDistance.split(',')[0],'px;\n                ').concat(e.globalOptions.position.showButtonSideY,':').concat(e.globalOptions.position.showButtonDistance.split(',')[1],'px;\n                opacity: 0;\n                animation: fadeInScale 0.5s ease 0.4s forwards;">\n      <a class="auto-task-website-btn show-button-link"\n        href="javascript:void(0);"\n        target="_self"\n        title="').concat(c.default('showButton'),'">\n      </a>\n    </div>\n  '));const o=$('#auto-task-info'),n=$('#auto-task-buttons'),a=$('div.show-button-div');if(a.on('click',(()=>{n.show(),a.hide()})),t.buttons&&0===n.children().length){n.addClass(''.concat(t.name,'-buttons'));for(const e of t.buttons){if(t[e]){const o=$('<p><a class="auto-task-website-btn '.concat(t.name,'-button" href="javascript:void(0);" target="_self">').concat(c.default(e),'</a></p>'));o.find('a.auto-task-website-btn').on('click',(()=>{t[e]()})),n.append(o)}}}const s=$('<p><a class="auto-task-website-btn '.concat(t.name,'-button" href="javascript:void(0);" target="_self">').concat(c.default('hideButton'),'</a></p>'));s.find('a.auto-task-website-btn').on('click',(()=>{n.hide(),a.show()}));const r=$('<p><a id="toggle-log" class="auto-task-website-btn '.concat(t.name,'-button" href="javascript:void(0);" target="_self" data-status="').concat(e.globalOptions.other.defaultShowLog?'show':'hide','">').concat(e.globalOptions.other.defaultShowLog?c.default('hideLog'):c.default('showLog'),'</a></p>'));r.find('a.auto-task-website-btn').on('click',(()=>{const t=$('#toggle-log');'show'===t.attr('data-status')?(o.hide(),t.attr('data-status','hide').text(c.default('showLog'))):(o.show(),t.attr('data-status','show').text(c.default('hideLog')))})),n.append(s).append(r),t.options&&GM_registerMenuCommand(c.default('changeWebsiteOptions'),(()=>{l.default(t.name,t.options)}))})(n),(t=>{p.debug('初始化热键',{website:t.name}),b.bind(e.globalOptions.hotKey.doTaskKey,(()=>{t.doTask&&t.doTask()})),b.bind(e.globalOptions.hotKey.undoTaskKey,(()=>{t.undoTask&&t.undoTask()})),b.bind(e.globalOptions.hotKey.toggleLogKey,(()=>{const t=$('#toggle-log'),e=t.attr('data-status'),o=$('#auto-task-info');'show'===e?(o.hide(),t.attr('data-status','hide').text(c.default('showLog'))):(o.show(),t.attr('data-status','show').text(c.default('hideLog')))}))})(n),n.after&&(p.debug('执行网站 after 钩子'),await n.after()),'Setting'!==n.name&&(p.debug('注册全局菜单命令'),GM_registerMenuCommand(c.default('changeGlobalOptions'),(()=>{d.changeGlobalOptions('swal')})),GM_registerMenuCommand(c.default('settingPage'),(()=>{GM_openInTab('https://auto-task.hclonely.com/setting.html',{active:!0})}))),p.debug('脚本加载完成'),console.log('%c%s','color:#1bbe1a','Auto-Task[Load]: 脚本加载完成'),window.DEBUG&&f.default({}).warning(c.default('debugModeNotice')),await(async()=>{if(p.debug('检查Steam ASF状态'),!e.globalOptions.ASF.AsfEnabled||!e.globalOptions.ASF.AsfIpcUrl||!e.globalOptions.ASF.AsfIpcPassword){return}const t=GM_getValue('stopPlayTime',0)||0;if(0===t||t>=Date.now()){return}const n=Math.floor((Date.now()-t)/6e4);if(!(await o.fire({title:c.default('stopPlayTimeTitle'),text:c.default('stopPlayTimeText',n.toString()),icon:'warning',confirmButtonText:c.default('confirm'),cancelButtonText:c.default('cancel'),showCancelButton:!0})).value){return}let a=new h.default(e.globalOptions.ASF);try{if(!await a.init()){return}if(!await a.stopPlayGames()){return}const t=GM_getValue('taskLink',[])||[];for(const e of t){GM_openInTab(e,{active:!0})}GM_setValue('stopPlayTime',0),GM_setValue('playedGames',[]),GM_setValue('taskLink',[])}catch(t){console.error('SteamASF operation failed:',t)}finally{var s;null===(s=a)||void 0===s||s.dispose(),a=null}})(),(()=>{p.debug('检查版本和通知');const e=GM_info.scriptHandler;if('Tampermonkey'===e){var n;const e=t((null===(n=GM_info.version)||void 0===n?void 0:n.split('.'))||[],2),o=e[0],a=e[1];parseInt(o,10)>=5&&parseInt(a,10)>=2||f.default({}).error(c.default('versionNotMatched'))}else{if('Violentmonkey'===e){return p.debug('未知脚本管理器',{scriptHandler:e}),void f.default({}).warning(c.default('unknownScriptHandler'))}{var a;const e=t((null===(a=GM_info.version)||void 0===a?void 0:a.split('.'))||[],2),o=e[0],n=e[1];parseInt(o,10)>=2&&parseInt(n,10)>=36||f.default({}).error(c.default('versionNotMatched'))}}var s;GM_getValue('notice')||(o.fire({title:c.default('swalNotice'),icon:'warning'}).then((()=>{GM_openInTab(c.default('noticeLink'),{active:!0}),GM_setValue('notice',(new Date).getTime())})),null===(s=f.default({html:'<li><font class="warning">'.concat(c.default('echoNotice',c.default('noticeLink')),'</font></li>')}).font)||void 0===s||s.find('a').on('click',(()=>{GM_setValue('notice',(new Date).getTime())})))})(),(async()=>{try{p.debug('开始检查更新流程');const t=GM_info.script.version,o=e.globalOptions.other.autoUpdateSource;p.debug('当前配置',{currentVersion:t,updateSource:o});let n=!1;if(['github','jsdelivr','standby'].includes(o.toLowerCase())){p.debug('使用指定的更新源',{updateSource:o});const t=x(o);n=await L(t,!1)}else{p.debug('按优先级尝试不同的更新源');for(const t of['github','jsdelivr','standby']){if(p.debug('尝试更新源',{source:t}),n=await L(M[t],!0),n){p.debug('成功获取更新信息',{source:t});break}}}if(!n){return p.debug('所有更新源检查失败'),void f.default({}).error(c.default('checkUpdateFailed'))}P(n,t,x(o))}catch(t){p.debug('更新检查过程发生错误',{error:t}),_(t,'updateChecker')}})()},E=async()=>{try{if(await a.handleSteamAuthPage({namespace:r.moduleNamespace('steam'),gm:r.projectGM('steam')})){return}if(await s.handleTwitchAuthPage({namespace:r.moduleNamespace('twitch'),gm:r.projectGM('twitch')})){return}'key-hub.eu'===window.location.hostname&&(unsafeWindow.keyhubtracker=1,unsafeWindow.gaData={}),await B()}catch(t){p.debug('主程序入口发生异常',{error:t})}};'opquests.com'===window.location.hostname?E():$(E)}(AutoTaskWebsite.globalOptions,Swal,AutoTaskModules.steam,AutoTaskModules.twitch,AutoTaskWebsite.moduleBridge,AutoTaskWebsite,AutoTaskWebsite.options,AutoTaskWebsite.i18n,AutoTaskWebsite.globalOptionsEdit,keyboardJS,browser,AutoTaskWebsite.debug,AutoTaskWebsite.echoLog,AutoTaskWebsite.SteamASF);
