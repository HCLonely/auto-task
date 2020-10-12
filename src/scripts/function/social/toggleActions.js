import { toggleSteamActions } from './steam'
import { toggleDiscordActions } from './discord'
import { toggleInsActions } from './instagram'
import { toggleTwitterActions } from './twitter'
import { toggleTwitchActions } from './twitch'
import { toggleRedditActions } from './reddit'
import { toggleVkActions } from './vk'
import { toggleYtbActions } from './youtube'
import { throwError } from '../tool'

async function toggleActions (e) {
  try {
    switch (e.social) {
      case 'discord':
        return toggleDiscordActions(e)
      case 'ins':
        return toggleInsActions(e)
      case 'twitter':
        return toggleTwitterActions(e)
      case 'twitch':
        return toggleTwitchActions(e)
      case 'reddit':
        return toggleRedditActions(e)
      case 'vk':
        return toggleVkActions(e)
      case 'youtube':
        return toggleYtbActions(e)
      default:
        return toggleSteamActions(e)
    }
  } catch (e) {
    throwError(e, 'toggleActions')
  }
}

export { toggleActions }
