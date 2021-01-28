"use strict";function _slicedToArray(a,t){return _arrayWithHoles(a)||_iterableToArrayLimit(a,t)||_unsupportedIterableToArray(a,t)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArrayLimit(a,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a)){var r=[],e=!0,n=!1,c=void 0;try{for(var o,l=a[Symbol.iterator]();!(e=(o=l.next()).done)&&(r.push(o.value),!t||r.length!==t);e=!0);}catch(a){n=!0,c=a}finally{try{e||null==l.return||l.return()}finally{if(n)throw c}}return r}}function _arrayWithHoles(a){if(Array.isArray(a))return a}function _createForOfIteratorHelper(a,t){var r;if("undefined"==typeof Symbol||null==a[Symbol.iterator]){if(Array.isArray(a)||(r=_unsupportedIterableToArray(a))||t&&a&&"number"==typeof a.length){r&&(a=r);var e=0,n=function(){};return{s:n,n:function(){return e>=a.length?{done:!0}:{done:!1,value:a[e++]}},e:function(a){throw a},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var c,o=!0,l=!1;return{s:function(){r=a[Symbol.iterator]()},n:function(){var a=r.next();return o=a.done,a},e:function(a){l=!0,c=a},f:function(){try{o||null==r.return||r.return()}finally{if(l)throw c}}}}function _unsupportedIterableToArray(a,t){if(a){if("string"==typeof a)return _arrayLikeToArray(a,t);var r=Object.prototype.toString.call(a).slice(8,-1);return"Object"===r&&a.constructor&&(r=a.constructor.name),"Map"===r||"Set"===r?Array.from(a):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(a,t):void 0}}function _arrayLikeToArray(a,t){(null==t||t>a.length)&&(t=a.length);for(var r=0,e=new Array(t);r<t;r++)e[r]=a[r];return e}function formatTaskLink(a){var t,r="",e=a.toFinalUrl,n=_createForOfIteratorHelper(a);try{for(n.s();!(t=n.n()).done;){var c=_slicedToArray(t.value,2),o=c[0],l=e[c[1]];switch(o){case"groups":r+='<li class="card-text">Steam Group: <a href="'.concat(l,'" target="_blank">').concat(l,"</a></li>");break;case"forums":r+='<li class="card-text">Steam Forum: <a href="'.concat(l,'" target="_blank">').concat(l,"</a></li>");break;case"curators":r+='<li class="card-text">Steam Curator: <a href="'.concat(l,'" target="_blank">').concat(l,"</a></li>");break;case"publishers":r+='<li class="card-text">Steam Publisher: <a href="'.concat(l,'" target="_blank">').concat(l,"</a></li>");break;case"developers":r+='<li class="card-text">Steam Developer: <a href="'.concat(l,'" target="_blank">').concat(l,"</a></li>");break;case"franchises":r+='<li class="card-text">Steam Franchise: <a href="'.concat(l,'" target="_blank">').concat(l,"</a></li>");break;case"fGames":r+='<li class="card-text">Followed Steam Game: <a href="'.concat(l,'" target="_blank">').concat(l,"</a></li>");break;case"wGames":r+='<li class="card-text">Steam Wishlist: <a href="'.concat(l,'" target="_blank">').concat(l,"</a></li>");break;case"discords":r+='<li class="card-text">Discord Server: <a href="'.concat(l,'" target="_blank">').concat(l,"</a></li>");break;case"instagrams":r+='<li class="card-text">Instagram User: <a href="'.concat(l,'" target="_blank">').concat(l,"</a></li>");break;case"twitchs":r+='<li class="card-text">Twitch Channel: <a href="'.concat(l,'" target="_blank">').concat(l,"</a></li>");break;case"reddits":r+='<li class="card-text">Reddit: <a href="'.concat(l,'" target="_blank">').concat(l,"</a></li>");break;case"youtubeChannels":r+='<li class="card-text">Youtube Channel: <a href="'.concat(l,'" target="_blank">').concat(l,"</a></li>");break;case"youtubeVideos":r+='<li class="card-text">Youtube Video: <a href="'.concat(l,'" target="_blank">').concat(l,"</a></li>");break;case"vks":r+='<li class="card-text">VK: <a href="'.concat(l,'" target="_blank">').concat(l,"</a></li>")}}}catch(a){n.e(a)}finally{n.f()}return r}window.addCard=function(a){return'<div class="card text-center">\n  <div class="card-header">\n    <a href="'.concat(a.link,'" target="_blank">').concat(a.link,'</a>\n  </div>\n  <div class="card-body">\n    <h5 class="card-title">Tasks</h5>\n    <ul>\n    ').concat(formatTaskLink(a.taskInfo),'\n    </ul>\n    <a href="#" class="btn btn-primary">Remove</a>\n  </div>\n  <div class="card-footer text-muted">\n    ').concat(dayjs(a.time).format("YYYY-MM-DD HH:mm:ss"),"\n  </div>\n</div>")};
