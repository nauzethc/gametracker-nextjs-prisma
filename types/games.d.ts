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
  platformId?: number
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

export type PlatformStats = Pick<Platform, 'igdbId'|'name'> & {
  _count: { _all: number },
  _sum: { totalHours: number | null }
}

export interface AllStats {
  status: StatusStats[],
  games: GameStats[],
  platforms: PlatformStats[]
}

export interface StatsQueryParams {
  period: string,
  from?: Date,
  to?: Date,
  platformId?: number
}
