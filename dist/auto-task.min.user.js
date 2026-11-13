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
// @include            *://give.gamesforfarm.com/*

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
// @connect            testingcf.jsdelivr.net
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

// @require            https://testingcf.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @resource           autoTaskStyle https://testingcf.jsdelivr.net/gh/HCLonely/auto-task@v5.2.2/dist/auto-task.css
// @require            https://testingcf.jsdelivr.net/npm/node-inspect-extracted@3.3.1/dist/inspect.min.js
// @require            https://testingcf.jsdelivr.net/npm/browser-tool@1.3.2/dist/browser.min.js
// @require            https://testingcf.jsdelivr.net/gh/HCLonely/auto-task@v5.2.2/dist/auto-task.i18n.js
// @require            https://testingcf.jsdelivr.net/gh/HCLonely/auto-task@v5.2.2/dist/auto-task.modules.js
// @require            https://testingcf.jsdelivr.net/gh/HCLonely/auto-task@v5.2.2/dist/auto-task.website.js

// @noframes
// ==/UserScript==

console.log('%c%s', 'color:blue', 'Auto-Task[Load]: 脚本开始加载');

const neededDependencies = ['jQuery', 'util', 'browser'];

const missingDependencies = neededDependencies.filter(dependency => typeof window[dependency] === 'undefined');
if (typeof AutoTaskModules === 'undefined') missingDependencies.push('AutoTaskModules');
if (typeof AutoTaskI18n === 'undefined') missingDependencies.push('AutoTaskI18n');
if (typeof AutoTaskWebsite === 'undefined') missingDependencies.push('AutoTaskWebsite');

if (missingDependencies.length > 0) {
  console.log('%c%s', 'color:red', `[Auto-Task] 脚本加载失败，缺少的依赖：${missingDependencies.join(', ')}`);
  if (confirm(`[Auto-Task] 脚本依赖加载失败，请刷新重试或安装全依赖版本，是否前往安装全依赖版本？\n缺少的依赖：${missingDependencies.join(', ')}`)) {
    GM_openInTab('https://github.com/HCLonely/auto-task/raw/main/dist/auto-task.min.all.user.js', { active: true });
  }
}


!function(e,t,o,s,a,n,i,r,u,l,c,d,g,p){'use strict';const b=/token|auth|session|jwt|key|secret|api[-_]?key|bearer|authorization|access[-_]?token|refresh[-_]?token|sid/i,f=[/([A-Za-z0-9-_]{10,})\.([A-Za-z0-9-_]{10,})\.([A-Za-z0-9-_]{10,})/g,/(Bearer|Basic)\s+([A-Za-z0-9\-._~+/]+=*)/gi,/\b([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\b/gi,/\b(eyJ[A-Za-z0-9\-_]+)\b/g],h=e=>{if(Array.isArray(e)){return e.map(h)}if(e&&'object'==typeof e){const o={};for(const s in e){b.test(s)&&'string'==typeof e[s]?o[s]='string'!=typeof(t=e[s])||t.length<8?t:t.replace(/^([A-Za-z0-9\-_+/=]{4})[A-Za-z0-9\-_+/=]+([A-Za-z0-9\-_+/=]{4})$/,'$1***$2'):o[s]=h(e[s])}return o}var t;return'string'==typeof e&&e.length>8?w(e):e},w=e=>{let t=e;for(const e of f){t=t.replace(e,((e,...t)=>t.length>=3&&e.includes('.')?t.map((e=>e.length>8?`${e.slice(0,4)}***${e.slice(-4)}`:e)).join('.'):e.length>8?`${e.slice(0,4)}***${e.slice(-4)}`:e))}return t},m=()=>{const e=console.log;window.__allLogs=window.__allLogs||[],console.log=function(...t){const o=(e=>e.map((e=>'string'==typeof e?w(e):'object'==typeof e&&null!==e?h(e):e)))(t);window.__allLogs.push(o),e.apply(console,o)}},y=(e,t,o=document)=>{const s=e.toLowerCase().trim().replace(/\+\s*\+$/,'+ plus'),a=('+'===s?['plus']:s.split(/\s*\+\s*/)).map((e=>e.trim())),n={control:'ctrl',command:'meta',cmd:'meta',option:'alt',esc:'escape',space:' ',plus:'+'},i=a.map((e=>n[e]||e)),r=['alt','ctrl','shift','meta'],u=i.filter((e=>!r.some((t=>t===e))));if(1!==u.length||!u[0]){return()=>{}}const[l]=u,c=e=>{if(e.repeat||e.isComposing){return}if(r.some((t=>e[`${t}Key`]!==i.includes(t)))){return}(/^[a-z]$/.test(l)&&/^Key[A-Z]$/.test(e.code)?e.code.slice(3).toLowerCase():e.key.toLowerCase())===l&&t()};return o.addEventListener('keydown',c),()=>o.removeEventListener('keydown',c)},k=()=>{d.debug('开始获取运行日志');const e=$('#auto-task-info>li'),t=e.length>0?$.makeArray(e).map((e=>e.innerText)).join('\n'):'';return d.debug('运行日志获取完成',{logsLength:t.length}),t},T=async(e,t,o)=>{d.debug('开始生成GitHub Issue链接');const s=new URLSearchParams(await(async(e,t,o)=>{d.debug('开始构建GitHub Issue参数',{name:e,errorStackLength:t.length});const s={title:`[BUG] 脚本报错: ${e}`,labels:'bug',template:'bug_report.yml',website:o.website,browser:o.browser,manager:o.manager,'user-script':o.userScript,logs:t||'','run-logs':''},a=window.__allLogs.join('\n');return await GM_setClipboard(a),d.debug('GitHub Issue参数构建完成',s),s})(e,t,o)),a=`https://github.com/HCLonely/auto-task/issues/new?${s.toString()}`;return d.debug('GitHub Issue链接生成完成',{link:a}),a};async function A(e,o){d.debug('开始处理错误',{name:o,error:e}),window.TRACE&&(d.debug('启用跟踪模式'),console.trace('%cAuto-Task[Trace]:','color:blue'));const s=e.stack||'';((e,t)=>{d.debug('记录错误日志',{name:e}),console.log('%c%s','color:white;background:red',`Auto-Task[Error]: ${e}\n${t}`)})(o,s),d.debug('获取环境信息');const a=await(async()=>{d.debug('开始获取环境信息');const e={website:window.location.href,browser:JSON.stringify(await c.getInfo(),null,2),manager:`${GM_info.scriptHandler} ${GM_info.version}`,userScript:GM_info.script.version,logs:'',runLogs:k()};return d.debug('环境信息获取完成',e),e})();a.logs=s,d.debug('显示错误报告对话框');const{isConfirmed:n}=await t.showDialog({title:u.default('errorReport'),icon:'error',showCancelButton:!0,confirmButtonText:u.default('toGithub'),cancelButtonText:u.default('close')});n?(d.debug('用户确认提交错误报告'),await(async(e,t,o,s)=>{d.debug('开始处理错误报告',{platform:e,name:t});{const e=await T(t,o,s);d.debug('打开GitHub Issue链接',{githubLink:e}),GM_openInTab(e,{active:!0})}})('github',o,s,a),t.toast({title:u.default('logCopied'),icon:'success'})):d.debug('用户取消提交错误报告')}const v=(e,t)=>{d.debug('开始处理响应数据',{responseType:t.responseType});const o=(e=>{d.debug('开始解析HTTP头',{headerString:e});const t={};return e?(e.split('\n').forEach((e=>{const[o,...s]=e.trim().split(':'),a=s.join(':').trim();o&&a&&(t[o]?t[o]=Array.isArray(t[o])?[...t[o],a]:[t[o],a]:t[o]=a)})),t['set-cookie']&&!Array.isArray(t['set-cookie'])&&(t['set-cookie']=[t['set-cookie']]),d.debug('HTTP头解析完成',{headers:t}),t):(d.debug('HTTP头为空，返回空对象'),t)})(e.responseHeaders);if(e.responseHeadersText=e.responseHeaders,e.responseHeaders=o,e.finalUrl=o.location||e.finalUrl,d.debug('响应头处理完成',{finalUrl:e.finalUrl}),'json'===t.responseType&&e?.response&&'object'!=typeof e.response){d.debug('尝试解析JSON响应');try{e.response=JSON.parse(e.responseText),d.debug('JSON解析成功')}catch{d.debug('JSON解析失败，保持原始响应')}}},S=async(e,t=0)=>{d.debug('开始HTTP请求',{url:e.url,method:e.method,retryTimes:t}),window.TRACE&&console.trace('%cAuto-Task[Trace]:','color:blue');try{const o=await new Promise((t=>{const o={fetch:!0,timeout:3e4,ontimeout:o=>{d.debug('请求超时',{url:e.url}),t({result:'Error',statusText:'Timeout',status:601,data:o,options:e})},onabort:()=>{d.debug('请求被中止',{url:e.url}),t({result:'Error',statusText:'Aborted',status:602,data:void 0,options:e})},onerror:o=>{d.debug('请求发生错误',{url:e.url,error:o}),t({result:'Error',statusText:'Error',status:603,data:o,options:e})},onload:o=>{d.debug('请求加载完成',{url:e.url,status:o.status}),v(o,e),t({result:'Success',statusText:'Load',status:600,data:o,options:e})},...e,responseType:e.dataType||e.responseType};d.debug('发送请求',{requestObj:o}),GM_xmlhttpRequest(o)}));return window.DEBUG&&console.log('%cAuto-Task[httpRequest]:','color:blue',o),600!==o.status&&t<2?(d.debug('请求失败，准备重试',{status:o.status,retryTimes:t+1}),await S(e,t+1)):(d.debug('请求完成',{status:o.status,result:o.result}),o)}catch(t){return d.debug('请求发生JavaScript错误',{error:t}),console.log('%cAuto-Task[httpRequest]:','color:red',JSON.stringify({errorMsg:t,options:e})),A(t,'httpRequest'),{result:'JsError',statusText:'Error',status:604,error:t,options:e}}},_={github:'https://github.com/HCLonely/auto-task/raw/main/',jsdelivr:'https://cdn.jsdelivr.net/gh/HCLonely/auto-task@main/',standby:'https://auto-task.hclonely.com/'},G=async(e,t)=>{try{d.debug('开始检查更新',{updateLink:e,auto:t});const o=`${e}package.json?time=${Date.now()}`;d.debug('构建检查URL',{checkUrl:o});const{result:s,statusText:a,status:n,data:i}=await S({url:o,responseType:'json',method:'GET',timeout:3e4});if('Success'===s&&i?.response?.version){return d.debug('成功获取更新信息',{version:i.response.version}),i.response}if(t){d.debug('自动检查更新失败',{result:s,statusText:a,status:n})}else{const e=i?.response?.version?`${u.default('checkUpdateFailed')}[${i?.statusText}(${i?.status})]`:`${u.default('checkUpdateFailed')}[${s}:${a}(${n})]`;d.debug('检查更新失败',{errorMessage:e}),g.default({}).error(e)}return!1}catch(e){return d.debug('检查更新发生错误',{error:e}),A(e,'checkUpdate'),!1}},L=e=>{d.debug('获取更新链接',{updateSource:e});const t=e.toLowerCase(),o=_[t]||_.github;return d.debug('选择的更新链接',{source:t,link:o}),o},M=(t,o,s)=>{if(d.debug('准备显示更新信息',{currentVersion:o,newVersion:t.version}),((t,o)=>{try{d.debug('开始比较版本号',{currentVersion:t,remoteVersion:o});const[s]=t.split('-'),[a,n]=o.split('-');if(n&&!e.globalOptions.other.receivePreview){return d.debug('不接收预览版本',{isPreview:n}),!1}const i=s.split('.').map(Number),r=a.split('.').map(Number);d.debug('版本号解析',{currentVersionParts:i,remoteVersionParts:r});for(let e=0;e<3;e++){if(r[e]>i[e]){return d.debug('发现新版本',{position:e,current:t,remote:o}),!0}if(r[e]<i[e]){return d.debug('远程版本较旧',{position:e,current:t,remote:o}),!1}}return d.debug('版本号相同'),!1}catch(e){return d.debug('比较版本号时发生错误',{error:e}),A(e,'compareVersion'),!1}})(o,t.version)){const e=`${s}dist/${GM_info.script.name}.user.js`;d.debug('发现新版本，显示更新通知',{scriptUrl:e}),g.default({html:`<li><font>${u.default('newVersionNotice',t.version,e)}</font></li>`});const o=t.change?.map((e=>`<li>${e}</li>`)).join('')||'';d.debug('显示更新日志',{changeListLength:t.change?.length}),g.default({html:`<li>${u.default('updateText',t.version)}</li><ol class="update-text">${o}<li>${u.default('updateHistory')}</li></ol>`})}else{d.debug('当前已是最新版本')}},O=(async()=>{if(!/(?:^#|&)autoTaskGFF=/.test(window.location.hash)){return!1}const e=window.location.hostname;return'store.steampowered.com'===e||'steamcommunity.com'===e?o.handleSteamGFFPage({namespace:`${n.moduleNamespace('steam')}:gff`,gm:n.projectGM('steam')}):('www.youtube.com'===e||'m.youtube.com'===e)&&s.handleYoutubeGFFPage({namespace:`${n.moduleNamespace('youtube')}:gff`,gm:n.projectGM('youtube')})})();try{m()}catch(e){console.error('Auto-Task[Warning]: consoleLogHook 初始化失败',e)}try{const e=GM_getResourceText('autoTaskStyle');if(!e?.trim()){throw new Error('Auto-Task CSS resource is empty')}window.STYLE=GM_addStyle(e)}catch(e){throw console.error('Auto-Task[Error]: 样式初始化失败，请重新安装脚本或使用全资源版本 (.all.user.js)',e),e}window.DEBUG=!!e.globalOptions.other?.debug,window.TRACE=!!e.globalOptions.other?.debug&&'function'==typeof console.trace;const x=async()=>{let o;d.debug('主程序入口 loadScript 开始');for(const e of i.Websites){if(e.test()){d.debug('识别到支持的网站',{website:e.name}),o=new e;break}}if(!o){return d.debug('未识别到支持的网站，脚本停止加载'),void console.log('%c%s','color:#ff0000','Auto-Task[Warning]: 脚本停止加载，当前网站不支持！')}o.before&&(d.debug('执行网站 before 钩子'),await o.before()),(t=>{d.debug('初始化UI元素',{website:t.name}),$('body').append(`\n    <div id="auto-task-info"\n        style="display:${e.globalOptions.other.defaultShowLog?'block':'none'};\n                ${e.globalOptions.position.logSideX}:${e.globalOptions.position.logDistance.split(',')[0]}px;\n                ${e.globalOptions.position.logSideY}:${e.globalOptions.position.logDistance.split(',')[1]}px;\n                opacity: 0;\n                animation: fadeInUp 0.6s ease forwards;">\n    </div>\n    <div id="auto-task-buttons"\n        style="display:${e.globalOptions.other.defaultShowButton?'block':'none'};\n                ${e.globalOptions.position.buttonSideX}:${e.globalOptions.position.buttonDistance.split(',')[0]}px;\n                ${e.globalOptions.position.buttonSideY}:${e.globalOptions.position.buttonDistance.split(',')[1]}px;\n                opacity: 0;\n                animation: fadeInUp 0.6s ease 0.2s forwards;">\n    </div>\n    <div class="show-button-div"\n        style="display:${e.globalOptions.other.defaultShowButton?'none':'block'};\n                ${e.globalOptions.position.showButtonSideX}:${e.globalOptions.position.showButtonDistance.split(',')[0]}px;\n                ${e.globalOptions.position.showButtonSideY}:${e.globalOptions.position.showButtonDistance.split(',')[1]}px;\n                opacity: 0;\n                animation: fadeInScale 0.5s ease 0.4s forwards;">\n      <a class="auto-task-website-btn show-button-link"\n        href="javascript:void(0);"\n        target="_self"\n        title="${u.default('showButton')}">\n      </a>\n    </div>\n  `);const o=$('#auto-task-info'),s=$('#auto-task-buttons'),a=$('div.show-button-div');if(a.on('click',(()=>{s.show(),a.hide()})),t.buttons&&0===s.children().length){s.addClass(`${t.name}-buttons`);for(const e of t.buttons){if(t[e]){const o=$(`<p><a class="auto-task-website-btn ${t.name}-button" href="javascript:void(0);" target="_self">${u.default(e)}</a></p>`);o.find('a.auto-task-website-btn').on('click',(()=>{t[e]()})),s.append(o)}}}const n=$(`<p><a class="auto-task-website-btn ${t.name}-button" href="javascript:void(0);" target="_self">${u.default('hideButton')}</a></p>`);n.find('a.auto-task-website-btn').on('click',(()=>{s.hide(),a.show()}));const i=$(`<p><a id="toggle-log" class="auto-task-website-btn ${t.name}-button" href="javascript:void(0);" target="_self" data-status="${e.globalOptions.other.defaultShowLog?'show':'hide'}">${e.globalOptions.other.defaultShowLog?u.default('hideLog'):u.default('showLog')}</a></p>`);i.find('a.auto-task-website-btn').on('click',(()=>{const e=$('#toggle-log');'show'===e.attr('data-status')?(o.hide(),e.attr('data-status','hide').text(u.default('showLog'))):(o.show(),e.attr('data-status','show').text(u.default('hideLog')))})),s.append(n).append(i),t.options&&GM_registerMenuCommand(u.default('changeWebsiteOptions'),(()=>{r.default(t.name,t.options)}))})(o),(t=>{d.debug('初始化热键',{website:t.name}),y(e.globalOptions.hotKey.doTaskKey,(()=>{t.doTask&&t.doTask()})),y(e.globalOptions.hotKey.undoTaskKey,(()=>{t.undoTask&&t.undoTask()})),y(e.globalOptions.hotKey.toggleLogKey,(()=>{const e=$('#toggle-log'),t=e.attr('data-status'),o=$('#auto-task-info');'show'===t?(o.hide(),e.attr('data-status','hide').text(u.default('showLog'))):(o.show(),e.attr('data-status','show').text(u.default('hideLog')))}))})(o),o.after&&('complete'!==document.readyState&&(d.debug('等待页面加载完成'),await new Promise((e=>{window.addEventListener('load',(()=>{e()}),{once:!0})}))),d.debug('执行网站 after 钩子'),await o.after()),'Setting'!==o.name&&(d.debug('注册全局菜单命令'),GM_registerMenuCommand(u.default('changeGlobalOptions'),(()=>{l.changeGlobalOptions('dialog')})),GM_registerMenuCommand(u.default('settingPage'),(()=>{GM_openInTab('https://auto-task.hclonely.com/setting.html',{active:!0})}))),d.debug('脚本加载完成'),console.log('%c%s','color:#1bbe1a','Auto-Task[Load]: 脚本加载完成'),window.DEBUG&&g.default({}).warning(u.default('debugModeNotice')),await(async()=>{if(d.debug('检查Steam ASF状态'),!e.globalOptions.ASF.AsfEnabled||!e.globalOptions.ASF.AsfIpcUrl||!e.globalOptions.ASF.AsfIpcPassword){return}const o=GM_getValue('stopPlayTime',0)||0;if(0===o||o>=Date.now()){return}const s=Math.floor((Date.now()-o)/6e4),{value:a}=await t.showDialog({title:u.default('stopPlayTimeTitle'),text:u.default('stopPlayTimeText',s.toString()),icon:'warning',confirmButtonText:u.default('confirm'),cancelButtonText:u.default('cancel'),showCancelButton:!0});if(!a){return}const n=p.createSteamASF(e.globalOptions.ASF);try{if(!await n.init()){return}if(!await n.stopPlayGames()){return}const e=GM_getValue('taskLink',[])||[];for(const t of e){GM_openInTab(t,{active:!0})}GM_setValue('stopPlayTime',0),GM_setValue('playedGames',[]),GM_setValue('taskLink',[])}catch(e){console.error('SteamASF operation failed:',e)}finally{n.dispose()}})(),(()=>{d.debug('检查版本和通知');const{scriptHandler:e}=GM_info;if('Tampermonkey'===e){const[e,t]=GM_info.version?.split('.')||[];parseInt(e,10)>=5&&parseInt(t,10)>=2||g.default({}).error(u.default('versionNotMatched'))}else{if('Violentmonkey'===e){return d.debug('未知脚本管理器',{scriptHandler:e}),void g.default({}).warning(u.default('unknownScriptHandler'))}{const[e,t]=GM_info.version?.split('.')||[];parseInt(e,10)>=2&&parseInt(t,10)>=36||g.default({}).error(u.default('versionNotMatched'))}}GM_getValue('notice')||(t.showDialog({title:u.default('installNotice'),icon:'warning'}).then((({isConfirmed:e})=>{e&&(GM_openInTab(u.default('noticeLink'),{active:!0}),GM_setValue('notice',(new Date).getTime()))})),g.default({html:`<li><font class="warning">${u.default('echoNotice',u.default('noticeLink'))}</font></li>`}).font?.find('a').on('click',(()=>{GM_setValue('notice',(new Date).getTime())})))})(),(async()=>{try{d.debug('开始检查更新流程');const t=GM_info.script.version,o=e.globalOptions.other.autoUpdateSource;d.debug('当前配置',{currentVersion:t,updateSource:o});let s=!1;if(['github','jsdelivr','standby'].includes(o.toLowerCase())){d.debug('使用指定的更新源',{updateSource:o});const e=L(o);s=await G(e,!1)}else{d.debug('按优先级尝试不同的更新源');for(const e of['github','jsdelivr','standby']){if(d.debug('尝试更新源',{source:e}),s=await G(_[e],!0),s){d.debug('成功获取更新信息',{source:e});break}}}if(!s){return d.debug('所有更新源检查失败'),void g.default({}).error(u.default('checkUpdateFailed'))}M(s,t,L(o))}catch(e){d.debug('更新检查过程发生错误',{error:e}),A(e,'updateChecker')}})()},j=async()=>{try{if(await O){return}if(await o.handleSteamAuthPage({namespace:n.moduleNamespace('steam'),gm:n.projectGM('steam')})){return}if(await a.handleTwitchAuthPage({namespace:n.moduleNamespace('twitch'),gm:n.projectGM('twitch')})){return}'key-hub.eu'===window.location.hostname&&(unsafeWindow.keyhubtracker=1,unsafeWindow.gaData={}),await x()}catch(e){d.debug('主程序入口发生异常',{error:e})}};'opquests.com'===window.location.hostname?j():$(j)}(AutoTaskWebsite.globalOptions,AutoTaskWebsite.dialog,AutoTaskModules.steam,AutoTaskModules.youtube,AutoTaskModules.twitch,AutoTaskWebsite.moduleBridge,AutoTaskWebsite,AutoTaskWebsite.options,AutoTaskWebsite.i18n,AutoTaskWebsite.globalOptionsEdit,browser,AutoTaskWebsite.debug,AutoTaskWebsite.echoLog,AutoTaskWebsite.socialClients);
