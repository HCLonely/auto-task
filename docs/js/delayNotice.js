"use strict";function _createForOfIteratorHelper(a,t){var e;if("undefined"==typeof Symbol||null==a[Symbol.iterator]){if(Array.isArray(a)||(e=_unsupportedIterableToArray(a))||t&&a&&"number"==typeof a.length){e&&(a=e);var r=0,t=function(){};return{s:t,n:function(){return r>=a.length?{done:!0}:{done:!1,value:a[r++]}},e:function(a){throw a},f:t}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var n,c=!0,o=!1;return{s:function(){e=a[Symbol.iterator]()},n:function(){var a=e.next();return c=a.done,a},e:function(a){o=!0,n=a},f:function(){try{c||null==e.return||e.return()}finally{if(o)throw n}}}}function _slicedToArray(a,t){return _arrayWithHoles(a)||_iterableToArrayLimit(a,t)||_unsupportedIterableToArray(a,t)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(a,t){if(a){if("string"==typeof a)return _arrayLikeToArray(a,t);var e=Object.prototype.toString.call(a).slice(8,-1);return"Map"===(e="Object"===e&&a.constructor?a.constructor.name:e)||"Set"===e?Array.from(a):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?_arrayLikeToArray(a,t):void 0}}function _arrayLikeToArray(a,t){(null==t||t>a.length)&&(t=a.length);for(var e=0,r=new Array(t);e<t;e++)r[e]=a[e];return r}function _iterableToArrayLimit(a,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a)){var e=[],r=!0,n=!1,c=void 0;try{for(var o,l=a[Symbol.iterator]();!(r=(o=l.next()).done)&&(e.push(o.value),!t||e.length!==t);r=!0);}catch(a){n=!0,c=a}finally{try{r||null==l.return||l.return()}finally{if(n)throw c}}return e}}function _arrayWithHoles(a){if(Array.isArray(a))return a}function formatTaskLink(a){for(var t="",e=a.toFinalUrl,r=0,n=Object.entries(a);r<n.length;r++){var c=_slicedToArray(n[r],2),o=c[0],c=c[1];if("toFinalUrl"!==o&&"toGuild"!==o){var l,i=_createForOfIteratorHelper(c);try{for(i.s();!(l=i.n()).done;){var s=e[l.value];switch(o){case"groups":t+='<li class="card-text">Steam Group: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"forums":t+='<li class="card-text">Steam Forum: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"curators":t+='<li class="card-text">Steam Curator: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"publishers":t+='<li class="card-text">Steam Publisher: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"developers":t+='<li class="card-text">Steam Developer: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"franchises":t+='<li class="card-text">Steam Franchise: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"fGames":t+='<li class="card-text">Followed Steam Game: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"wGames":t+='<li class="card-text">Steam Wishlist: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"discords":t+='<li class="card-text">Discord Server: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"instagrams":t+='<li class="card-text">Instagram User: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"twitchs":t+='<li class="card-text">Twitch Channel: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"reddits":t+='<li class="card-text">Reddit: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"youtubeChannels":t+='<li class="card-text">Youtube Channel: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"youtubeVideos":t+='<li class="card-text">Youtube Video: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>");break;case"vks":t+='<li class="card-text">VK: <a href="'.concat(s,'" target="_blank">').concat(s,"</a></li>")}}}catch(a){i.e(a)}finally{i.f()}}}return t}window.addCard=function(a){return'<div id="'.concat(a.time,'" class="card text-center" ').concat(((new Date).getTime()-a.time)/864e5>=parseInt(window.delayNoticeTime)?'style="background-color:#ebf9ec"':"",'>\n  <div class="card-header">\n    <a href="').concat(a.link,'" target="_blank">').concat(a.link,'</a>\n    <a href="javascript:deleteNotice(').concat(a.time,')" class="btn delete btn-outline-danger">\n      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">\n        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>\n        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>\n      </svg>\n    </a>\n  </div>\n  <div class="card-body">\n    <h5 class="card-title">Tasks</h5>\n    <ul>\n    ').concat(formatTaskLink(a.taskInfo),"\n    </ul>\n    <a href=\"javascript:remove('").concat(a.time,'\')" class="btn btn-primary">Remove</a>\n  </div>\n  <div class="card-footer text-muted">\n    ').concat(dayjs(a.time).format("YYYY-MM-DD HH:mm:ss"),"\n  </div>\n</div>")};
