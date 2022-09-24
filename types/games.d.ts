import { Game, Platform } from '@prisma/client'

export type GameWithPlatform = Game & { platform: Platform }
export type GameCreate = Omit<Game, 'id' | 'createdAt' | 'updatedAt' | 'platformId' | 'userId'> & { platform: Platform }
export type GameUpdate = Partial<GameCreate>

export interface GameQueryParams {
  q: string,
  page_size?: number,
  page?: number,
  order_by?: string,
  sort?: 'asc' | 'desc',
  platformId?: number,
  status?: string
}

export interface GameSearch {
  count: number,
  data: GameWithPlatform[]
}
