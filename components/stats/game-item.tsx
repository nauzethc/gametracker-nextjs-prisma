import { GameStats } from '../../types/games'
import Cover from '../common/cover'
import { ClockIcon, CalendarIcon } from '@heroicons/react/solid'
import Link from 'next/link'

type GameItemProps = {
  data: GameStats
}

export default function GameItem ({ data } : GameItemProps) {
  return (
    <div className="game-item flex flex-col gap-2">
      <div className="flex gap-x-6">
        <div className="media w-16 sm:w-24 flex-shrink-0">
          <Link href={'/games/'}>
            <a>
              <Cover src={data.cover || undefined} alt={data.name} />
            </a>
          </Link>
        </div>
        <div className="meta flex-grow grid grid-cols-2 place-content-start gap-y-2 gap-x-4 sm:gap-y-3 md:grid-cols-1">
          <div className="col-span-full grid">
            <h1 className="font-semibold text-lg leading-6 whitespace-nowrap overflow-hidden text-ellipsis">
              <Link href={'/games/'}><a>{data.name}</a></Link>
            </h1>
          </div>
          <div className="field items-center flex gap-3">
            <ClockIcon className="w-6 h-6" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Total time</span>
              <span>{data._sum.totalHours} hours</span>
            </div>
          </div>
          <div className="field items-center flex gap-3">
            <CalendarIcon className="w-6 h-6" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Last time played</span>
              <span>{data._max.finishedOn
                ? new Date(data._max.finishedOn).toISOString().slice(0, 10)
                : 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
