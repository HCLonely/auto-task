// import { getI18n } from '../i18n'
import { fuc } from '../function/main'
import { globalConf } from '../config'

const keylol = {
  test () { return window.location.host.includes('keylol.com') && !window.location.href.includes('mod=forumdisplay') && $('.subforum_left_title_left_up a').eq(3).attr('href')?.includes('319') },
  after () {
    unsafeWindow.toggleDiscord = (action, inviteId) => {
      const taskInfo = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']') || {}
      const toGuild = taskInfo.toGuild || {}
      return new Promise(resolve => {
        fuc.toggleActions({ social: 'discord', website: 'keylol', elements: [inviteId], resolve, action, toGuild })
      }).then(data => {
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
    unsafeWindow.toggleReddit = (action, name) => {
      return new Promise(resolve => {
        fuc.toggleActions({ social: 'reddit', website: 'keylol', elements: [name], resolve, action })
      })
    }
    unsafeWindow.toggleIns = (action, name) => {
      return new Promise(resolve => {
        fuc.toggleActions({ social: 'ins', website: 'keylol', elements: [name], resolve, action })
      })
    }
    unsafeWindow.toggleTwitter = async (action, name, type) => {
      await fuc.updateInfo({}, { twitter: true })
      return new Promise(resolve => {
        fuc.toggleActions({ social: 'twitter', website: 'keylol', elements: [name], resolve, type, action })
      })
    }
    unsafeWindow.toggleTwitch = (action, name) => {
      return new Promise(resolve => {
        fuc.toggleActions({ social: 'twitch', website: 'keylol', elements: [name], resolve, action })
      })
    }
    unsafeWindow.toggleVk = (action, name) => {
      return new Promise(resolve => {
        fuc.toggleActions({ social: 'vk', website: 'keylol', elements: [name], resolve, action })
      })
    }
    unsafeWindow.toggleSteam = async (action, name, type, ...args) => {
      const isAnnouncement = type === 'announcement'
      const isGroup = type === 'group'
      await fuc.updateInfo({}, { steamStore: isGroup || isAnnouncement, steamCommunity: !isGroup })
      return new Promise(resolve => {
        let elements = [name]
        if (args) {
          if (args.length === 3) {
            elements = [[args[0], name, args[1], args[2]]]
          } else if (args.length === 1) {
            elements = { 1: name, input: args[0] }
          }
        }
        fuc.toggleActions({ social: 'steam', website: 'keylol', elements, resolve, action, type })
      })
    }
    unsafeWindow.toggleAutoTaskSelect = (event, ele) => {
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
        const name = link?.match(/https?:\/\/www.reddit.com\/r\/([^/]*)/)?.[1]
        if (name) {
          this.addBtn(redditLink, 'toggleReddit', name, '', ['加入', '退出'])
        }
      }
    }
    if (insLinks.length > 0) {
      for (const insLink of insLinks) {
        const link = $(insLink).attr('href')
        const name = link?.match(/https:\/\/www.instagram.com\/(.+)?\//)?.[1]
        if (name) {
          this.addBtn(insLink, 'toggleIns', name, '', ['关注', '取关'])
        }
      }
    }
    if (twitterLinks.length > 0) {
      for (const twitterLink of twitterLinks) {
        const link = $(twitterLink).attr('href')
        const userId = link?.match(/https:\/\/twitter.com\/(.+)/)?.[1]
        const tweetId = link?.match(/https:\/\/twitter.com\/.*?\/status\/([\d]+)/)?.[1]
        if (tweetId) {
          this.addBtn(twitterLink, 'toggleTwitter', tweetId, 'retweet', ['转推', '撤销转推'])
        } else {
          this.addBtn(twitterLink, 'toggleTwitter', userId, 'follow', ['关注', '取关'])
        }
      }
    }
    if (twitchLinks.length > 0) {
      for (const twitchLink of twitchLinks) {
        const link = $(twitchLink).attr('href')
        const name = link?.match(/https:\/\/www.twitch.tv\/(.+)/)?.[1]
        if (name) {
          this.addBtn(twitchLink, 'toggleTwitch', name, '', ['关注', '取关'])
        }
      }
    }
    if (vkLinks.length > 0) {
      for (const vkLink of vkLinks) {
        const link = $(vkLink).attr('href')
        const name = link?.match(/https:\/\/vk.com\/([^/]+)/)?.[1]
        if (name) {
          this.addBtn(vkLink, 'toggleVk', name, '', ['加入', '退出'])
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
          this.addBtn(steamStoreLink, 'toggleSteam', gameId, 'game', ['关注', '取关'])
          this.addBtn(steamStoreLink, 'toggleSteam', gameId, 'wishlist', ['加入愿望单', '移出愿望单'])
        } else if (curatorId) {
          this.addBtn(steamStoreLink, 'toggleSteam', curatorId, 'curator', ['关注', '取关'])
        } else if (publisherName) {
          this.addBtn(steamStoreLink, 'toggleSteam', publisherName, 'publisher', ['关注', '取关'])
        } else if (developerName) {
          this.addBtn(steamStoreLink, 'toggleSteam', developerName, 'developer', ['关注', '取关'])
        } else if (franchiseName) {
          this.addBtn(steamStoreLink, 'toggleSteam', franchiseName, 'franchise', ['关注', '取关'])
        } else if (announcementId) {
          this.addBtn(steamStoreLink, 'toggleSteam', announcementId, 'announcement', ['点赞'], url, wgauthtoken, clanid)
        }
      }
    }
    if (steamCommunityLinks.length > 0) {
      for (const steamCommunityLink of steamCommunityLinks) {
        const link = $(steamCommunityLink).attr('href')
        const groupId = link?.match(/groups\/(.+)\/?/)?.[1]
        const announcement = link?.match(/announcements\/detail\/([\d]+)/)
        if (groupId) {
          this.addBtn(steamCommunityLink, 'toggleSteam', groupId, 'group', ['加入', '退出'])
        } else if (announcement) {
          this.addBtn(steamCommunityLink, 'toggleSteam', announcement[1], 'announcement', ['点赞'], announcement.input)
        }
      }
    }
    $('.auto-task-keylol').bind('contextmenu', function () {
      return false
    })
  },
  async fuck () {
    const selectedBtns = $('.auto-task-keylol[selected="selected"]')
    for (const btn of selectedBtns) {
      const action = $(btn).attr('onclick')
      await eval(action) // eslint-disable-line no-eval
      btn.removeAttribute('selected')
    }
  },
  verify () { },
  remove () { },
  get_giveawayId () {
    return window.location.href.match(/t([\d]+?)-/)?.[1] || window.location.href.match(/tid=([\d]+)/)?.[1] || window.location.href
  },
  addBtn (before, func, name, type, text, ...args) {
    const joinBtn = text[0] ? $(`<a href="javascript:void(0);" class="auto-task-keylol" oncontextmenu="return false" onmousedown="toggleAutoTaskSelect(event, this)" onclick="${func}('fuck','${name}'${type ? `,'${type}'` : ''}${args && args.length === 3 ? `,'${args[0]}','${args[1]}','${args[2]}'` : ''}${args && args.length === 1 ? `,'${args[0]}'` : ''})" target="_self">${text[0]}</a>`) : ''
    const leaveBtn = text[1] ? $(`<a href="javascript:void(0);" class="auto-task-keylol" oncontextmenu="return false" onmousedown="toggleAutoTaskSelect(event, this)" onclick="${func}('remove','${name}','${type}')" target="_self">${text[1]}</a>`) : ''
    $(before).after(leaveBtn).after(joinBtn)
  },
  updateSteamInfo (callback) {
    new Promise(resolve => {
      if (this.taskInfo.groups.length > 0) {
        if (this.taskInfo.curators.length > 0 || this.taskInfo.fGames.length > 0 || this.taskInfo.wishlists.length > 0) {
          fuc.updateSteamInfo(resolve, 'all')
        } else {
          fuc.updateSteamInfo(resolve, 'community')
        }
      } else if (this.taskInfo.curators.length > 0 || this.taskInfo.fGames.length > 0 || this.taskInfo.wishlists.length > 0) {
        fuc.updateSteamInfo(resolve, 'store')
      } else {
        resolve(1)
      }
    }).then(s => {
      if (s === 1) callback()
    }).catch(err => {
      console.error(err)
    })
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
