import { GetServerSidePropsContext } from 'next'
import { getStats } from '../services/games'
import { GameStats, PlatformStats, StatusStats } from '../types/games'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'
import Error from '../components/common/error'
import { capitalize } from '../utils/strings'
import GameItem from '../components/stats/game-item'
import { HeaderPortal } from '../components/app/header'
import UserButton from '../components/common/user-button'
import { PlusCircleIcon } from '@heroicons/react/solid'
import Link from 'next/link'

function toFixed (hours: number | null): string {
  return hours ? `${Math.floor(hours)}h` : '-'
}

export default function StatsView ({ data, error }: {
  data: {
    status: StatusStats[],
    games: GameStats[],
    platforms: PlatformStats[]
  },
  error: any
}) {
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

        <div className="grid gap-3">
          <h3 className="text-lg font-semibold border-b-2">Most played</h3>
          {data.games.map(game => <GameItem key={game.igdbId} data={game} />)}
        </div>

        <table>
          <caption>Games</caption>
          <thead>
            <tr>
              <th className="text-left">Status</th>
              <th className="w-32">(avg)</th>
              <th className="w-32">(sum)</th>
              <th className="w-32">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.status.map(status =>
            <tr key={status.status}>
              <td>{capitalize(status.status)}</td>
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
              <th className="w-32">(sum)</th>
              <th className="w-32">Games</th>
            </tr>
          </thead>
          <tbody>
            {data.platforms.sort((a, b) => a.name.localeCompare(b.name)).map(platform =>
            <tr key={platform.igdbId}>
              <td>{platform.name}</td>
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
  try {
    const data = await getStats(user.id)
    return {
      props: {
        data: JSON.parse(JSON.stringify(data)),
        error: null
      }
    }
  } catch (error) {
    return {
      props: {
        data: null,
        error: JSON.parse(JSON.stringify(error))
      }
    }
  }
}
