import { GetServerSidePropsContext } from 'next'
import { getStats } from '../services/games'
import { AllStats } from '../types/games'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'
import Error from '../components/common/error'
import { capitalize } from '../utils/strings'
import GameItem from '../components/stats/game-item'
import { HeaderPortal } from '../components/app/header'
import UserButton from '../components/common/user-button'
import { PlusCircleIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useDidMount } from '../hooks/lifecycle'
import { useEndpoint } from '../hooks/http'
import { useRouter } from 'next/router'
import { toString } from '../utils/url'

function toFixed (hours: number | null): string {
  return hours ? `${Math.floor(hours)}h` : '-'
}

export default function StatsView ({
  query: initialQuery,
  data,
  error
}: {
  query?: Record<string, any>,
  data: AllStats,
  error: any
}) {
  const didMount = useDidMount()
  const [query, setQuery] = useState<Record<string, any>>({ period: 'all', ...initialQuery })
  const stats = useEndpoint<AllStats>('/api/stats', { data, error })
  const router = useRouter()

  const handlePeriodChange = (period: string) => setQuery({ ...query, period })

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
          <Link href="/track">
            <a className="btn btn-primary px-4 h-10 text-sm">
              <PlusCircleIcon className="h-6 w-6" />
              <span>Track</span>
            </a>
          </Link>
        </HeaderPortal>

        <Error error={error} />

        <form onSubmit={e => e.preventDefault()}>
          <div className="field">
            <label className="text-sm font-semibold" htmlFor="period">Period</label>
            <select
              className="form-input"
              onChange={(e) => handlePeriodChange(e.target.value)}
              value={query.period}>
              <option value="all">All</option>
              <option value="year">Last year</option>
              <option value="semester">Last 6 months</option>
            </select>
          </div>
        </form>

        <h3 className="text-lg font-semibold border-b-2 -mb-4">Most played</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {stats.state.data?.games.map((game, index) =>
            <GameItem ranking={index + 1} key={game.igdbId} data={game} />
          )}
        </div>

        <table>
          <caption>Games</caption>
          <thead>
            <tr>
              <th className="text-left">Status</th>
              <th className="w-32">Average</th>
              <th className="w-32">Hours</th>
              <th className="w-32">Games</th>
            </tr>
          </thead>
          <tbody>
            {stats.state.data?.status.map(status =>
            <tr key={status.status}>
              <td>
                <Link href={`/?status=${status.status}`}>
                  <a>{capitalize(status.status)}</a>
                </Link>
              </td>
              <td>{toFixed(status._avg.totalHours)}</td>
              <td>{status._sum.totalHours}h</td>
              <td>{status._count._all}</td>
            </tr>
            )}
          </tbody>
        </table>

        <table>
          <caption>Platforms</caption>
          <thead>
            <tr>
              <th className="text-left">Name</th>
              <th className="w-32">Hours</th>
              <th className="w-32">Games</th>
            </tr>
          </thead>
          <tbody>
            {stats.state.data?.platforms.sort((a, b) => a.name.localeCompare(b.name)).map(platform =>
            <tr key={platform.igdbId}>
              <td>
                <Link href={`/?platformId=${platform.igdbId}`}>
                  <a>{platform.name}</a>
                </Link>
              </td>
              <td>{platform._sum.totalHours}h</td>
              <td>{platform._count._all}</td>
            </tr>
            )}
          </tbody>
        </table>
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
  const query = { period: toString(context.query.period) }
  try {
    const data = await getStats(user.id, query.period)
    return {
      props: JSON.parse(JSON.stringify({
        data,
        query,
        error: null
      }))
    }
  } catch (error) {
    return {
      props: JSON.parse(JSON.stringify({
        data: null,
        query,
        error
      }))
    }
  }
}
