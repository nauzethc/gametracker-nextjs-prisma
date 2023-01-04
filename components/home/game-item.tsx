import { GameWithPlatform } from '../../types/games'
import Cover from '../common/cover'
import { GamepadAltIcon, GameplayIcon } from '../common/icons'
import { BookmarkIcon, CalendarIcon, ChartPieIcon, ClockIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { capitalize } from '../../utils/strings'
import ProgressBar from '../common/progress-bar'
import Rating from '../common/rating'

type GameItemProps = {
  data: GameWithPlatform
}

export default function GameItem ({ data } : GameItemProps) {
  return (
    <div className={`game-item flex flex-col gap-2 ${data.fixed ? 'is-playing' : ''}`}>
      <div className="flex gap-x-6">
        <div className="media w-16 sm:w-24 flex-shrink-0">
          <Link href={`/games/${data.id}`}>
            <a className="relative">
              <Cover src={data.cover || undefined} alt={data.name} />
              {data.fixed ? <BookmarkIcon className="w-5 h-5 sm:w-6 sm:h-6 absolute top-0 -mt-2 right-0 mr-1 bookmark" /> : null}
            </a>
          </Link>
          <Rating className="text-yellow-400 dark:text-yellow-500" value={data.rating ?? 0} size={5} />
        </div>
        <div className="meta flex-grow grid grid-cols-2 place-content-start gap-y-2 gap-x-4 sm:gap-y-3 md:grid-cols-1">
          <div className="col-span-full grid">
            <h1 className="font-semibold text-lg leading-6 whitespace-nowrap overflow-hidden text-ellipsis title">
              <Link href={`/games/${data.id}`}><a>{data.name}</a></Link>
            </h1>
          </div>
          <div className="field hidden sm:flex gap-3 ">
            <GameplayIcon className="w-6 h-6" gameplay={data.gameplayType} />
            <span>{capitalize(data.gameplayType)}</span>
          </div>
          <div className="field flex gap-3">
            <GamepadAltIcon className="w-6 h-6" />
            <span className="hidden sm:block">{data.platform.name}</span>
            <span className="sm:hidden">{data.platform.abbreviation}</span>
          </div>
          <div className="field flex gap-3">
            <ClockIcon className="w-6 h-6" />
            <span>{data.totalHours} hours</span>
          </div>
          <div className="field hidden sm:flex gap-3">
            <CalendarIcon className="w-6 h-6" />
            <span>{new Date(data.startedOn).toISOString().slice(0, 10)}</span>
          </div>
          <div className="col-span-full field flex gap-3">
            <ChartPieIcon className="w-6 h-6" />
            <div className="w-full max-w-xs">
              <ProgressBar value={data.progress} className={data.status}>
                <span className="text-sm font-semibold px-2">{data.progress}%</span>
              </ProgressBar>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
