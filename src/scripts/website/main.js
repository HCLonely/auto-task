import { banana } from './banana'
import { freegamelottery } from './freegamelottery'
import { gamehag } from './gamehag'
import { giveawaysu } from './giveawaysu'
import { gleam } from './gleam'
import { indiedb } from './indiedb'
import { keylol } from './keylol'
import { marvelousga } from './marvelousga'
import { opiumpulses } from './opiumpulses'
import { prys } from './prys'

let website = {}

const websites = [banana, freegamelottery, gamehag, giveawaysu, gleam, indiedb, keylol, marvelousga, opiumpulses, prys]
for (const e of websites) {
  if (e.test()) {
    website = e
    break
  }
}

export { website }
