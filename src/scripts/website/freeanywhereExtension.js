/*
 * @Author       : HCLonely
 * @Date         : 2025-08-05 10:24:24
 * @LastEditTime : 2025-08-18 19:07:22
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/website/freeanywhereExtension.js
 * @Description  : https://freeanywhere.net/
 */

export default function fawExtension() {
  const hostname = window.location.hostname;

  function IsJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  $(window).on('load', function () {
    console.log('👌 gamesforfarm extension');

    if (hostname == 'freeanywhere.net' || hostname == 'give.gamesforfarm.local' || hostname == "gamesforfarm-testing.ru") {

      const steam = $(".games_for_farm_site").data('steam');
      const avatar = $(".games_for_farm_site").data('avatar');
      const name = $(".games_for_farm_site").data('name');
      const lang = $(".games_for_farm_site").data('lang');
      let need_update = true;

      GM_addValueChangeListener('FAW_STORAGE', function (newValue, oldValue) {
        if (need_update == false) return;
        GM_getValue('FAW_STORAGE', function (STORAGE) {
          $.ajax({
            type: 'POST',
            url: '/php/extension/user_data_update.php',
            data: { extension: JSON.stringify(STORAGE) },
            success: function (data) {
              // console.log("user_data_update");
              // console.log(data);
            }
          });
        });
      });

      const STORAGE = GM_getValue('FAW_STORAGE') || {};
      // chrome.storage.local.get(function (STORAGE) {
      if (Object.keys(STORAGE).length === 0 || !STORAGE['tasks'] || !STORAGE['user'] || !STORAGE['games'] || !STORAGE['settings']) {
        GM_deleteValue('FAW_STORAGE');
        // chrome.storage.local.clear();

        let new_storage = {};
        new_storage['tasks'] = {};
        new_storage['user'] = {};
        new_storage['games'] = {};
        new_storage['settings'] = {};

        if (steam) new_storage['user']['steam'] = steam;
        if (avatar) new_storage['user']['avatar'] = avatar;
        if (name) new_storage['user']['name'] = name;
        if (lang) new_storage['user']['lang'] = lang;

        if (steam) {
          $.ajax({
            type: 'POST',
            url: '/php/extension/user_games_get.php',
            data: { steam: steam },
            success: function (data) {
              // console.log(data);
              if (data != '' && IsJsonString(data)) {
                const user_games = JSON.parse(data);
                new_storage['games'] = user_games;
                new_storage['settings']['game_update'] = parseInt(Date.now() / 1000);
                GM_setValue('FAW_STORAGE', new_storage);
                // chrome.storage.local.set(new_storage);
              }
            }
          });
        } else {
          GM_setValue('FAW_STORAGE', new_storage);
          // chrome.storage.local.set(new_storage);
        }
      }

      if (STORAGE['user'] && STORAGE['settings'] && STORAGE['user']['steam']) {
        if (!STORAGE['settings']['game_update']) STORAGE['settings']['game_update'] = 0;
        let time_now = parseInt(Date.now() / 1000);
        let time_update = parseInt(STORAGE['settings']['game_update']);
        if (time_now - time_update > (60 * 60 * 24)) {
          $.ajax({
            type: 'POST',
            url: '/php/extension/user_games_get.php',
            data: { steam: STORAGE['user']['steam'] },
            success: function (data) {
              // console.log(data);
              if (data != '' && IsJsonString(data)) {
                const games = JSON.parse(data);
                STORAGE['games'] = games;
                STORAGE['settings']['game_update'] = parseInt(Date.now() / 1000);
                GM_setValue('FAW_STORAGE', STORAGE);
                // chrome.storage.local.set(STORAGE);
              }
            }
          });
        }
      }

      if (steam && STORAGE['user']) {
        if (!STORAGE['user']['steam']) STORAGE['user']['steam'] = steam;
        if (STORAGE['user']['steam'] != steam) {
          $.ajax({
            type: 'POST',
            url: '/php/extension/user_data_get.php',
            data: { steam: steam },
            success: function (data) {
              // console.log(data);
              if (!data) return;
              const db_storage = JSON.parse(data);
              if (db_storage) {
                GM_deleteValue('FAW_STORAGE');
                // chrome.storage.local.clear(function () {
                need_update = false;
                GM_setValue('FAW_STORAGE', db_storage);
                // chrome.storage.local.set(db_storage);
                setTimeout(function () { need_update = true; }, 100);
                // });
              }
            }
          });
        } else {
          if (avatar) STORAGE['user']['avatar'] = avatar;
          if (name) STORAGE['user']['name'] = name;
          if (lang) STORAGE['user']['lang'] = lang;
          GM_setValue('FAW_STORAGE', STORAGE);
          // chrome.storage.local.set({ "user": STORAGE['user'] });
        }
      }

      if (STORAGE['tasks']) {
        let update_tasks = [];
        let is_update = false;
        let time_now = parseInt(Date.now() / 1000);
        $.each(STORAGE['tasks'], function (index, val) {
          if (val["time"] && (time_now - parseInt(val["time"])) > (2 * 60 * 60)) { is_update = true; return; }
          update_tasks.push(val);
        });

        if (is_update == true) {
          STORAGE['tasks'] = update_tasks;
          GM_setValue('FAW_STORAGE', STORAGE);
          // chrome.storage.local.set({ "tasks": STORAGE['tasks'] });
        }
      }

      if (STORAGE["discord"]) {
        if (STORAGE["discord"] && STORAGE["discord"].length > 0) {
          $.ajax({
            type: 'POST',
            url: '/php/extension/discord_levels_update.php',
            data: { discord: JSON.stringify(STORAGE["discord"]) },
            success: function (data) {
              // console.log(data);
              if (data.indexOf('success') != -1) {
                alert("Данные discord уровней обновлены");
                delete STORAGE["discord"]
                GM_setValue('FAW_STORAGE', STORAGE);
                // chrome.storage.local.remove('discord');
              } else {
                alert("Возникла ошибка при обновлении discord уровней");
                delete STORAGE["discord"]
                GM_setValue('FAW_STORAGE', STORAGE);
                // chrome.storage.local.remove('discord');
              }
            },
            error: function () {
              alert("Возникла ошибка при обновлении discord уровней");
              delete STORAGE["discord"]
              GM_setValue('FAW_STORAGE', STORAGE);
              // chrome.storage.local.remove('discord');
            }
          });
        }
      }

      // });

      function check_tasks_button() {
        let tasks_done = true;
        $(".game__content-tasks__task").each(function (index, el) {
          if ($(this).hasClass('done') == false) tasks_done = false;
        });

        if (tasks_done == true) {
          $(".js-get-key").removeClass('inactive');
        } else {
          $(".js-get-key").addClass('inactive');
        }
      }

      if ($(".games_for_farm_extension.work").length > 0) {
        $(".games_for_farm_extension.not_work").remove();
        $(".games_for_farm_extension.work").slideDown(200);
      }

      if ($(".game__content-tasks__task .task-check-extension").length > 0) {
        $(".task-check-extension").removeClass("js-extentions-modal");
        $(".game__content-tasks__task[data-extension='1'] .task-link a").removeClass("js-extentions-modal");
        $(".game__content-tasks__task .task-check-extension").on('click', function (event) {
          event.preventDefault();
          let $button = $(this);
          if ($button.hasClass('loading')) return;

          let $parrent = $(this).parent('.game__content-tasks__task');
          const type = $parrent.data('type');
          const id = $parrent.data('id');
          const data = $parrent.data('data');
          const extension = $parrent.data('extension');
          if (extension == false) return;

          $button.addClass('loading');
          const STORAGE = GM_getValue('FAW_STORAGE') || {};
          // chrome.storage.local.get(function (STORAGE) {
          $.ajax({
            type: 'POST',
            url: '/php/extension/user_data_update.php',
            data: { extension: JSON.stringify(STORAGE) },
            success: function (update) {
              // console.log(update);
              const getTime_start = new Date().getTime();
              $.ajax({
                type: 'POST',
                url: '/php/extension/user_task_update.php',
                data: { id: id, type: type, data: data },
                success: function (data) {
                  // console.log(data);
                  const getTime_end = new Date().getTime();
                  console.log('👌 checking task in ' + (getTime_end - getTime_start) + ' ms');

                  if (data.indexOf('good') != -1) {
                    setTimeout(function () {
                      $parrent.addClass('done');
                      $parrent.removeClass('error');
                      $button.removeClass('loading');
                      check_tasks_button();
                    }, 1250);
                  } else if (data.indexOf('bad') != -1) {
                    setTimeout(function () {
                      $parrent.addClass('error');
                      $parrent.removeClass('done');
                      $button.removeClass('loading');
                      check_tasks_button();
                    }, 1250);
                  } else {
                    setTimeout(function () {
                      $parrent.removeClass('error');
                      $parrent.removeClass('done');
                      $button.removeClass('loading');
                      check_tasks_button();
                    }, 1250);
                  }
                },
                error: function () {
                  setTimeout(function () {
                    $parrent.removeClass('error');
                    $parrent.removeClass('done');
                    $button.removeClass('loading');
                    check_tasks_button();
                  }, 1250);
                }
              });

            },
            error: function () {
              setTimeout(function () {
                $parrent.removeClass('error');
                $parrent.removeClass('done');
                $button.removeClass('loading');
                check_tasks_button();
              }, 1250);
            }
          });
        });
        // });
      }
    }

    function storage_tasks_update(tasks, type, value, action) {
      let result = [];
      let is_find = false;

      $.each(tasks, function (index, val) {
        if (!val["type"] || !val["data"]) return;
        if (val["type"] == type && val["data"] == value) { is_find = true; return; }
        result.push(val);
      });

      const obj = {};
      switch (action) {
        case "add":
          if (is_find == true) return;
          const task = {};
          task["type"] = type;
          task["data"] = value;
          task["time"] = parseInt(Date.now() / 1000);
          result.push(task);

          obj['tasks'] = result;
          GM_setValue('FAW_STORAGE', obj);
          // chrome.storage.local.set(obj);
          break;

        case "remove":
          if (is_find == false) return;
          obj['tasks'] = result;
          GM_setValue('FAW_STORAGE', obj);
        // chrome.storage.local.set(obj);
      }
    }

    if (hostname == 'store.steampowered.com' || hostname == 'steamcommunity.com') {

      if (document.querySelector("span[id^='CuratorUnFollowBtn_']")) {
        const curator_id = $("span[id^='CuratorUnFollowBtn_']").attr('id').split('_')[1];
        const follow_btn = "#CuratorFollowBtn_" + curator_id;
        const unfollow_btn = "#CuratorUnFollowBtn_" + curator_id;

        const STORAGE = GM_getValue('FAW_STORAGE') || {};
        // chrome.storage.local.get('tasks', function (STORAGE) {
        if (!STORAGE["tasks"]) return;
        const follow = $(follow_btn).css('display');
        const unfollow = $(unfollow_btn).css('display');

        if (unfollow && unfollow == "none") {
          storage_tasks_update(STORAGE["tasks"], 'steam_curator_sub', curator_id, 'remove');
        }
        if (follow && follow == "none") {
          storage_tasks_update(STORAGE["tasks"], 'steam_curator_sub', curator_id, 'add');
        }
        // });

        $(follow_btn).on('click', function (event) {
          const STORAGE = GM_getValue('FAW_STORAGE') || {};
          // chrome.storage.local.get('tasks', function (STORAGE) {
          if (!STORAGE["tasks"]) return;
          storage_tasks_update(STORAGE["tasks"], 'steam_curator_sub', curator_id, 'add');
          // });
        });

        $(unfollow_btn).on('click', function (event) {
          const STORAGE = GM_getValue('FAW_STORAGE') || {};
          // chrome.storage.local.get('tasks', function (STORAGE) {
          if (!STORAGE["tasks"]) return;
          storage_tasks_update(STORAGE["tasks"], 'steam_curator_sub', curator_id, 'remove');
          // });
        });
      }


      if (document.querySelector(".followStatsBlock")) {
        const user_id = $("#HeaderUserInfoName a").attr('href').split('/').pop();
        const follow_btn = "#FollowUserOptionAdd";
        const unfollow_btn = "#FollowUserOptionFollowing, .followOption.remove";

        const STORAGE = GM_getValue('FAW_STORAGE') || {};
        // chrome.storage.local.get('tasks', function (STORAGE) {
        if (!STORAGE["tasks"]) return;
        const follow = $(follow_btn).css('visibility');
        const unfollow = $(unfollow_btn).css('visibility');

        if (unfollow && unfollow == "hidden") {
          storage_tasks_update(STORAGE["tasks"], 'steam_guides_sub', user_id, 'remove');
        }
        if (follow && follow == "hidden") {
          storage_tasks_update(STORAGE["tasks"], 'steam_guides_sub', user_id, 'add');
        }
        // });

        $(follow_btn).on('click', function (event) {
          const STORAGE = GM_getValue('FAW_STORAGE') || {};
          // chrome.storage.local.get('tasks', function (STORAGE) {
          if (!STORAGE["tasks"]) return;
          storage_tasks_update(STORAGE["tasks"], 'steam_guides_sub', user_id, 'add');
          // });
        });

        $(unfollow_btn).on('click', function (event) {
          const STORAGE = GM_getValue('FAW_STORAGE') || {};
          // chrome.storage.local.get('tasks', function (STORAGE) {
          if (!STORAGE["tasks"]) return;
          storage_tasks_update(STORAGE["tasks"], 'steam_guides_sub', user_id, 'remove');
          // });
        });
      }


      if (document.querySelector("#ScrollingItemControls")) {
        const manual_id = $("#PublishedFileFavorite input[name='id']").val();
        const follow_btn = "#FavoriteItemOptionAdd";
        const unfollow_btn = "#FavoriteItemOptionFavorited, .favoriteOption.removefavorite";

        const STORAGE = GM_getValue('FAW_STORAGE') || {};
        // chrome.storage.local.get('tasks', function (STORAGE) {
        if (!STORAGE["tasks"]) return;
        const follow = $(follow_btn).css('visibility');
        const unfollow = $(unfollow_btn).css('visibility');

        if (unfollow && unfollow == "hidden") {
          storage_tasks_update(STORAGE["tasks"], 'steam_manual_favourite', manual_id, 'remove');
        }
        if (follow && follow == "hidden") {
          storage_tasks_update(STORAGE["tasks"], 'steam_manual_favourite', manual_id, 'add');
        }
        // });

        $(follow_btn).on('click', function (event) {
          const STORAGE = GM_getValue('FAW_STORAGE') || {};
          // chrome.storage.local.get('tasks', function (STORAGE) {
          if (!STORAGE["tasks"]) return;
          storage_tasks_update(STORAGE["tasks"], 'steam_manual_favourite', manual_id, 'add');
          // });
        });

        $(unfollow_btn).on('click', function (event) {
          const STORAGE = GM_getValue('FAW_STORAGE') || {};
          // chrome.storage.local.get('tasks', function (STORAGE) {
          if (!STORAGE["tasks"]) return;
          storage_tasks_update(STORAGE["tasks"], 'steam_manual_favourite', manual_id, 'remove');
          // });
        });
      }

      if (document.querySelector("#queueBtnFollow")) {
        const game_id = $(".game_page_background").data('miniprofile-appid');
        const follow_btn = "#queueBtnFollow .queue_btn_inactive";
        const unfollow_btn = "#queueBtnFollow .queue_btn_active";

        const STORAGE = GM_getValue('FAW_STORAGE') || {};
        // chrome.storage.local.get('tasks', function (STORAGE) {
        if (!STORAGE["tasks"]) return;
        const follow = $(follow_btn).css('display');
        const unfollow = $(unfollow_btn).css('display');

        if (unfollow && unfollow == "none") {
          storage_tasks_update(STORAGE["tasks"], 'steam_game_sub', game_id, 'remove');
        }
        if (follow && follow == "none") {
          storage_tasks_update(STORAGE["tasks"], 'steam_game_sub', game_id, 'add');
        }
        // });

        $(follow_btn).on('click', function (event) {
          const STORAGE = GM_getValue('FAW_STORAGE') || {};
          // chrome.storage.local.get('tasks', function (STORAGE) {
          if (!STORAGE["tasks"]) return;
          storage_tasks_update(STORAGE["tasks"], 'steam_game_sub', game_id, 'add');
          // });
        });

        $(unfollow_btn).on('click', function (event) {
          const STORAGE = GM_getValue('FAW_STORAGE') || {};
          // chrome.storage.local.get('tasks', function (STORAGE) {
          if (!STORAGE["tasks"]) return;
          storage_tasks_update(STORAGE["tasks"], 'steam_game_sub', game_id, 'remove');
          // });
        });
      }
    }

    if (hostname == 'www.youtube.com' || hostname == 'm.youtube.com') {

      setInterval(function () {
        if (document.querySelector("yt-subscribe-button-view-model")) {
          const channel_id = $('meta[itemprop="identifier"]').attr('content');
          const subscribe = ["Подписаться", "Падпісацца", "Підписатися", "Abonnieren", "Subscribe", "Suscribirse", "Mag-subscribe", "S'abonner", "Iscriviti", "Subskrybuj", "Subscrever", "Abonează-te", "订阅", "チャンネル登録", "訂閱"];
          const subscribed = ["Вы подписаны", "Вы падпісаны", "Ви підписалися", "Abonniert", "Subscribed", "Suscrito", "Naka-subscribe", "Abonné", "Iscritto", "Subskrybujesz", "Subscrito", "Abonat(ă)", "已订阅", "登録済み", "已訂閱"];
          const $parent = $("yt-subscribe-button-view-model");
          const text = $parent.text();

          if (subscribe.indexOf(text) != -1 || subscribed.indexOf(text) != -1) {
            if (subscribe.indexOf(text) != -1) {
              const STORAGE = GM_getValue('FAW_STORAGE') || {};
              // chrome.storage.local.get('tasks', function (STORAGE) {
              if (!STORAGE["tasks"]) return;
              storage_tasks_update(STORAGE["tasks"], 'youtube_channel_sub', channel_id, 'remove');
              // });
            }

            if (subscribed.indexOf(text) != -1) {
              const STORAGE = GM_getValue('FAW_STORAGE') || {};
              // chrome.storage.local.get('tasks', function (STORAGE) {
              if (!STORAGE["tasks"]) return;
              storage_tasks_update(STORAGE["tasks"], 'youtube_channel_sub', channel_id, 'add');
              // });
            }
          } else {

            if ($(".ytSubscribePlusButtonViewModelHost").length != 0) {
              const STORAGE = GM_getValue('FAW_STORAGE') || {};
              // chrome.storage.local.get('tasks', function (STORAGE) {
              if (!STORAGE["tasks"]) return;
              storage_tasks_update(STORAGE["tasks"], 'youtube_channel_sub', channel_id, 'add');
              // });
            } else {
              const color = $parent.find('button').css('color');

              if (color == "#0f0f0f" || color == "rgb(15, 15, 15)") {
                const STORAGE = GM_getValue('FAW_STORAGE') || {};
                // chrome.storage.local.get('tasks', function (STORAGE) {
                if (!STORAGE["tasks"]) return;
                storage_tasks_update(STORAGE["tasks"], 'youtube_channel_sub', channel_id, 'remove');
                // });
              }

              if (color == "#f1f1f1" || color == "rgb(241, 241, 241)") {
                const STORAGE = GM_getValue('FAW_STORAGE') || {};
                // chrome.storage.local.get('tasks', function (STORAGE) {
                if (!STORAGE["tasks"]) return;
                storage_tasks_update(STORAGE["tasks"], 'youtube_channel_sub', channel_id, 'add');
                // });
              }
            }
          }

        }

        if (document.querySelector(".ytLikeButtonViewModelHost")) {
          const url = window.location.href;
          let video_id;
          if (hostname == "m.youtube.com") {
            video_id = $('link[rel="canonical"]').attr('href').split('v=').pop();
          } else {
            video_id = $('meta[itemprop="identifier"]').attr('content');
          }

          if ($(".ytLikeButtonViewModelHost button").attr('aria-pressed') == "false") {
            const STORAGE = GM_getValue('FAW_STORAGE') || {};
            // chrome.storage.local.get('tasks', function (STORAGE) {
            if (!STORAGE["tasks"]) return;
            storage_tasks_update(STORAGE["tasks"], 'youtube_video_like', video_id, 'remove');
            // });
          }

          if ($(".ytLikeButtonViewModelHost button").attr('aria-pressed') == "true") {
            const STORAGE = GM_getValue('FAW_STORAGE') || {};
            // chrome.storage.local.get('tasks', function (STORAGE) {
            if (!STORAGE["tasks"]) return;
            storage_tasks_update(STORAGE["tasks"], 'youtube_video_like', video_id, 'add');
            // });
          }
        }

      }, 600);
    }
  });

  if (hostname == "mee6.xyz") {
    var message = false;
    $(document).on('keydown', '', function (event) {
      if (event.code == 'End') {
        let USERS = [];
        $(".md\\:block").each(function (index, el) {
          const user = {};
          user["name"] = $(this).find('.justify-start p').text();
          user["level"] = $(this).find('.leaderboardPlayerStat .items-center').text();
          USERS.push(user);

          if (user["level"] == 0) {
            const obj = {};
            obj['discord'] = USERS;
            GM_setValue('FAW_STORAGE', obj);
            // chrome.storage.local.set(obj);

            if (message == false) {
              alert("Можно переходить на freeanywhere.net");
              message = true;
            }
            return false;
          }
        });
      }
    });
  }

  if (hostname == 'gamesforfarm.com') {
    const STORAGE = GM_getValue('FAW_STORAGE') || {};
    // chrome.storage.local.get(function (STORAGE) {
    if (!STORAGE['settings']) return;
    if (!STORAGE['games']) return;

    if (STORAGE['settings']['hide_games'] && STORAGE['settings']['hide_games'] == true) {
      $(".product__item").each(function (index, el) {
        const image = $(this).find('.product__box-image img').data('src');
        const cart = $(this).find('.product__box-props a').attr('href');
        if (image && image.indexOf("/apps/") != -1) {
          const id = parseInt(image.split('/apps/')[1].split('/')[0]);
          if (id && isNaN(id) == false) {
            if (STORAGE['games'][id]) {
              $(this).css('opacity', '.2');
            }
          }
        } else if (cart && cart.indexOf("/app/") != -1) {
          const id = parseInt(cart.split('/app/')[1].split('/')[0]);
          if (id && isNaN(id) == false) {
            if (STORAGE['games'][id]) {
              $(this).css('opacity', '.2');
            }
          }
        }
      });
    }
    // });
  }

  // $(document).on('keydown', '', function(event) {
  //     if(event.code == 'NumpadSubtract') {
  //         chrome.storage.local.clear();
  //         console.log('local storage clear');
  //     }
  //     if(event.code == 'NumpadMultiply') {
  //         chrome.storage.local.get(function(STORAGE){
  //             console.log(STORAGE);
  //         });
  //     }
  // });
}
