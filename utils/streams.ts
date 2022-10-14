import { Transform } from 'stream'
import { GameWithPlatform } from '../types/games'
import { capitalize } from './strings'

function gameToCSV (game: GameWithPlatform, separator?: string): string {
  const _separator = separator ?? ';'
  return [
    game.name,
    capitalize(game.gameplayType),
    game.platform.name,
    capitalize(game.status),
    game.startedOn.toISOString(),
    game.finishedOn?.toISOString() ?? '',
    game.totalHours,
    game.progress,
    game.achievementsUnlocked,
    game.achievementsTotal,
    game.rating,
    game.comment
  ]
    .join(_separator)
    .concat('\n')
}

export const transformGameCSV = new Transform({
  objectMode: true,
  transform (chunk, _, callback) {
    try {
      callback(null, Buffer.from(gameToCSV(chunk as GameWithPlatform)))
    } catch (error) {
      callback(new Error(`${error}`))
    }
  }
})
