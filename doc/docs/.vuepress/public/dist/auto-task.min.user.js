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
// @require            https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.js
// @resource           autoTaskStyle https://cdn.jsdelivr.net/gh/HCLonely/auto-task@v5.2.2/dist/auto-task.css
// @resource           style https://cdn.jsdelivr.net/npm/sweetalert2@11.3.5/dist/sweetalert2.min.css
// @require            https://cdn.jsdelivr.net/npm/node-inspect-extracted@3.1.0/dist/inspect.min.js
// @require            https://cdn.jsdelivr.net/npm/browser-tool@1.3.2/dist/browser.min.js
// @require            https://cdn.jsdelivr.net/gh/HCLonely/auto-task@v5.2.2/dist/auto-task.modules.js
// @require            https://cdn.jsdelivr.net/gh/HCLonely/auto-task@v5.2.2/dist/auto-task.website.js

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
const neededDependencies = ['jQuery', 'Swal', 'util', 'browser'];

const missingDependencies = neededDependencies.filter(dependency => typeof window[dependency] === 'undefined');
if (typeof AutoTaskModules === 'undefined') missingDependencies.push('AutoTaskModules');
if (typeof AutoTaskWebsite === 'undefined') missingDependencies.push('AutoTaskWebsite');

if (missingDependencies.length > 0) {
  console.log('%c%s', 'color:red', `[Auto-Task] 脚本加载失败，缺少的依赖：${missingDependencies.join(', ')}`);
  if (confirm(`[Auto-Task] 脚本依赖加载失败，请刷新重试或安装全依赖版本，是否前往安装全依赖版本？\n缺少的依赖：${missingDependencies.join(', ')}`)) {
    GM_openInTab('https://github.com/HCLonely/auto-task/raw/main/dist/auto-task.min.all.user.js', { active: true });
  }
}


function t(t,e){var o=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),o.push.apply(o,n)}return o}function e(e){for(var n=1;n<arguments.length;n++){var a=null!=arguments[n]?arguments[n]:{};n%2?t(Object(a),!0).forEach((function(t){o(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):t(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(t,e,o){return(e=n(e))in t?Object.defineProperty(t,e,{value:o,enumerable:!0,configurable:!0,writable:!0}):t[e]=o,t}function n(t){var e=a(t,'string');return'symbol'==typeof e?e:e+''}function a(t,e){if('object'!=typeof t||!t){return t}var o=t[Symbol.toPrimitive];if(void 0!==o){var n=o.call(t,e||'default');if('object'!=typeof n){return n}throw new TypeError('@@toPrimitive must return a primitive value.')}return('string'===e?String:Number)(t)}function s(t){return p(t)||r(t)||u(t)||l()}function r(t){if('undefined'!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t['@@iterator']){return Array.from(t)}}function i(t,e){return p(t)||d(t,e)||u(t,e)||l()}function l(){throw new TypeError('Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.')}function u(t,e){if(t){if('string'==typeof t){return c(t,e)}var o={}.toString.call(t).slice(8,-1);return'Object'===o&&t.constructor&&(o=t.constructor.name),'Map'===o||'Set'===o?Array.from(t):'Arguments'===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?c(t,e):void 0}}function c(t,e){(null==e||e>t.length)&&(e=t.length);for(var o=0,n=Array(e);o<e;o++){n[o]=t[o]}return n}function d(t,e){var o=null==t?null:'undefined'!=typeof Symbol&&t[Symbol.iterator]||t['@@iterator'];if(null!=o){var n,a,s,r,i=[],l=!0,u=!1;try{if(s=(o=o.call(t)).next,0===e){if(Object(o)!==o){return}l=!1}else{for(;!(l=(n=s.call(o)).done)&&(i.push(n.value),i.length!==e);l=!0){}}}catch(t){u=!0,a=t}finally{try{if(!l&&null!=o.return&&(r=o.return(),Object(r)!==r)){return}}finally{if(u){throw a}}}return i}}function p(t){if(Array.isArray(t)){return t}}!function(t,o,n,a,r,l,u,c,d,p,g,b,f,h,w){'use strict';const m=/token|auth|session|jwt|key|secret|api[-_]?key|bearer|authorization|access[-_]?token|refresh[-_]?token|sid/i,y=[/([A-Za-z0-9-_]{10,})\.([A-Za-z0-9-_]{10,})\.([A-Za-z0-9-_]{10,})/g,/(Bearer|Basic)\s+([A-Za-z0-9\-._~+/]+=*)/gi,/\b([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\b/gi,/\b(eyJ[A-Za-z0-9\-_]+)\b/g],v=t=>{if(Array.isArray(t)){return t.map(v)}if(t&&'object'==typeof t){const o={};for(const n in t){m.test(n)&&'string'==typeof t[n]?o[n]='string'!=typeof(e=t[n])||e.length<8?e:e.replace(/^([A-Za-z0-9\-_+/=]{4})[A-Za-z0-9\-_+/=]+([A-Za-z0-9\-_+/=]{4})$/,'$1***$2'):o[n]=v(t[n])}return o}var e;return'string'==typeof t&&t.length>8?k(t):t},k=t=>{let e=t;for(const t of y){e=e.replace(t,(function(t){for(var e=arguments.length,o=new Array(e>1?e-1:0),n=1;n<e;n++){o[n-1]=arguments[n]}return o.length>=3&&t.includes('.')?o.map((t=>t.length>8?''.concat(t.slice(0,4),'***').concat(t.slice(-4)):t)).join('.'):t.length>8?''.concat(t.slice(0,4),'***').concat(t.slice(-4)):t}))}return e},T=()=>{const t=console.log;window.__allLogs=window.__allLogs||[],console.log=function(){for(var e=arguments.length,o=new Array(e),n=0;n<e;n++){o[n]=arguments[n]}const a=(t=>t.map((t=>'string'==typeof t?k(t):'object'==typeof t&&null!==t?v(t):t)))(o);window.__allLogs.push(a),t.apply(console,a)}},S=function(t,e){let o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:document;const n=t.toLowerCase().trim().replace(/\+\s*\+$/,'+ plus'),a=('+'===n?['plus']:n.split(/\s*\+\s*/)).map((t=>t.trim())),s={control:'ctrl',command:'meta',cmd:'meta',option:'alt',esc:'escape',space:' ',plus:'+'},r=a.map((t=>s[t]||t)),l=['alt','ctrl','shift','meta'],u=r.filter((t=>!l.some((e=>e===t))));if(1!==u.length||!u[0]){return()=>{}}const c=i(u,1)[0],d=t=>{if(t.repeat||t.isComposing){return}if(l.some((e=>t[''.concat(e,'Key')]!==r.includes(e)))){return}(/^[a-z]$/.test(c)&&/^Key[A-Z]$/.test(t.code)?t.code.slice(3).toLowerCase():t.key.toLowerCase())===c&&e()};return o.addEventListener('keydown',d),()=>o.removeEventListener('keydown',d)},A=()=>{g.debug('开始获取运行日志');const t=$('#auto-task-info>li'),e=t.length>0?$.makeArray(t).map((t=>t.innerText)).join('\n'):'';return g.debug('运行日志获取完成',{logsLength:e.length}),e},O=async(t,e,o)=>{g.debug('开始生成GitHub Issue链接');const n=new URLSearchParams(await(async(t,e,o)=>{g.debug('开始构建GitHub Issue参数',{name:t,errorStackLength:e.length});const n={title:'[BUG] 脚本报错: '.concat(t),labels:'bug',template:'bug_report.yml',website:o.website,browser:o.browser,manager:o.manager,'user-script':o.userScript,logs:e||'','run-logs':''},a=window.__allLogs.join('\n');return await GM_setClipboard(a),g.debug('GitHub Issue参数构建完成',n),n})(t,e,o)),a='https://github.com/HCLonely/auto-task/issues/new?'.concat(n.toString());return g.debug('GitHub Issue链接生成完成',{link:a}),a};async function _(t,e){g.debug('开始处理错误',{name:e,error:t}),window.TRACE&&(g.debug('启用跟踪模式'),console.trace('%cAuto-Task[Trace]:','color:blue'));const n=t.stack||'';((t,e)=>{g.debug('记录错误日志',{name:t}),console.log('%c%s','color:white;background:red','Auto-Task[Error]: '.concat(t,'\n').concat(e))})(e,n),g.debug('获取环境信息');const a=await(async()=>{g.debug('开始获取环境信息');const t={website:window.location.href,browser:JSON.stringify(await p.getInfo(),null,2),manager:''.concat(GM_info.scriptHandler,' ').concat(GM_info.version),userScript:GM_info.script.version,logs:'',runLogs:A()};return g.debug('环境信息获取完成',t),t})();a.logs=n,g.debug('显示错误报告对话框');(await o.fire({title:c.default('errorReport'),icon:'error',showCancelButton:!0,confirmButtonText:c.default('toGithub'),cancelButtonText:c.default('close')})).isConfirmed?(g.debug('用户确认提交错误报告'),await(async(t,e,o,n)=>{g.debug('开始处理错误报告',{platform:t,name:e});{const t=await O(e,o,n);g.debug('打开GitHub Issue链接',{githubLink:t}),GM_openInTab(t,{active:!0})}})('github',e,n,a),o.fire({title:c.default('logCopied'),icon:'success',showConfirmButton:!1,showCancelButton:!0,cancelButtonText:c.default('close')})):g.debug('用户取消提交错误报告')}const G=(t,e)=>{g.debug('开始处理响应数据',{responseType:e.responseType});const o=(t=>{g.debug('开始解析HTTP头',{headerString:t});const e={};return t?(t.split('\n').forEach((t=>{const o=s(t.trim().split(':')),n=o[0],a=o.slice(1).join(':').trim();n&&a&&(e[n]?e[n]=Array.isArray(e[n])?[...e[n],a]:[e[n],a]:e[n]=a)})),e['set-cookie']&&!Array.isArray(e['set-cookie'])&&(e['set-cookie']=[e['set-cookie']]),g.debug('HTTP头解析完成',{headers:e}),e):(g.debug('HTTP头为空，返回空对象'),e)})(t.responseHeaders);if(t.responseHeadersText=t.responseHeaders,t.responseHeaders=o,t.finalUrl=o.location||t.finalUrl,g.debug('响应头处理完成',{finalUrl:t.finalUrl}),'json'===e.responseType&&null!=t&&t.response&&'object'!=typeof t.response){g.debug('尝试解析JSON响应');try{t.response=JSON.parse(t.responseText),g.debug('JSON解析成功')}catch(t){g.debug('JSON解析失败，保持原始响应')}}},j=async function(t){let o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;g.debug('开始HTTP请求',{url:t.url,method:t.method,retryTimes:o}),window.TRACE&&console.trace('%cAuto-Task[Trace]:','color:blue');try{const n=await new Promise((o=>{const n=e(e({fetch:!0,timeout:3e4,ontimeout:e=>{g.debug('请求超时',{url:t.url}),o({result:'Error',statusText:'Timeout',status:601,data:e,options:t})},onabort:()=>{g.debug('请求被中止',{url:t.url}),o({result:'Error',statusText:'Aborted',status:602,data:void 0,options:t})},onerror:e=>{g.debug('请求发生错误',{url:t.url,error:e}),o({result:'Error',statusText:'Error',status:603,data:e,options:t})},onload:e=>{g.debug('请求加载完成',{url:t.url,status:e.status}),G(e,t),o({result:'Success',statusText:'Load',status:600,data:e,options:t})}},t),{},{responseType:t.dataType||t.responseType});g.debug('发送请求',{requestObj:n}),GM_xmlhttpRequest(n)}));return window.DEBUG&&console.log('%cAuto-Task[httpRequest]:','color:blue',n),600!==n.status&&o<2?(g.debug('请求失败，准备重试',{status:n.status,retryTimes:o+1}),await j(t,o+1)):(g.debug('请求完成',{status:n.status,result:n.result}),n)}catch(e){return g.debug('请求发生JavaScript错误',{error:e}),console.log('%cAuto-Task[httpRequest]:','color:red',JSON.stringify({errorMsg:e,options:t})),_(e,'httpRequest'),{result:'JsError',statusText:'Error',status:604,error:e,options:t}}},L={github:'https://github.com/HCLonely/auto-task/raw/main/',jsdelivr:'https://cdn.jsdelivr.net/gh/HCLonely/auto-task@main/',standby:'https://auto-task.hclonely.com/'},M=async(t,e)=>{try{var o;g.debug('开始检查更新',{updateLink:t,auto:e});const a=''.concat(t,'package.json?time=').concat(Date.now());g.debug('构建检查URL',{checkUrl:a});const s=await j({url:a,responseType:'json',method:'GET',timeout:3e4}),r=s.result,i=s.statusText,l=s.status,u=s.data;if('Success'===r&&null!=u&&null!==(o=u.response)&&void 0!==o&&o.version){return g.debug('成功获取更新信息',{version:u.response.version}),u.response}if(e){g.debug('自动检查更新失败',{result:r,statusText:i,status:l})}else{var n;const t=null!=u&&null!==(n=u.response)&&void 0!==n&&n.version?''.concat(c.default('checkUpdateFailed'),'[').concat(null==u?void 0:u.statusText,'(').concat(null==u?void 0:u.status,')]'):''.concat(c.default('checkUpdateFailed'),'[').concat(r,':').concat(i,'(').concat(l,')]');g.debug('检查更新失败',{errorMessage:t}),b.default({}).error(t)}return!1}catch(t){return g.debug('检查更新发生错误',{error:t}),_(t,'checkUpdate'),!1}},x=t=>{g.debug('获取更新链接',{updateSource:t});const e=t.toLowerCase(),o=L[e]||L.github;return g.debug('选择的更新链接',{source:e,link:o}),o},P=(e,o,n)=>{if(g.debug('准备显示更新信息',{currentVersion:o,newVersion:e.version}),((e,o)=>{try{g.debug('开始比较版本号',{currentVersion:e,remoteVersion:o});const n=i(e.split('-'),1)[0],a=i(o.split('-'),2),s=a[0],r=a[1];if(r&&!t.globalOptions.other.receivePreview){return g.debug('不接收预览版本',{isPreview:r}),!1}const l=n.split('.').map(Number),u=s.split('.').map(Number);g.debug('版本号解析',{currentVersionParts:l,remoteVersionParts:u});for(let t=0;t<3;t++){if(u[t]>l[t]){return g.debug('发现新版本',{position:t,current:e,remote:o}),!0}if(u[t]<l[t]){return g.debug('远程版本较旧',{position:t,current:e,remote:o}),!1}}return g.debug('版本号相同'),!1}catch(t){return g.debug('比较版本号时发生错误',{error:t}),_(t,'compareVersion'),!1}})(o,e.version)){var a,s;const t=''.concat(n,'dist/').concat(GM_info.script.name,'.user.js');g.debug('发现新版本，显示更新通知',{scriptUrl:t}),b.default({html:'<li><font>'.concat(c.default('newVersionNotice',e.version,t),'</font></li>')});const o=(null===(a=e.change)||void 0===a?void 0:a.map((t=>'<li>'.concat(t,'</li>'))).join(''))||'';g.debug('显示更新日志',{changeListLength:null===(s=e.change)||void 0===s?void 0:s.length}),b.default({html:'<li>'.concat(c.default('updateText',e.version),'</li><ol class="update-text">').concat(o,'<li>').concat(c.default('updateHistory'),'</li></ol>')})}else{g.debug('当前已是最新版本')}};try{T()}catch(t){console.error('Auto-Task[Warning]: consoleLogHook 初始化失败',t)}try{const t=GM_getResourceText('autoTaskStyle');if(null==t||!t.trim()){throw new Error('Auto-Task CSS resource is empty')}window.STYLE=GM_addStyle(t+GM_getResourceText('style'))}catch(t){throw console.error('Auto-Task[Error]: 样式初始化失败，请重新安装脚本或使用全资源版本 (.all.user.js)',t),t}window.DEBUG=!(null===(h=t.globalOptions.other)||void 0===h||!h.debug),window.TRACE=!(null===(w=t.globalOptions.other)||void 0===w||!w.debug)&&'function'==typeof console.trace;const C=async()=>{let e;g.debug('主程序入口 loadScript 开始');for(const t of l.Websites){if(t.test()){g.debug('识别到支持的网站',{website:t.name}),e=new t;break}}if(!e){return g.debug('未识别到支持的网站，脚本停止加载'),void console.log('%c%s','color:#ff0000','Auto-Task[Warning]: 脚本停止加载，当前网站不支持！')}e.before&&(g.debug('执行网站 before 钩子'),await e.before()),(e=>{g.debug('初始化UI元素',{website:e.name}),$('body').append('\n    <div id="auto-task-info"\n        style="display:'.concat(t.globalOptions.other.defaultShowLog?'block':'none',';\n                ').concat(t.globalOptions.position.logSideX,':').concat(t.globalOptions.position.logDistance.split(',')[0],'px;\n                ').concat(t.globalOptions.position.logSideY,':').concat(t.globalOptions.position.logDistance.split(',')[1],'px;\n                opacity: 0;\n                animation: fadeInUp 0.6s ease forwards;">\n    </div>\n    <div id="auto-task-buttons"\n        style="display:').concat(t.globalOptions.other.defaultShowButton?'block':'none',';\n                ').concat(t.globalOptions.position.buttonSideX,':').concat(t.globalOptions.position.buttonDistance.split(',')[0],'px;\n                ').concat(t.globalOptions.position.buttonSideY,':').concat(t.globalOptions.position.buttonDistance.split(',')[1],'px;\n                opacity: 0;\n                animation: fadeInUp 0.6s ease 0.2s forwards;">\n    </div>\n    <div class="show-button-div"\n        style="display:').concat(t.globalOptions.other.defaultShowButton?'none':'block',';\n                ').concat(t.globalOptions.position.showButtonSideX,':').concat(t.globalOptions.position.showButtonDistance.split(',')[0],'px;\n                ').concat(t.globalOptions.position.showButtonSideY,':').concat(t.globalOptions.position.showButtonDistance.split(',')[1],'px;\n                opacity: 0;\n                animation: fadeInScale 0.5s ease 0.4s forwards;">\n      <a class="auto-task-website-btn show-button-link"\n        href="javascript:void(0);"\n        target="_self"\n        title="').concat(c.default('showButton'),'">\n      </a>\n    </div>\n  '));const o=$('#auto-task-info'),n=$('#auto-task-buttons'),a=$('div.show-button-div');if(a.on('click',(()=>{n.show(),a.hide()})),e.buttons&&0===n.children().length){n.addClass(''.concat(e.name,'-buttons'));for(const t of e.buttons){if(e[t]){const o=$('<p><a class="auto-task-website-btn '.concat(e.name,'-button" href="javascript:void(0);" target="_self">').concat(c.default(t),'</a></p>'));o.find('a.auto-task-website-btn').on('click',(()=>{e[t]()})),n.append(o)}}}const s=$('<p><a class="auto-task-website-btn '.concat(e.name,'-button" href="javascript:void(0);" target="_self">').concat(c.default('hideButton'),'</a></p>'));s.find('a.auto-task-website-btn').on('click',(()=>{n.hide(),a.show()}));const r=$('<p><a id="toggle-log" class="auto-task-website-btn '.concat(e.name,'-button" href="javascript:void(0);" target="_self" data-status="').concat(t.globalOptions.other.defaultShowLog?'show':'hide','">').concat(t.globalOptions.other.defaultShowLog?c.default('hideLog'):c.default('showLog'),'</a></p>'));r.find('a.auto-task-website-btn').on('click',(()=>{const t=$('#toggle-log');'show'===t.attr('data-status')?(o.hide(),t.attr('data-status','hide').text(c.default('showLog'))):(o.show(),t.attr('data-status','show').text(c.default('hideLog')))})),n.append(s).append(r),e.options&&GM_registerMenuCommand(c.default('changeWebsiteOptions'),(()=>{u.default(e.name,e.options)}))})(e),(e=>{g.debug('初始化热键',{website:e.name}),S(t.globalOptions.hotKey.doTaskKey,(()=>{e.doTask&&e.doTask()})),S(t.globalOptions.hotKey.undoTaskKey,(()=>{e.undoTask&&e.undoTask()})),S(t.globalOptions.hotKey.toggleLogKey,(()=>{const t=$('#toggle-log'),e=t.attr('data-status'),o=$('#auto-task-info');'show'===e?(o.hide(),t.attr('data-status','hide').text(c.default('showLog'))):(o.show(),t.attr('data-status','show').text(c.default('hideLog')))}))})(e),e.after&&(g.debug('执行网站 after 钩子'),await e.after()),'Setting'!==e.name&&(g.debug('注册全局菜单命令'),GM_registerMenuCommand(c.default('changeGlobalOptions'),(()=>{d.changeGlobalOptions('swal')})),GM_registerMenuCommand(c.default('settingPage'),(()=>{GM_openInTab('https://auto-task.hclonely.com/setting.html',{active:!0})}))),g.debug('脚本加载完成'),console.log('%c%s','color:#1bbe1a','Auto-Task[Load]: 脚本加载完成'),window.DEBUG&&b.default({}).warning(c.default('debugModeNotice')),await(async()=>{if(g.debug('检查Steam ASF状态'),!t.globalOptions.ASF.AsfEnabled||!t.globalOptions.ASF.AsfIpcUrl||!t.globalOptions.ASF.AsfIpcPassword){return}const e=GM_getValue('stopPlayTime',0)||0;if(0===e||e>=Date.now()){return}const n=Math.floor((Date.now()-e)/6e4);if(!(await o.fire({title:c.default('stopPlayTimeTitle'),text:c.default('stopPlayTimeText',n.toString()),icon:'warning',confirmButtonText:c.default('confirm'),cancelButtonText:c.default('cancel'),showCancelButton:!0})).value){return}let a=new f.default(t.globalOptions.ASF);try{if(!await a.init()){return}if(!await a.stopPlayGames()){return}const t=GM_getValue('taskLink',[])||[];for(const e of t){GM_openInTab(e,{active:!0})}GM_setValue('stopPlayTime',0),GM_setValue('playedGames',[]),GM_setValue('taskLink',[])}catch(t){console.error('SteamASF operation failed:',t)}finally{var s;null===(s=a)||void 0===s||s.dispose(),a=null}})(),(()=>{g.debug('检查版本和通知');const t=GM_info.scriptHandler;if('Tampermonkey'===t){var e;const t=i((null===(e=GM_info.version)||void 0===e?void 0:e.split('.'))||[],2),o=t[0],n=t[1];parseInt(o,10)>=5&&parseInt(n,10)>=2||b.default({}).error(c.default('versionNotMatched'))}else{if('Violentmonkey'===t){return g.debug('未知脚本管理器',{scriptHandler:t}),void b.default({}).warning(c.default('unknownScriptHandler'))}{var n;const t=i((null===(n=GM_info.version)||void 0===n?void 0:n.split('.'))||[],2),e=t[0],o=t[1];parseInt(e,10)>=2&&parseInt(o,10)>=36||b.default({}).error(c.default('versionNotMatched'))}}var a;GM_getValue('notice')||(o.fire({title:c.default('swalNotice'),icon:'warning'}).then((()=>{GM_openInTab(c.default('noticeLink'),{active:!0}),GM_setValue('notice',(new Date).getTime())})),null===(a=b.default({html:'<li><font class="warning">'.concat(c.default('echoNotice',c.default('noticeLink')),'</font></li>')}).font)||void 0===a||a.find('a').on('click',(()=>{GM_setValue('notice',(new Date).getTime())})))})(),(async()=>{try{g.debug('开始检查更新流程');const e=GM_info.script.version,o=t.globalOptions.other.autoUpdateSource;g.debug('当前配置',{currentVersion:e,updateSource:o});let n=!1;if(['github','jsdelivr','standby'].includes(o.toLowerCase())){g.debug('使用指定的更新源',{updateSource:o});const t=x(o);n=await M(t,!1)}else{g.debug('按优先级尝试不同的更新源');for(const t of['github','jsdelivr','standby']){if(g.debug('尝试更新源',{source:t}),n=await M(L[t],!0),n){g.debug('成功获取更新信息',{source:t});break}}}if(!n){return g.debug('所有更新源检查失败'),void b.default({}).error(c.default('checkUpdateFailed'))}P(n,e,x(o))}catch(t){g.debug('更新检查过程发生错误',{error:t}),_(t,'updateChecker')}})()},E=async()=>{try{if(await n.handleSteamAuthPage({namespace:r.moduleNamespace('steam'),gm:r.projectGM('steam')})){return}if(await a.handleTwitchAuthPage({namespace:r.moduleNamespace('twitch'),gm:r.projectGM('twitch')})){return}'key-hub.eu'===window.location.hostname&&(unsafeWindow.keyhubtracker=1,unsafeWindow.gaData={}),await C()}catch(t){g.debug('主程序入口发生异常',{error:t})}};'opquests.com'===window.location.hostname?E():$(E)}(AutoTaskWebsite.globalOptions,Swal,AutoTaskModules.steam,AutoTaskModules.twitch,AutoTaskWebsite.moduleBridge,AutoTaskWebsite,AutoTaskWebsite.options,AutoTaskWebsite.i18n,AutoTaskWebsite.globalOptionsEdit,browser,AutoTaskWebsite.debug,AutoTaskWebsite.echoLog,AutoTaskWebsite.SteamASF);
