import { toggleSteamActions } from './steam'
import { toggleDiscordActions } from './discord'
import { toggleInsActions } from './instagram'
import { toggleTwitterActions } from './twitter'
import { toggleTwitchActions } from './twitch'
import { toggleRedditActions } from './reddit'
import { toggleVkActions } from './vk'
import { throwError } from '../tool'

function toggleActions (e) {
  try {
    switch (e.social) {
      case 'discord':
        toggleDiscordActions(e)
        break
      case 'ins':
        toggleInsActions(e)
        break
      case 'twitter':
        toggleTwitterActions(e)
        break
      case 'twitch':
        toggleTwitchActions(e)
        break
      case 'reddit':
        toggleRedditActions(e)
        break
      case 'vk':
        toggleVkActions(e)
        break
      default:
        toggleSteamActions(e)
    }
  } catch (e) {
    throwError(e, 'toggleActions')
  }
}

export { toggleActions }
