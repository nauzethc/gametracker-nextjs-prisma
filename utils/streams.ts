import { Transform } from 'stream'
import { GameWithPlatform } from '../types/games'
import { capitalize } from './strings'

export function gameToCSV (game: GameWithPlatform, separator?: string): string {
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

export function gameToJSON (game: GameWithPlatform): string {
  return JSON.stringify({
    name: game.name,
    gameplayType: capitalize(game.gameplayType),
    platform: game.platform.name,
    status: capitalize(game.status),
    startedOn: game.startedOn.toISOString(),
    finishedOn: game.finishedOn?.toISOString() ?? '',
    totalHours: game.totalHours,
    progress: game.progress,
    achievementsUnlocked: game.achievementsUnlocked,
    achievementsTotal: game.achievementsTotal,
    rating: game.rating,
    comment: game.comment
  })
}

export const transformGameJSON = new Transform({
  objectMode: true,
  transform (chunk, _, callback) {
    try {
      callback(null, Buffer.from(gameToJSON(chunk as GameWithPlatform)))
    } catch (error) {
      callback(new Error(`${error}`))
    }
  }
})

export const transformGameListJSON = () => {
  let isFirst = true
  return new Transform({
    objectMode: true,
    transform (chunk, _, callback) {
      try {
        if (isFirst) {
          callback(null, Buffer.from(gameToJSON(chunk as GameWithPlatform)))
          isFirst = false
        } else {
          callback(null, Buffer.from(',' + gameToJSON(chunk as GameWithPlatform)))
        }
      } catch (error) {
        callback(new Error(`${error}`))
      }
    }
  })
}
