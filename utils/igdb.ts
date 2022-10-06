import { DEFAULT_PAGE_SIZE } from '../config'
import { IGDBGame, IGDBQueryParams, IGDBGameResult, IGDBPlatformResult, IGDBPlatform } from '../types/igdb'
import { toNumber, toString } from './url'

const IGDB_IMG_BASE_URL = process.env.IGDB_IMG_BASE_URL ?? ''

function toDateISO (epoch = 0): Date | undefined {
  return epoch > 0
    ? new Date(epoch * 1000)
    : undefined
}

export function getImageURL (hashId: string, size: string = 'screenshot_big'): string {
  return `${IGDB_IMG_BASE_URL}/t_${size}/${hashId}.jpg`
}

function getCategory (category: number): string {
  switch (category) {
    case 0:
      return 'game'
    case 1:
      return 'dlc'
    case 2:
      return 'expansion'
    case 3:
      return 'bundle'
    case 4:
      return 'standalone_expansion'
    case 5:
      return 'mod'
    case 6:
      return 'episode'
    case 7:
      return 'season'
    case 8:
      return 'remake'
    case 9:
      return 'remaster'
    case 10:
      return 'expanded_game'
    case 11:
      return 'port'
    case 12:
      return 'fork'
    default:
      return 'unknown'
  }
}

export function sanitizePlatformRetrieve (igdbData: IGDBPlatformResult): IGDBPlatform {
  return {
    igdbId: igdbData.id,
    name: igdbData.name,
    abbreviation: igdbData.abbreviation,
    logo: igdbData.platform_logo?.image_id &&
      getImageURL(igdbData.platform_logo.image_id, 'logo_med')
  }
}

export function sanitizeGameRetrieve (igdbData: IGDBGameResult): IGDBGame {
  return {
    igdbId: igdbData.id,
    name: igdbData.name,
    slug: igdbData.slug,
    releaseDate: toDateISO(igdbData.first_release_date),
    summary: igdbData.summary,
    cover: igdbData.cover?.image_id &&
      getImageURL(igdbData.cover.image_id, 'cover_big'),
    rating: igdbData.total_rating,
    url: igdbData.url,
    developers: (igdbData.involved_companies ?? [])
      .filter(({ developer }) => developer)
      .map(({ company }) => company.name),
    publishers: (igdbData.involved_companies ?? [])
      .filter(({ publisher }) => publisher)
      .map(({ company }) => company.name),
    type: getCategory(igdbData.category),
    genres: (igdbData.genres ?? [])
      .map(({ name }) => name),
    platforms: (igdbData.platforms ?? []).map(sanitizePlatformRetrieve)
  }
}

export function sanitizeGameQuery (query: IGDBQueryParams): {
  search: string,
  limit: number,
  offset: number,
  sort: string
} {
  const limit = Number(query.page_size ?? DEFAULT_PAGE_SIZE)
  const numPage = Number(query.page)
  const offset = (numPage - 1 > 0) ? (numPage - 1) * limit : 0
  const sort = query.order_by === 'name'
    ? 'name asc'
    : 'first_release_date desc'
  return { search: query.q, limit, offset, sort }
}

export function parseGameQuery (data: Record<string, any>): IGDBQueryParams {
  const {
    q,
    order_by,
    page,
    page_size,
    platformId
  } = data
  return {
    q: toString(q) ?? '',
    page: toNumber(page) ?? 1,
    page_size: toNumber(page_size) ?? DEFAULT_PAGE_SIZE,
    order_by: toString(order_by),
    platformId: toNumber(platformId)
  }
}
