import { banana } from './banana'
import { freegamelottery } from './freegamelottery'
import { giveawaysu } from './giveawaysu'
import { gleam } from './gleam'
import { indiedb } from './indiedb'
import { marvelousga } from './marvelousga'
import { opiumpulses } from './opiumpulses'
import { prys } from './prys'
import { takekey } from './takekey'

let website = null

const websites = [banana, freegamelottery, giveawaysu, gleam, indiedb, marvelousga, opiumpulses, prys, takekey]
for (const e of websites) {
  if (e.test()) {
    website = e
    break
  }
}

export { website }
