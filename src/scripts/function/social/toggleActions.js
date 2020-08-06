import { toggleSteamActions } from './steam'
import { toggleDiscordActions } from './discord'

function toggleActions (e) {
  switch (e.social) {
    case 'discord':
      toggleDiscordActions(e)
      break
    default:
      toggleSteamActions(e)
  }
}

export { toggleActions }
