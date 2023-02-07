import { Game, Platform } from '@prisma/client'

export type GameWithPlatform = Game & { platform: Platform }
export type GameCreate = Omit<Game, 'id' | 'createdAt' | 'updatedAt' | 'platformId' | 'userId'> & { platform: Platform }
export type GameUpdate = Partial<GameCreate>
export type PlatformWithGameCount = Platform & { _count: { games: number } }

export interface GameQueryParams {
  q: string,
  igdbId?: number,
  page_size?: number
  page?: number
  order_by?: string
  sort?: 'asc' | 'desc'
  platformId?: number,
  genre?: string,
  developer?: string,
  publisher?: string,
  status?: string
}

export interface GameSearch {
  count: number
  data: GameWithPlatform[]
}

export interface StatusStats {
  status: string,
  _count: { _all: number },
  _sum: { totalHours: number | null },
  _avg: { totalHours: number | null }
}

export type GameStats = Pick<Game, 'igdbId'|'name'|'cover'> & {
  _count: { _all: number },
  _sum: { totalHours: number | null },
  _max: { finishedOn: Date | null }
}

export type PlatformStats = Pick<Platform, 'igdbId'|'name'|'abbreviation'> & {
  _count: number,
  _totalHours: number,
  status: string
}

export type GenreStats = {
  genre: string,
  _count: number,
  _totalHours: number | null
}

export interface AllStats {
  status: StatusStats[],
  games: GameStats[],
  genres: GenreStats[],
  platforms: PlatformStats[]
}

export interface StatsQueryParams {
  period: string,
  from?: Date,
  to?: Date,
  platformId?: number
}
