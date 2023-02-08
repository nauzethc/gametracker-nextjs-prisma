import React, { useEffect, useState } from 'react'
import { GetServerSidePropsContext } from 'next'
import { findPlatforms, findStats } from '../services/games'
import { AllStats } from '../types/games'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'
import Error from '../components/common/error'
import { capitalize } from '../utils/strings'
import GameItem from '../components/stats/game-item'
import { HeaderPortal } from '../components/app/header'
import UserButton from '../components/common/user-button'
import { PlusCircleIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useDidMount } from '../hooks/lifecycle'
import { useEndpoint } from '../hooks/http'
import { useRouter } from 'next/router'
import SearchForm from '../components/stats/search-form'
import { parseStatsQuery } from '../utils/games'
import { Platform } from '@prisma/client'
import GenresChart from '../components/stats/genres-chart'
import StatusChart from '../components/stats/status-chart'
import PlatformsChart from '../components/stats/platforms-chart'
import { reducePlatforms } from '../utils/stats'

function toFixed (hours: number | null): string {
  return hours ? `${Math.floor(hours)}h` : '-'
}

function getStatusColor (status: string): string {
  switch (status) {
    case 'finished':
      return 'bg-green-400 dark:bg-green-800'
    case 'abandoned':
      return 'bg-red-400 dark:bg-red-800'
    default:
      return 'bg-gray-400 dark:bg-gray-800'
  }
}

export default function StatsView ({
  query: initialQuery,
  platforms,
  data,
  error
}: {
  query?: Record<string, any>,
  platforms: Platform[],
  data: AllStats,
  error: any
}) {
  const didMount = useDidMount()
  const [query, setQuery] = useState<Record<string, any>>({ period: 'all', ...initialQuery })
  const stats = useEndpoint<AllStats>('/api/stats', { data, error })
  const router = useRouter()

  const handleSubmit = (newQuery: Record<string, any>) => setQuery(newQuery)

  // Update stats on query change
  useEffect(() => {
    if (didMount) {
      router.push({ pathname: '/stats', query }, undefined, { shallow: true })
      stats.retrieve(query)
    }
  }, [query])

  return (
    <div id="stats-view">
      <div className="grid gap-8 pb-8">
        <HeaderPortal>
          <UserButton />
          <Link href="/track" legacyBehavior>
            <a className="btn btn-primary px-4 h-10 text-sm">
              <PlusCircleIcon className="h-6 w-6" />
              <span>Track</span>
            </a>
          </Link>
        </HeaderPortal>
        <SearchForm
          initialData={query}
          platforms={platforms}
          pending={stats.state.pending}
          onSubmit={handleSubmit} />
        <Error error={error} />

        <h3 className="text-lg font-semibold border-b-2 -mb-4">Most played</h3>
        <div className={`w-full grid gap-3 sm:grid-rows-3 sm:grid-flow-col ${(stats.state.data?.games.length ?? 3) > 3 ? 'sm:grid-cols-2' : ''}`}>
          {stats.state.data?.games.map((game, index) =>
            <GameItem ranking={index + 1} key={game.igdbId} data={game} />
          )}
        </div>

        <h3 className="text-lg font-semibold border-b-2 -mb-4">Genres</h3>
        <div className="grid items-center lg:grid-cols-2 gap-8">
          <div className="h-64 mx-auto md:h-96" style={{ width: '99%' }}>
            <GenresChart genres={stats.state.data?.genres} />
          </div>
          <table>
            <thead>
              <tr>
                <th className="text-left">Genre</th>
                <th className="w-32">
                  <div className="flex items-center justify-center gap-2">
                    <span className="inline-block rounded-full w-4 h-4 bg-amber-500 dark:bg-amber-600" />
                    Time
                  </div>
                </th>
                <th className="w-32">
                  <div className="flex items-center justify-center gap-2">
                    <span className="inline-block rounded-full w-4 h-4 bg-blue-500" />
                    Games
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.state.data?.genres.map(genre =>
              <tr key={genre.genre}>
                <td>{genre.genre}</td>
                <td>{genre._totalHours}h</td>
                <td>{genre._count}</td>
              </tr>
              )}
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-semibold border-b-2 -mb-4">Status</h3>
        <div className="grid items-center lg:grid-cols-2 gap-8">
          <div className="grid mx-auto h-128 sm:h-64" style={{ width: '99%' }}>
            <StatusChart status={stats.state.data?.status} />
          </div>
          <table>
            <thead>
              <tr>
                <th className="text-left">Status</th>
                <th className="w-32">Average</th>
                <th className="w-32">Time</th>
                <th className="w-32">Games</th>
              </tr>
            </thead>
            <tbody>
              {stats.state.data?.status.map(status =>
              <tr key={status.status}>
                <td>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block rounded-full w-4 h-4 ${getStatusColor(status.status)}`}></span>
                    <Link href={`/?status=${status.status}`} legacyBehavior>
                      <a>{capitalize(status.status)}</a>
                    </Link>
                  </div>
                </td>
                <td>{toFixed(status._avg.totalHours)}</td>
                <td>{status._sum.totalHours}h</td>
                <td>{status._count._all}</td>
              </tr>
              )}
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-semibold border-b-2 -mb-4">Platforms</h3>
        <div className="grid items-center lg:grid-cols-2 gap-8">
          <div className="flex items-center h-64 mx-auto md:h-96" style={{ width: '99%' }}>
            <PlatformsChart platforms={stats.state.data?.platforms} />
          </div>
          <table>
            <thead>
              <tr>
                <th className="text-left">Name</th>
                <th className="w-32">Time</th>
                <th className="w-32">Games</th>
              </tr>
            </thead>
            <tbody>
              {reducePlatforms(stats.state.data?.platforms ?? [])
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((platform, index) =>
                <tr key={index}>
                  <td>
                    <Link href={`/?platformId=${platform.igdbId}`} legacyBehavior>
                      <a>{platform.name}</a>
                    </Link>
                  </td>
                  <td>{platform._totalHours}h</td>
                  <td>{platform._count}</td>
                </tr>
                )
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps (context: GetServerSidePropsContext) {
  // @ts-ignore
  const { user } = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )
  const query = parseStatsQuery(context.query)
  const platforms = await findPlatforms()
  try {
    const data = await findStats(user.id, query)
    return {
      props: JSON.parse(JSON.stringify({
        data,
        query,
        platforms,
        error: null
      }))
    }
  } catch (error) {
    return {
      props: JSON.parse(JSON.stringify({
        data: null,
        query,
        platforms,
        error: `${error}`
      }))
    }
  }
}
