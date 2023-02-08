import Cover from '../common/cover'
import { capitalize } from '../../utils/strings'
import { GameWithPlatform } from '../../types/games'
import { BookmarkIcon, CalendarIcon, ChartPieIcon, ClockIcon } from '@heroicons/react/24/solid'
import { BookmarkIcon as BookmarkOutlineIcon } from '@heroicons/react/24/outline'
import { GamepadAltIcon, TrophyIcon, StatusIcon, GameplayIcon } from '../common/icons'
import Rating from '../common/rating'
import ProgressBar from '../common/progress-bar'
import Link from 'next/link'
import DateField from '../common/date-field'

type GamePreviewProps = {
  className?: string,
  data: GameWithPlatform,
  onBookmark?: Function
}

function StatusField ({
  className = '',
  status,
  date
}: {
  className?: string,
  status: string,
  date: Date | null
}) {
  return (status === 'finished')
    ? date
      ? <span className={className}>Finished (<DateField format="medium" value={date} />)</span>
      : <span className={className}>Finished</span>
    : <span className={className}>{capitalize(status)}</span>
}

function toDateString (date: Date | null): string {
  return date ? new Date(date).toDateString() : 'Unknown release'
}

function Stat ({ label, children } : { label: string, children?: any }) {
  return (
    <div className="flex flex-col">
      <span className="pl-12 block text-sm font-medium opacity-70">{label}</span>
      <div className="flex items-center gap-4">
        {children}
      </div>
    </div>
  )
}

export default function GamePreview ({ className = '', data, onBookmark }: GamePreviewProps) {
  const handleBookmark = () => {
    if (onBookmark && typeof onBookmark === 'function') {
      onBookmark()
    }
  }
  return (
    <div className={`game-preview grid ${className}`}>
      <div className="flex flex-wrap gap-4 relative">
        <div className="w-32 flex-shrink-0">
          <Cover src={data.cover || undefined} alt={data.name} />
        </div>
        <div className="flex flex-col flex-grow gap-2">
          <h1 className="text-xl font-semibold flex items-center gap-2 justify-between">{data.name}
          <button onClick={handleBookmark} className="btn-invisible h-10 w-10" aria-label="pinned">
            {data.fixed
              ? <BookmarkIcon className="w-6 h-6" />
              : <BookmarkOutlineIcon className="w-6 h-6" />
            }
          </button>
        </h1>
          <div className="field flex flex-col">
            <span className="font-semibold text-sm">Developer</span>
            <ul className="comma-list">
              {data.developers.map((developer, index) =>
                <li key={index}>
                  <Link href={`/?developer=${developer}`} legacyBehavior>
                    <a>{developer}</a>
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <div className="field flex flex-col">
            <span className="font-semibold text-sm">Publisher</span>
            <ul className="comma-list">
              {data.publishers.map((publisher, index) =>
                <li key={index}>
                  <Link href={`/?publisher=${publisher}`} legacyBehavior>
                    <a>{publisher}</a>
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <div className="field flex flex-col">
            <span className="font-semibold text-sm">Release date</span>
            <span>{toDateString(data.releaseDate)}</span>
          </div>
        </div>
        <blockquote className="w-full px-4">{data.summary}</blockquote>
      </div>
      <div className="grid gap-y-2 sm:grid-cols-2 py-6">
        <Stat label="Started on">
          <CalendarIcon className="w-8 h-8" />
          <DateField className="text-lg"
            value={data.startedOn}
            format="medium" />
        </Stat>
        <Stat label="Status">
          <StatusIcon status={data.status} className="w-8 h-8" />
          <StatusField className="text-lg"
            status={data.status}
            date={data.finishedOn} />
        </Stat>
        <Stat label="Total hours">
          <ClockIcon className="w-8 h-8" />
          <span>{`${data.totalHours}h`}</span>
        </Stat>
        <Stat label="Progress">
          <ChartPieIcon className="w-8 h-8" />
          <div className="w-full max-w-xs">
            <ProgressBar value={data.progress} className={data.status}>
              <span className="text-sm font-semibold px-2">{data.progress}%</span>
            </ProgressBar>
          </div>
        </Stat>
        <Stat label="Gameplay">
          <GameplayIcon gameplay={data.gameplayType} className="w-8 h-8" />
          <span>{capitalize(data.gameplayType)}</span>
        </Stat>
        <Stat label="Platform">
          <GamepadAltIcon className="w-8 h-8" />
          <span>{data.platform.name}</span>
        </Stat>
        <Stat label="Achievements">
          <TrophyIcon className="w-8 h-8" />
          <span>{`${data.achievementsUnlocked} of ${data.achievementsTotal}`}</span>
        </Stat>
        <div className="col-span-full flex flex-col gap-4 items-center justify-center">
          <Rating className="text-yellow-400 dark:text-yellow-500" max={5} value={Number(data.rating)} size={8} />
          {data.comment ? <blockquote className="px-4">{data.comment}</blockquote> : null}
        </div>
      </div>
    </div>
  )
}
