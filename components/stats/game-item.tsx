import { GameStats } from '../../types/games'
import Cover from '../common/cover'
import { ClockIcon, CalendarIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import DateField from '../common/date-field'

type GameItemProps = {
  className?: string,
  data: GameStats,
  ranking: number
}

export default function GameItem ({ className = '', data, ranking } : GameItemProps) {
  return (
    <div className={`game-item flex flex-col gap-2 ranking-${ranking} ${className}`}>
      <div className="flex gap-x-6">
        <div className="media w-28 flex-shrink-0 relative flex flex-row-reverse items-center gap-4 sm:w-24 md:w-32">
          <Link href={`/?igdbId=${data.igdbId}`} legacyBehavior>
            <a>
              <Cover src={data.cover || undefined} alt={data.name} />
            </a>
          </Link>
          <div className="sm:absolute bottom-0 inset-x-0 flex justify-center">
            <span className="badge rounded-full h-8 w-8 -mb-1 border-4 grid place-content-center font-semibold">{ranking}</span>
          </div>
        </div>
        <div className="meta flex-grow grid xs:grid-cols-2 place-content-start gap-y-2 gap-x-4 sm:gap-y-3 md:grid-cols-1">
          <div className="col-span-full grid">
            <h1 className="font-semibold text-lg leading-6 whitespace-nowrap overflow-hidden text-ellipsis">
              <Link href={`/?igdbId=${data.igdbId}`} legacyBehavior><a>{data.name}</a></Link>
            </h1>
          </div>
          <div className="field items-center flex gap-3">
            <ClockIcon className="w-6 h-6" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold hidden sm:block">Total time</span>
              <span>{data._sum.totalHours} hours {data._count._all > 1 ? `(${data._count._all})` : ''}</span>
            </div>
          </div>
          <div className="field items-center flex gap-3">
            <CalendarIcon className="w-6 h-6" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold hidden sm:block">Last time played</span>
              <DateField format="medium" value={data._max.finishedOn} defaultValue="Unknown" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
