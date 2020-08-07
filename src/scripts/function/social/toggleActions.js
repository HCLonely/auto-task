import { toggleSteamActions } from './steam'
import { toggleDiscordActions } from './discord'
import { toggleInsActions } from './instagram'

function toggleActions (e) {
  switch (e.social) {
    case 'discord':
      toggleDiscordActions(e)
      break
    case 'ins':
      toggleInsActions(e)
      break
    default:
      toggleSteamActions(e)
  }
}

export { toggleActions }
