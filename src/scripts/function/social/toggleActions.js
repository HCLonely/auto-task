import { toggleSteamActions } from './steam'
import { toggleDiscordActions } from './discord'
import { toggleInsActions } from './instagram'
import { toggleTwitterActions } from './twitter'
import { toggleTwitchActions } from './twitch'
import { toggleRedditActions } from './reddit'

function toggleActions (e) {
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
    default:
      toggleSteamActions(e)
  }
}

export { toggleActions }
