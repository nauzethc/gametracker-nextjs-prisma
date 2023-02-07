// @ts-nocheck
import { PlatformStats } from '../types/games'

type PlatformData = {
  igdbId: number,
  name: string,
  abbreviation: string,
  _totalHours: number,
  _count: number,
  pending?: {
    _totalHours: number,
    _count: number
  },
  finished?: {
    _totalHours: number,
    _count: number
  },
  abandoned: {
    _totalHours: number,
    _count: number
  },
}

export function reducePlatforms (platforms: PlatformStats[]): PlatformData[] {
  return Object.values(platforms.reduce((acc, platform) => {
    if (!acc[platform.igdbId]) {
      acc[platform.igdbId] = {
        igdbId: platform.igdbId,
        name: platform.name,
        abbreviation: platform.abbreviation,
        _totalHours: 0,
        _count: 0
      }
    }
    //
    acc[platform.igdbId]._totalHours += platform._totalHours
    acc[platform.igdbId]._count += platform._count
    acc[platform.igdbId][platform.status] = {
      _count: platform._count,
      _totalHours: platform._totalHours
    }
    return acc
  }, {}))
}
