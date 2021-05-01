"use strict";function _createForOfIteratorHelper(a,t){var e;if("undefined"==typeof Symbol||null==a[Symbol.iterator]){if(Array.isArray(a)||(e=_unsupportedIterableToArray(a))||t&&a&&"number"==typeof a.length){e&&(a=e);var r=0,t=function(){};return{s:t,n:function(){return r>=a.length?{done:!0}:{done:!1,value:a[r++]}},e:function(a){throw a},f:t}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var n,c=!0,o=!1;return{s:function(){e=a[Symbol.iterator]()},n:function(){var a=e.next();return c=a.done,a},e:function(a){o=!0,n=a},f:function(){try{c||null==e.return||e.return()}finally{if(o)throw n}}}}function _slicedToArray(a,t){return _arrayWithHoles(a)||_iterableToArrayLimit(a,t)||_unsupportedIterableToArray(a,t)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(a,t){if(a){if("string"==typeof a)return _arrayLikeToArray(a,t);var e=Object.prototype.toString.call(a).slice(8,-1);return"Map"===(e="Object"===e&&a.constructor?a.constructor.name:e)||"Set"===e?Array.from(a):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?_arrayLikeToArray(a,t):void 0}}function _arrayLikeToArray(a,t){(null==t||t>a.length)&&(t=a.length);for(var e=0,r=new Array(t);e<t;e++)r[e]=a[e];return r}function _iterableToArrayLimit(a,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a)){var e=[],r=!0,n=!1,c=void 0;try{for(var o,i=a[Symbol.iterator]();!(r=(o=i.next()).done)&&(e.push(o.value),!t||e.length!==t);r=!0);}catch(a){n=!0,c=a}finally{try{r||null==i.return||i.return()}finally{if(n)throw c}}return e}}function _arrayWithHoles(a){if(Array.isArray(a))return a}function formatTaskLink(a){for(var t="",e=a.toFinalUrl,r=0,n=Object.entries(a);r<n.length;r++){var c=_slicedToArray(n[r],2),o=c[0],c=c[1];if("toFinalUrl"!==o&&"toGuild"!==o){var i,l=_createForOfIteratorHelper(c);try{for(l.s();!(i=l.n()).done;){var s=e[i.value];switch(o){case"groups":t+='<li class="card-text">Steam Group: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"forums":t+='<li class="card-text">Steam Forum: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"curators":t+='<li class="card-text">Steam Curator: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"publishers":t+='<li class="card-text">Steam Publisher: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"developers":t+='<li class="card-text">Steam Developer: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"franchises":t+='<li class="card-text">Steam Franchise: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"fGames":t+='<li class="card-text">Followed Steam Game: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"wGames":t+='<li class="card-text">Steam Wishlist: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"discords":t+='<li class="card-text">Discord Server: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"instagrams":t+='<li class="card-text">Instagram User: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"twitchs":t+='<li class="card-text">Twitch Channel: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"reddits":t+='<li class="card-text">Reddit: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"youtubeChannels":t+='<li class="card-text">Youtube Channel: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"youtubeVideos":t+='<li class="card-text">Youtube Video: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"vks":t+='<li class="card-text">VK: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>")}}}catch(a){l.e(a)}finally{l.f()}}}return t}window.addCard=function(a){return'<div id="'.concat(a.time,'" class="card text-center" ').concat(((new Date).getTime()-a.time)/864e5>=parseInt(window.delayNoticeTime)?'style="background-color:#ebf9ec"':"",'>\n  <div class="card-header">\n    <a href="').concat(a.link,'" target="_blank">').concat(a.link,'</a>\n    <a href="javascript:neverNotice(').concat(a.time,')" data-time="').concat(a.time,'" class="btn ').concat(a.neverNotice?"btn-primary":"btn-outline-primary",' never-notice">\n      <svg class="never-notice" t="1619782030545" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="592" width="16" height="16"><path d="M222.487273 735.162182a34.909091 34.909091 0 0 0 21.876363-32.395637V425.285818c0-122.949818 87.202909-230.795636 207.336728-256.488727a34.909091 34.909091 0 0 0 26.600727-25.832727A34.676364 34.676364 0 0 1 512 116.363636c16.011636 0 29.882182 10.938182 33.722182 26.624a34.909091 34.909091 0 0 0 26.600727 25.809455c64.046545 13.707636 118.551273 50.897455 155.671273 101.143273L162.769455 835.165091c-22.365091-5.12-37.818182-10.402909-45.684364-15.36 5.678545-28.532364 44.962909-60.322909 105.402182-84.642909M779.636364 425.285818V700.974545c0 14.312727 8.750545 27.182545 22.039272 32.465455 61.114182 24.203636 99.560727 54.993455 105.239273 83.618909-29.789091 19.060364-167.051636 44.893091-394.984727 45.661091-109.847273-0.069818-198.516364-5.725091-264.378182-13.637818l515.304727-515.304727c10.798545 28.695273 16.756364 59.554909 16.756364 91.461818M82.804364 880.314182a160.581818 160.581818 0 0 0 24.110545 10.705454L68.421818 929.512727a34.909091 34.909091 0 1 0 49.338182 49.338182l68.189091-68.189091c66.862545 11.729455 153.972364 18.757818 245.876364 21.108364A81.221818 81.221818 0 0 0 512 1000.727273a81.221818 81.221818 0 0 0 80.267636-69.515637c154.624-5.003636 296.331636-23.04 349.323637-53.876363 29.742545-17.291636 35.909818-38.562909 35.84-53.341091-0.162909-57.064727-45.405091-108.404364-128-146.059637V425.285818c0-51.269818-12.171636-100.328727-33.652364-144.407273L961.396364 135.214545A34.909091 34.909091 0 1 0 912.058182 85.876364l-134.283637 134.260363c-42.914909-54.458182-102.469818-95.744-171.892363-114.967272A104.285091 104.285091 0 0 0 512 46.522182a104.261818 104.261818 0 0 0-93.858909 58.647273C275.874909 144.523636 174.545455 276.154182 174.545455 425.285818V679.796364c-82.967273 38.260364-128.186182 90.065455-128 147.362909 0.046545 14.801455 6.376727 36.026182 36.235636 53.108363" fill="').concat(a.neverNotice?"#fff":"#1296db",'" p-id="593"></path></svg>\n    </a>\n    <a href="javascript:deleteNotice(').concat(a.time,')" class="btn delete btn-outline-danger">\n      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">\n        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>\n        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>\n      </svg>\n    </a>\n  </div>\n  <div class="card-body">\n    <h5 class="card-title">Tasks</h5>\n    <ul>\n    ').concat(formatTaskLink(a.taskInfo),"\n    </ul>\n    <a href=\"javascript:remove('").concat(a.time,'\')" class="btn btn-primary">Remove</a>\n  </div>\n  <div class="card-footer text-muted">\n    ').concat(dayjs(a.time).format("YYYY-MM-DD HH:mm:ss"),"\n  </div>\n</div>")};
