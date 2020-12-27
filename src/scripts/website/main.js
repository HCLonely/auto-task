import { banana } from './banana'
import { freeanywhere } from './freeanywhere'
import { freegamelottery } from './freegamelottery'
import { gamehag } from './gamehag'
import { giveawaysu } from './giveawaysu'
import { givekey } from './givekey'
import { gleam } from './gleam'
import { indiedb } from './indiedb'
import { keyhub } from './keyhub'
import { keylol } from './keylol'
import { marvelousga } from './marvelousga'
import { opiumpulses } from './opiumpulses'
import { prys } from './prys'
import { takekey } from './takekey'

let website = null

const websites = [banana, freeanywhere, freegamelottery, gamehag, giveawaysu, givekey, gleam, indiedb, keyhub, keylol, marvelousga, opiumpulses, prys, takekey]
for (const e of websites) {
  if (e.test()) {
    website = e
    break
  }
}

export { website }
