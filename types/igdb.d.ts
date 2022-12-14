export interface IGDBGameResult {
  id: number,
  name: string
  slug: string
  cover?: {
    url: string,
    image_id: string
  },
  first_release_date?: number,
  genres?: {
    name: string,
    slug: string
  }[],
  category: number,
  involved_companies?: {
    developer: boolean,
    publisher: boolean,
    company: {
      name: string
    }
  }[],
  summary?: string,
  url: string,
  total_rating?: number,
  platforms?: {
    id: number,
    name: string,
    abbreviation?: string,
    platform_logo?: {
      image_id: string
    }
  }[],
  screenshots?: {
    width: number,
    height: number,
    image_id: string,
    url: string
  }[]
}

export interface IGDBPlatformResult {
  id: number,
  name: string,
  abbreviation?: string,
  platform_logo?: {
    image_id
  }
}

export interface IGDBPlatform {
  igdbId: number
  name: string
  abbreviation?: string
  logo?: string
}

export interface IGDBGame {
  igdbId: number
  name: string
  slug: string
  releaseDate?: Date
  summary?: string
  cover?: string
  rating?: number
  url: string
  developers: string[]
  publishers: string[]
  type: string
  genres: string[]
  platforms: IGDBPlatform[],
  screenshots: string[]
}

export type IGDBGameSelected = Omit<IGDBGame, 'platforms'> & { platform: IGDBPlatform }

export interface IGDBQueryParams {
  q: string,
  page_size?: number,
  page?: number,
  order_by?: string,
  platformId?: number
}

export interface IGDBSearch {
  count: number,
  data: IGDBGame[]
}

export interface IGDBToken {
  access_token: string,
  expires_in: number,
  token_type: string
}
