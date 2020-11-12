import { throwError } from './tool'
import { getI18n } from '../i18n'
import { getYtbToken } from './social/youtube'

async function getId () {
  try {
    const [type, link] = await Swal.fire({
      title: getI18n('selectAType'),
      input: 'select',
      inputOptions: {
        Steam: {
          's-group': 'group',
          's-wishlist': 'wishlist',
          's-game': 'game',
          's-curator': 'curator',
          's-otherCurator': 'otherCurator',
          's-forum': 'forum'
        },
        discord: {
          'd-server': 'server'
        },
        instagram: {
          'i-user': 'user'
        },
        reddit: {
          'r-reddit': 'reddit'
        },
        twitch: {
          'tc-channel': 'channel'
        },
        twitter: {
          'tt-user': 'user',
          'tt-tweet': 'tweet'
        },
        vk: {
          'v-vk': 'vk'
        },
        youtube: {
          'y-channel': 'channel',
          'y-video': 'video'
        }
      },
      inputPlaceholder: getI18n('selectAType'),
      showCancelButton: true
    }).then(async ({ value: type }) => {
      const { value: url } = await Swal.fire({
        input: 'url',
        inputLabel: 'Link',
        inputPlaceholder: getI18n('enterTheUrl')
      })

      if (url && type) {
        return [type, url]
      } else {
        return []
      }
    })
    if (type && link) {
      Swal.fire({
        icon: 'warning',
        title: 'Waiting...'
      })
      let result
      switch (type) {
        case 's-group':
          result = link.match(/steamcommunity\.com\/groups\/([^/]+)/)?.[1]
          break
        case 's-game':
        case 's-wishlist':
        case 's-forum':
          result = link.match(/store\.steampowered\.com\/app\/([\d]+)/)?.[1]
          break
        case 's-curator':
          result = link.match(/store\.steampowered\.com\/curator\/([\d]+)/)?.[1]
          break
        case 's-otherCurator':
          result = ((link.includes('publisher') ? link.match(/store\.steampowered\.com\/publisher\/(.+)\/?/) : link.includes('developer') ? link.match(/store\.steampowered\.com\/developer\/(.+)\/?/) : (link.match(/pub\/(.+)\/?/) || link.match(/dev\/(.+)\/?/))) || link.match(/franchise\/(.+)\/?/))?.[1]
          break
        case 'd-server':
          result = link.match(/discord\.com\/invite\/(.+)/)?.[1]
          break
        case 'i-user':
          result = link.match(/www\.instagram\.com\/(.+)?\//)?.[1]
          break
        case 'r-reddit':
          {
            result = link.match(/www\.reddit\.com\/r\/([^/]*)/)?.[1]
            let userName = link.match(/www\.reddit\.com\/user\/([^/]*)/)?.[1]
            if (userName) userName = 'u_' + userName
            result = result || userName
          }
          break
        case 'tc-channel':
          result = link.match(/www\.twitch\.tv\/(.+)/)?.[1]
          break
        case 'tt-user':
          result = link.match(/twitter\.com\/(.+)/)?.[1]
          break
        case 'tt-tweet':
          result = link.match(/twitter\.com\/.*?\/status\/([\d]+)/)?.[1]
          break
        case 'v-vk':
          result = link.match(/vk\.com\/([^/]+)/)?.[1]
          break
        case 'y-channel':
          {
            const { params } = await getYtbToken(link, 'channel')
            result = params?.channelId
          }
          break
        case 'y-video':
          {
            const { params } = await getYtbToken(link, 'likeVideo')
            result = params?.videoId
          }
          break
      }
      if (result) {
        Swal.fire({
          icon: 'success',
          html: `<ul style="text-align:left;"><li>Link: <code>${link}</code></li><li>Id/Name: <code>${result}</code></li></ul>`
        })
      }
    }
  } catch (e) {
    throwError(e, 'getId')
  }
}

export { getId }
