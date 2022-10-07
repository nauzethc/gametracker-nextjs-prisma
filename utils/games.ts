import { GameCreate, GameUpdate, GameQueryParams, StatsQueryParams } from '../types/games'

function toNumber (num: undefined | string): number | null {
  return num !== undefined ? Number(num) : null
}

function toDate (date: undefined | string): Date | null {
  return date !== undefined ? new Date(date) : null
}

function toString (value: undefined | string[] | string): string | null {
  return Array.isArray(value) ? value.join(',') : (value ?? null)
}

export function parseGameQuery (data: Record<string, any>): GameQueryParams {
  const {
    q,
    igdbId,
    order_by,
    page,
    page_size,
    sort,
    platformId,
    status
  } = data
  return {
    q: toString(q) ?? '',
    igdbId: toNumber(igdbId) ?? undefined,
    page: toNumber(page) ?? 1,
    page_size: toNumber(page_size) ?? 10,
    order_by: toString(order_by) ?? 'startedOn',
    sort: toString(sort) === 'asc' ? 'asc' : 'desc',
    platformId: toNumber(platformId) ?? undefined,
    status: toString(status) ?? undefined
  }
}

export function parseGameCreate (data: Record<string, any>): GameCreate {
  const game: GameCreate = {
    // Metadata
    name: data.name,
    slug: data.slug,
    type: data.type,
    releaseDate: data.releaseDate ?? null,
    summary: data.summary ?? null,
    cover: data.cover ?? null,
    genres: data.genres,
    developers: data.developers,
    publishers: data.publishers,
    igdbRating: data.rating ?? null,
    igdbId: data.igdbId,
    igdbUrl: data.url,
    fixed: null,
    favorite: null,

    // Gameplay
    gameplayType: data.gameplayType,
    status: data.status,
    startedOn: toDate(data.startedOn) || new Date(),
    finishedOn: toDate(data.finishedOn),
    totalHours: toNumber(data.totalHours),
    progress: toNumber(data.progress) || 0,
    achievementsTotal: toNumber(data.achievementsTotal) || 0,
    achievementsUnlocked: toNumber(data.achievementsUnlocked) || 0,
    comment: data.comment || null,
    rating: toNumber(data.rating) || null,
    platform: data.platform
  }
  return game
}

export function parseGameUpdate (data: Record<string, any>): GameUpdate {
  const game: GameUpdate = {
    // Metadata
    fixed: null,
    favorite: null,

    // Gameplay
    gameplayType: data.gameplayType,
    status: data.status,
    startedOn: toDate(data.startedOn) || new Date(),
    finishedOn: toDate(data.finishedOn),
    totalHours: toNumber(data.totalHours),
    progress: toNumber(data.progress) || 0,
    achievementsTotal: toNumber(data.achievementsTotal) || 0,
    achievementsUnlocked: toNumber(data.achievementsUnlocked) || 0,
    comment: data.comment || null,
    rating: toNumber(data.rating) || null,
    platform: data.platform
  }
  return game
}

export function parseStatsQuery (data: Record<string, any>): StatsQueryParams {
  const period = ['custom', 'all', 'year', 'semester']
    .includes(toString(data.period) ?? '')
    ? toString(data.period) ?? 'year'
    : 'year'
  return {
    period,
    from: toDate(data.from) ?? undefined,
    to: toDate(data.to) ?? undefined,
    platformId: toNumber(data.platformId) ?? undefined
  }
}

export function sanitizeStatsQuery (query: StatsQueryParams): any {
  // Today
  const today = new Date()
  // Initial query
  const options = {}

  // Set period
  switch (query.period) {
    case 'year':
      Object.assign(options, {
        startedOn: {
          gte: new Date(Date.now() - (86400 * 365 * 1000)),
          lte: today
        }
      })
      break
    case 'semester':
      Object.assign(options, {
        startedOn: {
          gte: new Date(Date.now() - (86400 * 183 * 1000)),
          lte: today
        }
      })
      break
    case 'custom':
      if (query.from && query.to) {
        Object.assign(options, {
          startedOn: {
            gte: new Date(query.from),
            lte: new Date(query.to)
          }
        })
      }
      break
  }
  // Set platform
  if (query.platformId) Object.assign(options, { platformId: query.platformId })
  return options
}
