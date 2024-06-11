import { CalendarIcon, ChartPieIcon, ClockIcon } from '@heroicons/react/24/solid'
import { Fragment } from 'react'
import { GameWithPlatform } from '../../types/games'
import { GamepadAltIcon, GameplayIcon } from '../common/icons'
import GameItem from './game-item'
import DateField from '../common/date-field'
import { Image, Progress, Link, Tooltip, Button } from '@nextui-org/react'
import { getStatusColor } from '../../utils/colors'
import { capitalize } from '../../utils/strings'

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
      : <table className="col-span-full border-separate border-spacing-2 text-center">
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
              <Tooltip content="Platform">
                <Button isIconOnly variant="light">
                  <GamepadAltIcon className="size-6" />
                </Button>
              </Tooltip>
            </th>
            <th>
              <span className="sr-only">Total time</span>
              <Tooltip content="Played hours">
                <Button isIconOnly variant="light">
                  <ClockIcon className="size-6" />
                </Button>
              </Tooltip>
            </th>
            <th className="hidden md:table-cell">
              <span className="sr-only">Started on</span>
              <Tooltip content="Started on">
                <Button isIconOnly variant="light">
                  <CalendarIcon className="size-6" />
                </Button>
              </Tooltip>
            </th>
            <th className="w-20 sm:w-24">
              <span className="sr-only">Progress</span>
              <Tooltip content="Progress">
                <Button isIconOnly variant="light">
                  <ChartPieIcon className="size-6" />
                </Button>
              </Tooltip>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map(game =>
            <tr key={game.id} className={game.fixed ? 'is-playing' : ''}>
              <td>
                <Image src={game.cover || undefined} alt={game.name} radius="sm" />
              </td>
              <td className="text-left px-2">
                <Link href={`/games/${game.id}`}>{game.name}</Link>
              </td>
              <td className="hidden md:table-cell">
                <span className="sr-only">{game.gameplayType}</span>
                <Tooltip content={capitalize(game.gameplayType)} placement="bottom">
                  <Button isIconOnly variant="light">
                    <GameplayIcon className="size-6" gameplay={game.gameplayType} />
                  </Button>
                </Tooltip>
              </td>
              <td>
                <span>{game.platform.abbreviation}</span>
              </td>
              <td>{game.totalHours}h</td>
              <td className="hidden md:table-cell">
                <DateField format="medium" value={game.startedOn} />
              </td>
              <td className="w-20 sm:w-24">
                <Progress
                  value={game.progress}
                  color={getStatusColor(game.status)}
                  aria-label={`${game.progress}% completed`} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
  )
}
