import {
  IGDBGame,
  IGDBPlatform,
  IGDBQueryParams,
  IGDBGameResult,
  IGDBPlatformResult,
  IGDBToken
} from '../types/igdb'

import {
  sanitizeGameRetrieve,
  sanitizeGameQuery,
  sanitizePlatformRetrieve
} from '../utils/igdb'

const AUTH_BASE_URL = process.env.TWITCH_AUTH_BASE_URL ?? ''
const CLIENT_ID = process.env.TWITCH_CLIENT_ID ?? ''
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET ?? ''
const IGDB_BASE_URL = process.env.IGDB_BASE_URL ?? ''

const GAME_FIELDS = [
  'name',
  'slug',
  'cover.url',
  'cover.image_id',
  'first_release_date',
  'genres.name',
  'genres.slug',
  'category',
  'involved_companies.developer',
  'involved_companies.publisher',
  'involved_companies.company.name',
  'summary',
  'url',
  'total_rating',
  'platforms.name',
  'platforms.abbreviation',
  'platforms.platform_logo.image_id',
  'screenshots.width',
  'screenshots.height',
  'screenshots.image_id',
  'screenshots.url'
]

const PLATFORM_FIELDS = [
  'name',
  'abbreviation',
  'platform_logo.image_id'
]

let _token: IGDBToken
let _lastUpdate = 0

async function getToken (): Promise<IGDBToken> {
  if (!_token || Date.now() - _lastUpdate > _token.expires_in) {
    const url = new URL(`${AUTH_BASE_URL}/token`)
    url.searchParams.set('client_id', CLIENT_ID)
    url.searchParams.set('client_secret', CLIENT_SECRET)
    url.searchParams.set('grant_type', 'client_credentials')

    const response = await fetch(url, { method: 'POST' })
    _token = await response.json() as IGDBToken
    _lastUpdate = Date.now()
  }
  return _token
}

export async function findGamesByName (query: IGDBQueryParams): Promise<{ count: number, data: IGDBGame[] }> {
  const token = await getToken()
  const { limit, offset, search } = sanitizeGameQuery(query)
  const response = await fetch(`${IGDB_BASE_URL}/games`, {
    method: 'POST',
    headers: {
      'Client-ID': CLIENT_ID,
      Authorization: `Bearer ${token.access_token}`
    },
    body: `
    search "${search}";
    fields ${GAME_FIELDS.join(',')};
    limit ${limit};
    offset ${offset};
    ${query.platformId
      ? `where release_dates.platform = ${query.platformId};`
      : ''
    }
  `
  })
  const games: IGDBGameResult[] = await response.json() as IGDBGameResult[]
  return {
    count: Number(response.headers.get('x-count') || 0),
    data: games.map(sanitizeGameRetrieve)
  }
}

export async function findGameById (id: string): Promise<IGDBGame | undefined> {
  const token = await getToken()
  const response = await fetch(`${IGDB_BASE_URL}/games`, {
    method: 'POST',
    headers: {
      'Client-ID': CLIENT_ID,
      Authorization: `Bearer ${token.access_token}`
    },
    body: `
      where id = ${id};
      fields ${GAME_FIELDS.join(',')};
    `
  })
  const games: IGDBGameResult[] = await response.json() as IGDBGameResult[]
  return games.map(sanitizeGameRetrieve).pop()
}

export async function findPlatforms (): Promise<{ count: number, data: IGDBPlatform[] }> {
  const token = await getToken()
  const response = await fetch(`${IGDB_BASE_URL}/platforms`, {
    method: 'POST',
    headers: {
      'Client-ID': CLIENT_ID,
      Authorization: `Bearer ${token.access_token}`
    },
    body: `
      fields ${PLATFORM_FIELDS.join(',')};
      limit 500;
      sort name asc;
    `
  })
  const platforms: IGDBPlatformResult[] = await response.json() as IGDBPlatformResult[]
  return {
    count: Number(response.headers.get('x-count') || 0),
    data: platforms.map(sanitizePlatformRetrieve)
  }
}
