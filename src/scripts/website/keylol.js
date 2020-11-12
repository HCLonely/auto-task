// import { getI18n } from '../i18n'
import { fuc, throwError } from '../function/main'
import { globalConf } from '../config'

const keylol = {
  test () {
    try {
      return window.location.host === 'keylol.com' && !window.location.href.includes('mod=forumdisplay') && $('.subforum_left_title_left_up a').eq(3).attr('href')?.includes('319')
    } catch (e) {
      throwError(e, 'keylol.test')
    }
  },
  after () {
    try {
      AutoTask.toggleDiscord = (action, inviteId) => {
        const taskInfo = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']') || {}
        const toGuild = taskInfo.toGuild || {}
        return fuc.toggleActions({ social: 'discord', website: 'keylol', elements: [inviteId], action, toGuild })
          .then(data => {
            if (action === 'fuck') {
              const [inviteId, guild] = data?.[0]?.guild || []
              if (inviteId && guild) {
                toGuild[inviteId] = guild
                taskInfo.toGuild = toGuild
                GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', taskInfo)
              }
            }
          })
      }
      AutoTask.toggleREDDIT = (action, name) => {
        return fuc.toggleActions({ social: 'reddit', website: 'keylol', elements: [name], action })
      }
      AutoTask.toggleINS = (action, name) => {
        return fuc.toggleActions({ social: 'ins', website: 'keylol', elements: [name], action })
      }
      AutoTask.toggleTWITTER = async (action, name, type) => {
        await fuc.updateInfo({}, { twitter: true })
        return fuc.toggleActions({ social: 'twitter', website: 'keylol', elements: [name], type, action })
      }
      AutoTask.toggleTWITCH = (action, name) => {
        return fuc.toggleActions({ social: 'twitch', website: 'keylol', elements: [name], action })
      }
      AutoTask.toggleVK = (action, name) => {
        return fuc.toggleActions({ social: 'vk', website: 'keylol', elements: [name], action })
      }
      AutoTask.toggleSTEAM = async (action, name, type, ...args) => {
        const isAnnouncement = type === 'announcement'
        const isGroup = type === 'group'
        await fuc.updateInfo({}, { steamStore: !isGroup || isAnnouncement, steamCommunity: isGroup })
        let elements = [name]
        if (args) {
          if (args.length === 3) {
            elements = [[args[0], name, args[1], args[2]]]
          } else if (args.length === 1) {
            elements = { 1: name, input: args[0] }
          }
        }
        return fuc.toggleActions({ social: 'steam', website: 'keylol', elements, action, type })
      }
      AutoTask.toggleAutoTaskSelect = (event, ele) => {
        if (event.button === 2) {
          const isSelected = ele.getAttribute('selected')
          isSelected ? ele.removeAttribute('selected') : ele.setAttribute('selected', 'selected')
        }
      }

      const mainPost = $('#postlist>div[id^="post_"]:first')
      const discordLinks = mainPost.find('a[href*="discord.com"]')
      const redditLinks = mainPost.find('a[href*="reddit.com"]')
      const insLinks = mainPost.find('a[href*="instagram.com"]')
      const twitterLinks = mainPost.find('a[href*="twitter.com"]')
      const twitchLinks = mainPost.find('a[href*="twitch.tv"]')
      const vkLinks = mainPost.find('a[href*="vk.com"]')
      const steamStoreLinks = mainPost.find('a[href*="store.steampowered.com"]')
      const steamCommunityLinks = mainPost.find('a[href*="steamcommunity.com"]')
      if (discordLinks.length > 0) {
        for (const discordLink of discordLinks) {
          const link = $(discordLink).attr('href')
          const inviteId = link?.match(/invite\/(.+)/)?.[1]
          if (inviteId) {
            this.addBtn(discordLink, 'toggleDiscord', inviteId, '', ['加入', '退出'])
          }
        }
      }
      if (redditLinks.length > 0) {
        for (const redditLink of redditLinks) {
          const link = $(redditLink).attr('href')
          const name = link?.match(/https?:\/\/www\.reddit\.com\/r\/([^/]*)/)?.[1]
          if (name) {
            this.addBtn(redditLink, 'toggleREDDIT', name, '', ['加入', '退出'])
          }
        }
      }
      if (insLinks.length > 0) {
        for (const insLink of insLinks) {
          const link = $(insLink).attr('href')
          const name = link?.match(/https:\/\/www\.instagram\.com\/(.+)?\//)?.[1]
          if (name) {
            this.addBtn(insLink, 'toggleINS', name, '', ['关注', '取关'])
          }
        }
      }
      if (twitterLinks.length > 0) {
        for (const twitterLink of twitterLinks) {
          const link = $(twitterLink).attr('href')
          const userId = link?.match(/https:\/\/twitter\.com\/(.+)/)?.[1]
          const tweetId = link?.match(/https:\/\/twitter\.com\/.*?\/status\/([\d]+)/)?.[1]
          if (tweetId) {
            this.addBtn(twitterLink, 'toggleTWITTER', tweetId, 'retweet', ['转推', '撤销转推'])
          } else {
            this.addBtn(twitterLink, 'toggleTWITTER', userId, 'follow', ['关注', '取关'])
          }
        }
      }
      if (twitchLinks.length > 0) {
        for (const twitchLink of twitchLinks) {
          const link = $(twitchLink).attr('href')
          const name = link?.match(/https:\/\/www\.twitch\.tv\/(.+)/)?.[1]
          if (name) {
            this.addBtn(twitchLink, 'toggleTWITCH', name, '', ['关注', '取关'])
          }
        }
      }
      if (vkLinks.length > 0) {
        for (const vkLink of vkLinks) {
          const link = $(vkLink).attr('href')
          const name = link?.match(/https:\/\/vk\.com\/([^/]+)/)?.[1]
          if (name) {
            this.addBtn(vkLink, 'toggleVK', name, '', ['加入', '退出'])
          }
        }
      }
      if (steamStoreLinks.length > 0) {
        for (const steamStoreLink of steamStoreLinks) {
          const link = $(steamStoreLink).attr('href')
          const gameId = link?.match(/app\/([\d]+)/)?.[1]
          const curatorId = link?.match(/curator\/([\d]+)/)?.[1]
          const publisherName = link?.match(/publisher\/(.+)\/?/)?.[1] || link?.match(/pub\/(.+)\/?/)?.[1]
          const developerName = link?.match(/developer\/(.+)\/?/)?.[1] || link?.match(/dev\/(.+)\/?/)?.[1]
          const franchiseName = link?.match(/franchise\/(.+)\/?/)?.[1]
          const [, url, announcementId, wgauthtoken, clanid] = link?.match(/(https?:\/\/store\.steampowered\.com\/newshub\/app\/[\d]+\/view\/([\d]+))\?authwgtoken=(.+?)&clanid=(.+)/) || []
          if (gameId) {
            this.addBtn(steamStoreLink, 'toggleSTEAM', gameId, 'game', ['关注', '取关'])
            this.addBtn(steamStoreLink, 'toggleSTEAM', gameId, 'wishlist', ['加入愿望单', '移出愿望单'])
          } else if (curatorId) {
            this.addBtn(steamStoreLink, 'toggleSTEAM', curatorId, 'curator', ['关注', '取关'])
          } else if (publisherName) {
            this.addBtn(steamStoreLink, 'toggleSTEAM', publisherName, 'publisher', ['关注', '取关'])
          } else if (developerName) {
            this.addBtn(steamStoreLink, 'toggleSTEAM', developerName, 'developer', ['关注', '取关'])
          } else if (franchiseName) {
            this.addBtn(steamStoreLink, 'toggleSTEAM', franchiseName, 'franchise', ['关注', '取关'])
          } else if (announcementId) {
            this.addBtn(steamStoreLink, 'toggleSTEAM', announcementId, 'announcement', ['点赞'], url, wgauthtoken, clanid)
          }
        }
      }
      if (steamCommunityLinks.length > 0) {
        for (const steamCommunityLink of steamCommunityLinks) {
          const link = $(steamCommunityLink).attr('href')
          const groupId = link?.match(/groups\/(.+)\/?/)?.[1]
          const announcement = link?.match(/announcements\/detail\/([\d]+)/)
          if (groupId) {
            this.addBtn(steamCommunityLink, 'toggleSTEAM', groupId, 'group', ['加入', '退出'])
          } else if (announcement) {
            this.addBtn(steamCommunityLink, 'toggleSTEAM', announcement[1], 'announcement', ['点赞'], announcement.input)
          }
        }
      }
      $('.auto-task-keylol').bind('contextmenu', function () {
        return false
      })
    } catch (e) {
      throwError(e, 'keylol.after')
    }
  },
  async fuck () {
    try {
      const selectedBtns = $('.auto-task-keylol[selected="selected"]')
      for (const btn of selectedBtns) {
        const action = $(btn).attr('onclick')
        await eval(action) // eslint-disable-line no-eval
        btn.removeAttribute('selected')
      }
    } catch (e) {
      throwError(e, 'keylol.fuck')
    }
  },
  verify () { },
  remove () { },
  get_giveawayId () {
    try {
      return window.location.href.match(/t([\d]+?)-/)?.[1] || window.location.href.match(/tid=([\d]+)/)?.[1] || window.location.href
    } catch (e) {
      throwError(e, 'keylol.get_giveawayId')
    }
  },
  addBtn (before, func, name, type, text, ...args) {
    try {
      const joinBtn = text[0] ? $(`<a href="javascript:void(0);" class="auto-task-keylol" oncontextmenu="return false" onmousedown="AutoTask.toggleAutoTaskSelect(event, this)" onclick="AutoTask.${func}('fuck','${name}'${type ? `,'${type}'` : ''}${args && args.length === 3 ? `,'${args[0]}','${args[1]}','${args[2]}'` : ''}${args && args.length === 1 ? `,'${args[0]}'` : ''})" target="_self">${text[0]}</a>`) : ''
      const leaveBtn = text[1] ? $(`<a href="javascript:void(0);" class="auto-task-keylol" oncontextmenu="return false" onmousedown="AutoTask.toggleAutoTaskSelect(event, this)" onclick="AutoTask.${func}('remove','${name}','${type}')" target="_self">${text[1]}</a>`) : ''
      $(before).after(leaveBtn).after(joinBtn)
    } catch (e) {
      throwError(e, 'keylol.addBtn')
    }
  },
  async updateSteamInfo (callback) {
    try {
      let result = false
      if (this.taskInfo.groups.length > 0) {
        if (this.taskInfo.curators.length > 0 || this.taskInfo.fGames.length > 0 || this.taskInfo.wishlists.length > 0) {
          result = await fuc.updateSteamInfo('all')
        } else {
          result = await fuc.updateSteamInfo('community')
        }
      } else if (this.taskInfo.curators.length > 0 || this.taskInfo.fGames.length > 0 || this.taskInfo.wishlists.length > 0) {
        result = await fuc.updateSteamInfo('store')
      } else {
        result = true
      }
      if (result) callback()
    } catch (e) {
      throwError(e, 'keylol.updateSteamInfo')
    }
  },
  setting: {
    verify: {
      show: false
    },
    remove: {
      show: false
    }
  },
  conf: globalConf
}

export { keylol }
