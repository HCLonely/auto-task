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
// @resource           autoTaskStyle https://cdn.jsdelivr.net/gh/HCLonely/auto-task@v5.2.2/dist/auto-task.css
// @require            https://cdn.jsdelivr.net/npm/node-inspect-extracted@3.1.0/dist/inspect.min.js
// @require            https://cdn.jsdelivr.net/npm/browser-tool@1.3.2/dist/browser.min.js
// @require            https://cdn.jsdelivr.net/gh/HCLonely/auto-task@v5.2.2/dist/auto-task.i18n.js
// @require            https://cdn.jsdelivr.net/gh/HCLonely/auto-task@v5.2.2/dist/auto-task.modules.js
// @require            https://cdn.jsdelivr.net/gh/HCLonely/auto-task@v5.2.2/dist/auto-task.website.js

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


!function(t,e,o,s,a,n,i,r,u,l,d,c,g){'use strict';const p=/token|auth|session|jwt|key|secret|api[-_]?key|bearer|authorization|access[-_]?token|refresh[-_]?token|sid/i,b=[/([A-Za-z0-9-_]{10,})\.([A-Za-z0-9-_]{10,})\.([A-Za-z0-9-_]{10,})/g,/(Bearer|Basic)\s+([A-Za-z0-9\-._~+/]+=*)/gi,/\b([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\b/gi,/\b(eyJ[A-Za-z0-9\-_]+)\b/g],f=t=>{if(Array.isArray(t)){return t.map(f)}if(t&&'object'==typeof t){const o={};for(const s in t){p.test(s)&&'string'==typeof t[s]?o[s]='string'!=typeof(e=t[s])||e.length<8?e:e.replace(/^([A-Za-z0-9\-_+/=]{4})[A-Za-z0-9\-_+/=]+([A-Za-z0-9\-_+/=]{4})$/,'$1***$2'):o[s]=f(t[s])}return o}var e;return'string'==typeof t&&t.length>8?h(t):t},h=t=>{let e=t;for(const t of b){e=e.replace(t,((t,...e)=>e.length>=3&&t.includes('.')?e.map((t=>t.length>8?`${t.slice(0,4)}***${t.slice(-4)}`:t)).join('.'):t.length>8?`${t.slice(0,4)}***${t.slice(-4)}`:t))}return e},w=()=>{const t=console.log;window.__allLogs=window.__allLogs||[],console.log=function(...e){const o=(t=>t.map((t=>'string'==typeof t?h(t):'object'==typeof t&&null!==t?f(t):t)))(e);window.__allLogs.push(o),t.apply(console,o)}},m=(t,e,o=document)=>{const s=t.toLowerCase().trim().replace(/\+\s*\+$/,'+ plus'),a=('+'===s?['plus']:s.split(/\s*\+\s*/)).map((t=>t.trim())),n={control:'ctrl',command:'meta',cmd:'meta',option:'alt',esc:'escape',space:' ',plus:'+'},i=a.map((t=>n[t]||t)),r=['alt','ctrl','shift','meta'],u=i.filter((t=>!r.some((e=>e===t))));if(1!==u.length||!u[0]){return()=>{}}const[l]=u,d=t=>{if(t.repeat||t.isComposing){return}if(r.some((e=>t[`${e}Key`]!==i.includes(e)))){return}(/^[a-z]$/.test(l)&&/^Key[A-Z]$/.test(t.code)?t.code.slice(3).toLowerCase():t.key.toLowerCase())===l&&e()};return o.addEventListener('keydown',d),()=>o.removeEventListener('keydown',d)},k=()=>{d.debug('开始获取运行日志');const t=$('#auto-task-info>li'),e=t.length>0?$.makeArray(t).map((t=>t.innerText)).join('\n'):'';return d.debug('运行日志获取完成',{logsLength:e.length}),e},y=async(t,e,o)=>{d.debug('开始生成GitHub Issue链接');const s=new URLSearchParams(await(async(t,e,o)=>{d.debug('开始构建GitHub Issue参数',{name:t,errorStackLength:e.length});const s={title:`[BUG] 脚本报错: ${t}`,labels:'bug',template:'bug_report.yml',website:o.website,browser:o.browser,manager:o.manager,'user-script':o.userScript,logs:e||'','run-logs':''},a=window.__allLogs.join('\n');return await GM_setClipboard(a),d.debug('GitHub Issue参数构建完成',s),s})(t,e,o)),a=`https://github.com/HCLonely/auto-task/issues/new?${s.toString()}`;return d.debug('GitHub Issue链接生成完成',{link:a}),a};async function T(t,o){d.debug('开始处理错误',{name:o,error:t}),window.TRACE&&(d.debug('启用跟踪模式'),console.trace('%cAuto-Task[Trace]:','color:blue'));const s=t.stack||'';((t,e)=>{d.debug('记录错误日志',{name:t}),console.log('%c%s','color:white;background:red',`Auto-Task[Error]: ${t}\n${e}`)})(o,s),d.debug('获取环境信息');const a=await(async()=>{d.debug('开始获取环境信息');const t={website:window.location.href,browser:JSON.stringify(await l.getInfo(),null,2),manager:`${GM_info.scriptHandler} ${GM_info.version}`,userScript:GM_info.script.version,logs:'',runLogs:k()};return d.debug('环境信息获取完成',t),t})();a.logs=s,d.debug('显示错误报告对话框');const{isConfirmed:n}=await e.showDialog({title:r.default('errorReport'),icon:'error',showCancelButton:!0,confirmButtonText:r.default('toGithub'),cancelButtonText:r.default('close')});n?(d.debug('用户确认提交错误报告'),await(async(t,e,o,s)=>{d.debug('开始处理错误报告',{platform:t,name:e});{const t=await y(e,o,s);d.debug('打开GitHub Issue链接',{githubLink:t}),GM_openInTab(t,{active:!0})}})('github',o,s,a),e.toast({title:r.default('logCopied'),icon:'success'})):d.debug('用户取消提交错误报告')}const A=(t,e)=>{d.debug('开始处理响应数据',{responseType:e.responseType});const o=(t=>{d.debug('开始解析HTTP头',{headerString:t});const e={};return t?(t.split('\n').forEach((t=>{const[o,...s]=t.trim().split(':'),a=s.join(':').trim();o&&a&&(e[o]?e[o]=Array.isArray(e[o])?[...e[o],a]:[e[o],a]:e[o]=a)})),e['set-cookie']&&!Array.isArray(e['set-cookie'])&&(e['set-cookie']=[e['set-cookie']]),d.debug('HTTP头解析完成',{headers:e}),e):(d.debug('HTTP头为空，返回空对象'),e)})(t.responseHeaders);if(t.responseHeadersText=t.responseHeaders,t.responseHeaders=o,t.finalUrl=o.location||t.finalUrl,d.debug('响应头处理完成',{finalUrl:t.finalUrl}),'json'===e.responseType&&t?.response&&'object'!=typeof t.response){d.debug('尝试解析JSON响应');try{t.response=JSON.parse(t.responseText),d.debug('JSON解析成功')}catch{d.debug('JSON解析失败，保持原始响应')}}},v=async(t,e=0)=>{d.debug('开始HTTP请求',{url:t.url,method:t.method,retryTimes:e}),window.TRACE&&console.trace('%cAuto-Task[Trace]:','color:blue');try{const o=await new Promise((e=>{const o={fetch:!0,timeout:3e4,ontimeout:o=>{d.debug('请求超时',{url:t.url}),e({result:'Error',statusText:'Timeout',status:601,data:o,options:t})},onabort:()=>{d.debug('请求被中止',{url:t.url}),e({result:'Error',statusText:'Aborted',status:602,data:void 0,options:t})},onerror:o=>{d.debug('请求发生错误',{url:t.url,error:o}),e({result:'Error',statusText:'Error',status:603,data:o,options:t})},onload:o=>{d.debug('请求加载完成',{url:t.url,status:o.status}),A(o,t),e({result:'Success',statusText:'Load',status:600,data:o,options:t})},...t,responseType:t.dataType||t.responseType};d.debug('发送请求',{requestObj:o}),GM_xmlhttpRequest(o)}));return window.DEBUG&&console.log('%cAuto-Task[httpRequest]:','color:blue',o),600!==o.status&&e<2?(d.debug('请求失败，准备重试',{status:o.status,retryTimes:e+1}),await v(t,e+1)):(d.debug('请求完成',{status:o.status,result:o.result}),o)}catch(e){return d.debug('请求发生JavaScript错误',{error:e}),console.log('%cAuto-Task[httpRequest]:','color:red',JSON.stringify({errorMsg:e,options:t})),T(e,'httpRequest'),{result:'JsError',statusText:'Error',status:604,error:e,options:t}}},S={github:'https://github.com/HCLonely/auto-task/raw/main/',jsdelivr:'https://cdn.jsdelivr.net/gh/HCLonely/auto-task@main/',standby:'https://auto-task.hclonely.com/'},_=async(t,e)=>{try{d.debug('开始检查更新',{updateLink:t,auto:e});const o=`${t}package.json?time=${Date.now()}`;d.debug('构建检查URL',{checkUrl:o});const{result:s,statusText:a,status:n,data:i}=await v({url:o,responseType:'json',method:'GET',timeout:3e4});if('Success'===s&&i?.response?.version){return d.debug('成功获取更新信息',{version:i.response.version}),i.response}if(e){d.debug('自动检查更新失败',{result:s,statusText:a,status:n})}else{const t=i?.response?.version?`${r.default('checkUpdateFailed')}[${i?.statusText}(${i?.status})]`:`${r.default('checkUpdateFailed')}[${s}:${a}(${n})]`;d.debug('检查更新失败',{errorMessage:t}),c.default({}).error(t)}return!1}catch(t){return d.debug('检查更新发生错误',{error:t}),T(t,'checkUpdate'),!1}},G=t=>{d.debug('获取更新链接',{updateSource:t});const e=t.toLowerCase(),o=S[e]||S.github;return d.debug('选择的更新链接',{source:e,link:o}),o},L=(e,o,s)=>{if(d.debug('准备显示更新信息',{currentVersion:o,newVersion:e.version}),((e,o)=>{try{d.debug('开始比较版本号',{currentVersion:e,remoteVersion:o});const[s]=e.split('-'),[a,n]=o.split('-');if(n&&!t.globalOptions.other.receivePreview){return d.debug('不接收预览版本',{isPreview:n}),!1}const i=s.split('.').map(Number),r=a.split('.').map(Number);d.debug('版本号解析',{currentVersionParts:i,remoteVersionParts:r});for(let t=0;t<3;t++){if(r[t]>i[t]){return d.debug('发现新版本',{position:t,current:e,remote:o}),!0}if(r[t]<i[t]){return d.debug('远程版本较旧',{position:t,current:e,remote:o}),!1}}return d.debug('版本号相同'),!1}catch(t){return d.debug('比较版本号时发生错误',{error:t}),T(t,'compareVersion'),!1}})(o,e.version)){const t=`${s}dist/${GM_info.script.name}.user.js`;d.debug('发现新版本，显示更新通知',{scriptUrl:t}),c.default({html:`<li><font>${r.default('newVersionNotice',e.version,t)}</font></li>`});const o=e.change?.map((t=>`<li>${t}</li>`)).join('')||'';d.debug('显示更新日志',{changeListLength:e.change?.length}),c.default({html:`<li>${r.default('updateText',e.version)}</li><ol class="update-text">${o}<li>${r.default('updateHistory')}</li></ol>`})}else{d.debug('当前已是最新版本')}};try{w()}catch(t){console.error('Auto-Task[Warning]: consoleLogHook 初始化失败',t)}try{const t=GM_getResourceText('autoTaskStyle');if(!t?.trim()){throw new Error('Auto-Task CSS resource is empty')}window.STYLE=GM_addStyle(t)}catch(t){throw console.error('Auto-Task[Error]: 样式初始化失败，请重新安装脚本或使用全资源版本 (.all.user.js)',t),t}window.DEBUG=!!t.globalOptions.other?.debug,window.TRACE=!!t.globalOptions.other?.debug&&'function'==typeof console.trace;const M=async()=>{let o;d.debug('主程序入口 loadScript 开始');for(const t of n.Websites){if(t.test()){d.debug('识别到支持的网站',{website:t.name}),o=new t;break}}if(!o){return d.debug('未识别到支持的网站，脚本停止加载'),void console.log('%c%s','color:#ff0000','Auto-Task[Warning]: 脚本停止加载，当前网站不支持！')}o.before&&(d.debug('执行网站 before 钩子'),await o.before()),(e=>{d.debug('初始化UI元素',{website:e.name}),$('body').append(`\n    <div id="auto-task-info"\n        style="display:${t.globalOptions.other.defaultShowLog?'block':'none'};\n                ${t.globalOptions.position.logSideX}:${t.globalOptions.position.logDistance.split(',')[0]}px;\n                ${t.globalOptions.position.logSideY}:${t.globalOptions.position.logDistance.split(',')[1]}px;\n                opacity: 0;\n                animation: fadeInUp 0.6s ease forwards;">\n    </div>\n    <div id="auto-task-buttons"\n        style="display:${t.globalOptions.other.defaultShowButton?'block':'none'};\n                ${t.globalOptions.position.buttonSideX}:${t.globalOptions.position.buttonDistance.split(',')[0]}px;\n                ${t.globalOptions.position.buttonSideY}:${t.globalOptions.position.buttonDistance.split(',')[1]}px;\n                opacity: 0;\n                animation: fadeInUp 0.6s ease 0.2s forwards;">\n    </div>\n    <div class="show-button-div"\n        style="display:${t.globalOptions.other.defaultShowButton?'none':'block'};\n                ${t.globalOptions.position.showButtonSideX}:${t.globalOptions.position.showButtonDistance.split(',')[0]}px;\n                ${t.globalOptions.position.showButtonSideY}:${t.globalOptions.position.showButtonDistance.split(',')[1]}px;\n                opacity: 0;\n                animation: fadeInScale 0.5s ease 0.4s forwards;">\n      <a class="auto-task-website-btn show-button-link"\n        href="javascript:void(0);"\n        target="_self"\n        title="${r.default('showButton')}">\n      </a>\n    </div>\n  `);const o=$('#auto-task-info'),s=$('#auto-task-buttons'),a=$('div.show-button-div');if(a.on('click',(()=>{s.show(),a.hide()})),e.buttons&&0===s.children().length){s.addClass(`${e.name}-buttons`);for(const t of e.buttons){if(e[t]){const o=$(`<p><a class="auto-task-website-btn ${e.name}-button" href="javascript:void(0);" target="_self">${r.default(t)}</a></p>`);o.find('a.auto-task-website-btn').on('click',(()=>{e[t]()})),s.append(o)}}}const n=$(`<p><a class="auto-task-website-btn ${e.name}-button" href="javascript:void(0);" target="_self">${r.default('hideButton')}</a></p>`);n.find('a.auto-task-website-btn').on('click',(()=>{s.hide(),a.show()}));const u=$(`<p><a id="toggle-log" class="auto-task-website-btn ${e.name}-button" href="javascript:void(0);" target="_self" data-status="${t.globalOptions.other.defaultShowLog?'show':'hide'}">${t.globalOptions.other.defaultShowLog?r.default('hideLog'):r.default('showLog')}</a></p>`);u.find('a.auto-task-website-btn').on('click',(()=>{const t=$('#toggle-log');'show'===t.attr('data-status')?(o.hide(),t.attr('data-status','hide').text(r.default('showLog'))):(o.show(),t.attr('data-status','show').text(r.default('hideLog')))})),s.append(n).append(u),e.options&&GM_registerMenuCommand(r.default('changeWebsiteOptions'),(()=>{i.default(e.name,e.options)}))})(o),(e=>{d.debug('初始化热键',{website:e.name}),m(t.globalOptions.hotKey.doTaskKey,(()=>{e.doTask&&e.doTask()})),m(t.globalOptions.hotKey.undoTaskKey,(()=>{e.undoTask&&e.undoTask()})),m(t.globalOptions.hotKey.toggleLogKey,(()=>{const t=$('#toggle-log'),e=t.attr('data-status'),o=$('#auto-task-info');'show'===e?(o.hide(),t.attr('data-status','hide').text(r.default('showLog'))):(o.show(),t.attr('data-status','show').text(r.default('hideLog')))}))})(o),o.after&&(d.debug('执行网站 after 钩子'),await o.after()),'Setting'!==o.name&&(d.debug('注册全局菜单命令'),GM_registerMenuCommand(r.default('changeGlobalOptions'),(()=>{u.changeGlobalOptions('dialog')})),GM_registerMenuCommand(r.default('settingPage'),(()=>{GM_openInTab('https://auto-task.hclonely.com/setting.html',{active:!0})}))),d.debug('脚本加载完成'),console.log('%c%s','color:#1bbe1a','Auto-Task[Load]: 脚本加载完成'),window.DEBUG&&c.default({}).warning(r.default('debugModeNotice')),await(async()=>{if(d.debug('检查Steam ASF状态'),!t.globalOptions.ASF.AsfEnabled||!t.globalOptions.ASF.AsfIpcUrl||!t.globalOptions.ASF.AsfIpcPassword){return}const o=GM_getValue('stopPlayTime',0)||0;if(0===o||o>=Date.now()){return}const s=Math.floor((Date.now()-o)/6e4),{value:a}=await e.showDialog({title:r.default('stopPlayTimeTitle'),text:r.default('stopPlayTimeText',s.toString()),icon:'warning',confirmButtonText:r.default('confirm'),cancelButtonText:r.default('cancel'),showCancelButton:!0});if(!a){return}let n=new g.default(t.globalOptions.ASF);try{if(!await n.init()){return}if(!await n.stopPlayGames()){return}const t=GM_getValue('taskLink',[])||[];for(const e of t){GM_openInTab(e,{active:!0})}GM_setValue('stopPlayTime',0),GM_setValue('playedGames',[]),GM_setValue('taskLink',[])}catch(t){console.error('SteamASF operation failed:',t)}finally{n?.dispose(),n=null}})(),(()=>{d.debug('检查版本和通知');const{scriptHandler:t}=GM_info;if('Tampermonkey'===t){const[t,e]=GM_info.version?.split('.')||[];parseInt(t,10)>=5&&parseInt(e,10)>=2||c.default({}).error(r.default('versionNotMatched'))}else{if('Violentmonkey'===t){return d.debug('未知脚本管理器',{scriptHandler:t}),void c.default({}).warning(r.default('unknownScriptHandler'))}{const[t,e]=GM_info.version?.split('.')||[];parseInt(t,10)>=2&&parseInt(e,10)>=36||c.default({}).error(r.default('versionNotMatched'))}}GM_getValue('notice')||(e.showDialog({title:r.default('installNotice'),icon:'warning'}).then((({isConfirmed:t})=>{t&&(GM_openInTab(r.default('noticeLink'),{active:!0}),GM_setValue('notice',(new Date).getTime()))})),c.default({html:`<li><font class="warning">${r.default('echoNotice',r.default('noticeLink'))}</font></li>`}).font?.find('a').on('click',(()=>{GM_setValue('notice',(new Date).getTime())})))})(),(async()=>{try{d.debug('开始检查更新流程');const e=GM_info.script.version,o=t.globalOptions.other.autoUpdateSource;d.debug('当前配置',{currentVersion:e,updateSource:o});let s=!1;if(['github','jsdelivr','standby'].includes(o.toLowerCase())){d.debug('使用指定的更新源',{updateSource:o});const t=G(o);s=await _(t,!1)}else{d.debug('按优先级尝试不同的更新源');for(const t of['github','jsdelivr','standby']){if(d.debug('尝试更新源',{source:t}),s=await _(S[t],!0),s){d.debug('成功获取更新信息',{source:t});break}}}if(!s){return d.debug('所有更新源检查失败'),void c.default({}).error(r.default('checkUpdateFailed'))}L(s,e,G(o))}catch(t){d.debug('更新检查过程发生错误',{error:t}),T(t,'updateChecker')}})()},O=async()=>{try{if(await o.handleSteamAuthPage({namespace:a.moduleNamespace('steam'),gm:a.projectGM('steam')})){return}if(await s.handleTwitchAuthPage({namespace:a.moduleNamespace('twitch'),gm:a.projectGM('twitch')})){return}'key-hub.eu'===window.location.hostname&&(unsafeWindow.keyhubtracker=1,unsafeWindow.gaData={}),await M()}catch(t){d.debug('主程序入口发生异常',{error:t})}};'opquests.com'===window.location.hostname?O():$(O)}(AutoTaskWebsite.globalOptions,AutoTaskWebsite.dialog,AutoTaskModules.steam,AutoTaskModules.twitch,AutoTaskWebsite.moduleBridge,AutoTaskWebsite,AutoTaskWebsite.options,AutoTaskWebsite.i18n,AutoTaskWebsite.globalOptionsEdit,browser,AutoTaskWebsite.debug,AutoTaskWebsite.echoLog,AutoTaskWebsite.SteamASF);
