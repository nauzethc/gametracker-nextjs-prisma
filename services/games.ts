import prisma from '../lib/prisma'
import { Platform, Game, Prisma } from '@prisma/client'
import {
  GameCreate,
  GameQueryParams,
  GameUpdate,
  GameWithPlatform,
  GameSearch,
  AllStats,
  StatsQueryParams
} from '../types/games'
import { sanitizeStatsQuery } from '../utils/games'
import { Readable } from 'stream'

async function createOrUpdatePlatform (data: Platform): Promise<Platform> {
  return prisma.platform.upsert({
    where: { igdbId: data.igdbId },
    update: data,
    create: data
  })
}

export async function findPlatforms (): Promise<Platform[]> {
  return prisma.platform.findMany({
    orderBy: [{ name: 'asc' }]
  })
}

export async function createGame (userId: string, data: GameCreate): Promise<Game> {
  const { platform: platformData, ...gameData } = data
  await createOrUpdatePlatform(platformData)
  return prisma.game.create({
    data: { ...gameData, platformId: platformData.igdbId, userId },
    include: { platform: true }
  })
}

export async function updateGame (id: string, data: GameUpdate): Promise<Game> {
  const { platform: platformData, ...gameData } = data
  if (platformData) await createOrUpdatePlatform(platformData)
  return prisma.game.update({
    where: { id },
    data: gameData,
    include: { platform: true }
  })
}

export async function deleteGame (id: string): Promise<GameWithPlatform> {
  return prisma.game.delete({
    where: { id },
    include: { platform: true }
  })
}

export async function retrieveGame (id: string): Promise<GameWithPlatform> {
  return prisma.game.findFirstOrThrow({
    where: { id },
    include: { platform: true }
  })
}

export async function findGames (userId: string, params: GameQueryParams): Promise<GameSearch> {
  const PAGE_SIZE = params.page_size ?? 10
  const PAGE = params.page ?? 1
  const ORDER_BY = params.order_by ?? 'startedOn'
  const SORT = params.sort ?? Prisma.SortOrder.desc

  const options = {
    skip: Math.max(PAGE - 1, 0) * PAGE_SIZE,
    take: PAGE_SIZE,
    orderBy: [{ fixed: Prisma.SortOrder.desc }, { [ORDER_BY]: SORT }],
    include: { platform: true }
  }
  const where = { userId }

  if (params.q) {
    Object.assign(where, { name: { contains: params.q, mode: 'insensitive' } })
  }
  if (params.platformId) {
    Object.assign(where, { platformId: { equals: params.platformId } })
  }
  if (params.status) {
    Object.assign(where, { status: { equals: params.status } })
  }
  if (params.genre) {
    Object.assign(where, { genres: { has: params.genre } })
  }
  if (params.developer) {
    Object.assign(where, { developers: { has: params.developer } })
  }
  if (params.publisher) {
    Object.assign(where, { publishers: { has: params.publisher } })
  }
  if (params.igdbId) {
    Object.assign(where, { igdbId: { equals: params.igdbId } })
  }

  return {
    count: await prisma.game.count({ where }),
    data: await prisma.game.findMany({ ...options, where })
  }
}

export function streamGames (userId: string, batchSize: number): Readable {
  const _batchSize = Math.max(batchSize, 50)
  let cursorId: string

  return new Readable({
    objectMode: true,
    highWaterMark: _batchSize,
    async read () {
      try {
        const games = await prisma.game.findMany({
          where: { userId },
          orderBy: { startedOn: 'asc' },
          include: { platform: true },
          take: _batchSize,
          skip: cursorId ? 1 : 0,
          cursor: cursorId ? { id: cursorId } : undefined
        })
        for (const game of games) {
          this.push(game)
        }
        if (games.length < _batchSize) {
          this.push(null)
          return
        }
        cursorId = games[games.length - 1].id
      } catch (err) {
        this.destroy(err as Error)
      }
    }
  })
}

export async function findGenres (userId: string): Promise<string[]> {
  // Get games grouped by genres
  const genres = await prisma.$queryRaw`
    SELECT DISTINCT "genre"
    FROM "games"
    CROSS JOIN LATERAL UNNEST("games"."genres") AS tags("genre")
    WHERE "userId" = ${userId}
    ORDER BY "genre" ASC
  `
  return JSON.parse(JSON.stringify(genres,
    (_, v) => typeof v === 'bigint' ? Number(v.toString()) : v
  )).map(({ genre }: { genre: string }) => genre)
}

export async function findStats (userId: string, params: StatsQueryParams): Promise<AllStats> {
  // Get query params
  const query = sanitizeStatsQuery(params)

  // Get most played games
  const games = await prisma.game.groupBy({
    by: ['igdbId', 'name', 'cover'],
    where: { userId, ...query },
    _count: {
      _all: true
    },
    _sum: {
      totalHours: true
    },
    _max: {
      finishedOn: true
    },
    orderBy: {
      _sum: {
        totalHours: 'desc'
      }
    },
    take: 6
  })

  // Get total hours and games count by status
  const status = await prisma.game.groupBy({
    by: ['status'],
    where: { userId, ...query },
    _count: {
      _all: true
    },
    _avg: {
      totalHours: true
    },
    _sum: {
      totalHours: true
    }
  })

  // Get games grouped by genres
  const genres = await prisma.$queryRaw`
    SELECT COUNT(*) AS "_count", SUM("total_hours") AS "_totalHours", "genre", "userId"
    FROM "games"
    CROSS JOIN LATERAL UNNEST("games"."genres") AS tags("genre")
    WHERE "userId" = ${userId}
    AND "started_on" >= ${query.startedOn?.gte ?? new Date('1970-01-01')}
    AND "started_on" <= ${query.startedOn?.lte ?? new Date()}
    GROUP BY "genre", "userId"
    ORDER BY 1 DESC
  `

  // Get games count and total hours grouped by platform
  const platforms = await prisma.$queryRaw`
    SELECT
      COUNT(*) AS "_count",
      SUM("total_hours") AS "_totalHours",
      "userId", "status", "abbreviation", "platforms"."name",
      "platforms"."igdb_id" AS "igdbId"
    FROM "games"
    LEFT JOIN "platforms" ON "games"."platformId" = "platforms"."igdb_id"
    WHERE "userId" = ${userId}
    AND "started_on" >= ${query.startedOn?.gte ?? new Date('1970-01-01')}
    AND "started_on" <= ${query.startedOn?.lte ?? new Date()}
    GROUP BY "platforms"."igdb_id", "userId", "status", "abbreviation", "platforms"."name"
    ORDER BY 1 DESC
  `

  return {
    games,
    status,
    genres: JSON.parse(JSON.stringify(genres,
      (_, v) => typeof v === 'bigint' ? Number(v.toString()) : v
    )),
    platforms: JSON.parse(JSON.stringify(platforms,
      (_, v) => typeof v === 'bigint' ? Number(v.toString()) : v
    ))
  }
}
