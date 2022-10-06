import prisma from '../lib/prisma'
import { Platform, Game } from '@prisma/client'
import {
  GameCreate,
  GameQueryParams,
  GameUpdate,
  GameWithPlatform,
  GameSearch,
  AllStats
} from '../types/games'

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
  const SORT = params.sort ?? 'desc'

  const options = {
    skip: Math.max(PAGE - 1, 0) * PAGE_SIZE,
    take: PAGE_SIZE,
    orderBy: [{ [ORDER_BY]: SORT }],
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
  if (params.igdbId) {
    Object.assign(where, { igdbId: { equals: params.igdbId } })
  }

  return {
    count: await prisma.game.count({ where }),
    data: await prisma.game.findMany({ ...options, where })
  }
}

function getPeriodQuery (period?: string) {
  const today = new Date()
  switch (period) {
    case 'year':
      return {
        gte: new Date(Date.now() - (86400 * 365 * 1000)),
        lte: today
      }
    case 'semester':
      return {
        gte: new Date(Date.now() - (86400 * 183 * 1000)),
        lte: today
      }
    case 'all':
    default:
      return {
        lte: today
      }
  }
}

export async function getStats (userId: string, period?: string): Promise<AllStats> {
  // Filter results by period
  const startedOn = getPeriodQuery(period)

  // Get total hours and games count by status
  const status = await prisma.game.groupBy({
    by: ['status'],
    where: { userId, startedOn },
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

  // Get most played games
  const games = await prisma.game.groupBy({
    by: ['igdbId', 'id', 'name', 'cover'],
    where: { userId, startedOn },
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

  // Get games count and total hours grouped by platform
  const platformStats = await prisma.game.groupBy({
    by: ['platformId'],
    where: { userId, startedOn },
    _count: {
      _all: true
    },
    _sum: {
      totalHours: true
    },
    orderBy: {
      platformId: 'desc'
    }
  })
  const platformData = await prisma.platform.findMany({
    where: {
      games: {
        some: {
          userId: {
            equals: userId
          },
          startedOn
        }
      }
    },
    orderBy: {
      igdbId: 'desc'
    }
  })

  return {
    games,
    status,
    platforms: platformData.map((platform, index) => ({
      ...platform,
      ...platformStats[index]
    }))
  }
}
