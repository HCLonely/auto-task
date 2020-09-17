import { getI18n } from '../i18n'
import { throwError } from './tool'

function getDiscordAuth () {
  try {
    if (typeof discordAuth === 'string') {
      GM_setValue('discordInfo', {
        authorization: discordAuth.replace(/"/g, ''),
        expired: false,
        updateTime: new Date().getTime()
      })
      $('body').overhang({
        type: 'success',
        activity: 'notification',
        message: getI18n('getAuthSuccess')
      })
    } else {
      $('body').overhang({
        type: 'error',
        activity: 'notification',
        message: getI18n('getAuthError')
      })
    }
  } catch (e) {
    throwError(e, 'getDiscordAuth')
  }
}

export { getDiscordAuth }
