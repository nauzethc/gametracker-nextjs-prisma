import { CalendarIcon, ChartPieIcon, ClockIcon } from '@heroicons/react/solid'
import { Fragment } from 'react'
import { GameWithPlatform } from '../../types/games'
import { GamepadAltIcon, GameplayIcon } from '../common/icons'
import GameItem from './game-item'
import Cover from '../common/cover'
import ProgressBar from '../common/progress-bar'
import Link from 'next/link'

type SearchResultProps = {
  data?: GameWithPlatform[],
  count?: number,
  asTable?: boolean
}

export default function SearchResults ({ data = [], count, asTable }: SearchResultProps) {
  return (
    !asTable
      ? <Fragment>
        {Array.isArray(data)
          ? data.map(game => <GameItem key={game.id} data={game} />)
          : null
        }
      </Fragment>
      : <table className="table-auto search-results-table col-span-full">
        <thead>
          <tr>
            <th className="w-16" />
            <th>
              <span className="sr-only">Name</span>
            </th>
            <th className="hidden md:table-cell">
              <span className="sr-only">Gameplay</span>
            </th>
            <th className="">
              <span className="sr-only">Platform</span>
              <GamepadAltIcon className="w-6 h-6" />
            </th>
            <th>
              <span className="sr-only">Total time</span>
              <ClockIcon className="w-6 h-6" />
            </th>
            <th className="hidden md:table-cell">
              <span className="sr-only">Started on</span>
              <CalendarIcon className="w-6 h-6" />
            </th>
            <th className="w-20 sm:w-24">
              <span className="sr-only">Progress</span>
              <ChartPieIcon className="w-6 h-6" />
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map(game =>
            <tr key={game.id} className="">
              <td className="">
                <Link href={`/games/${game.id}`}>
                  <a><Cover className="w-16" src={game.cover || undefined} alt={game.name} /></a>
                </Link>
              </td>
              <td className="" data-title>
                <Link href={`/games/${game.id}`}>
                  <a>{game.name}</a>
                </Link>
              </td>
              <td data-gameplay className="hidden md:table-cell">
                <span className="sr-only">{game.gameplayType}</span>
                <GameplayIcon className="w-6 h-6" gameplay={game.gameplayType} />
              </td>
              <td data-platform>
                <span className="lg:hidden">{game.platform.abbreviation}</span>
                <span className="hidden lg:block">{game.platform.name}</span>
              </td>
              <td data-time className="">{game.totalHours}h</td>
              <td data-date className="hidden md:table-cell">
                {`${game.startedOn}`.slice(0, 10)}
              </td>
              <td className="w-20 sm:w-24">
                <ProgressBar value={game.progress} className={game.status}>
                  <span className="text-sm font-semibold px-2">{game.progress}%</span>
                </ProgressBar>
              </td>
            </tr>
          )}
        </tbody>
      </table>
  )
}
