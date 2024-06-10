import { capitalize } from '../../utils/strings'
import { GameWithPlatform } from '../../types/games'
import { BookmarkIcon, CalendarIcon, ChartPieIcon, ClockIcon, RocketLaunchIcon, TrophyIcon } from '@heroicons/react/24/solid'
import { BookmarkIcon as BookmarkOutlineIcon } from '@heroicons/react/24/outline'
import { GamepadAltIcon, StatusIcon, GameplayIcon } from '../common/icons'
import Rating from '../common/rating'
import DateField from '../common/date-field'
import { Button, Image, Link, Progress } from '@nextui-org/react'
import { getStatusColor } from '../../utils/colors'

type GamePreviewProps = {
  className?: string,
  data: GameWithPlatform,
  onBookmark?: Function
}

function toStatusLabel (status: string): string {
  switch (status) {
    case 'ongoing':
      return 'On Going'
    default:
      return capitalize(status)
  }
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
    : <span className={className}>{toStatusLabel(status)}</span>
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
          <Image src={data.cover || undefined} alt={data.name} />
        </div>
        <div className="flex flex-col flex-grow gap-2">
          <h1 className="text-xl font-semibold flex items-center gap-2 justify-between">{data.name}
          <Button
            isIconOnly
            aria-label="pinned"
            radius="full"
            variant="light"
            color="primary"
            onClick={handleBookmark}>
            {data.fixed
              ? <BookmarkIcon className="size-6" />
              : <BookmarkOutlineIcon className="size-6" />
            }
          </Button>
        </h1>
          <div className="field flex flex-col">
            <span className="font-semibold text-sm">Developer</span>
            <ul className="comma-list">
              {data.developers.map((developer, index) =>
                <li key={index}>
                  <Link href={`/?developer=${developer}`}>{developer}</Link>
                </li>
              )}
            </ul>
          </div>
          <div className="field flex flex-col">
            <span className="font-semibold text-sm">Publisher</span>
            <ul className="comma-list">
              {data.publishers.map((publisher, index) =>
                <li key={index}>
                  <Link href={`/?publisher=${publisher}`}>{publisher}</Link>
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
          <CalendarIcon className="size-8" />
          <DateField className="text-lg"
            value={data.startedOn}
            format="medium" />
        </Stat>
        <Stat label="Status">
          <StatusIcon status={data.status} className="size-8" />
          <StatusField className="text-lg"
            status={data.status}
            date={data.finishedOn} />
        </Stat>
        <Stat label="Total hours">
          <ClockIcon className="size-8" />
          <span>{`${data.totalHours}h`}</span>
        </Stat>
        <Stat label="Progress">
          <ChartPieIcon className="size-8" />
          <Progress value={data.progress} color={getStatusColor(data.status)} />
        </Stat>
        <Stat label="Gameplay">
          <GameplayIcon gameplay={data.gameplayType} className="size-8" />
          <span>{capitalize(data.gameplayType)}</span>
        </Stat>
        <Stat label="Platform">
          <GamepadAltIcon className="size-8" />
          <Link href={`/?platformId=${data.platformId}`}>{data.platform.name}</Link>
        </Stat>
        <Stat label="Achievements">
          <TrophyIcon className="size-8" />
          <span>{`${data.achievementsUnlocked} of ${data.achievementsTotal}`}</span>
        </Stat>
        <Stat label="Genres">
          <RocketLaunchIcon className="size-8" />
          <ul className="comma-list">
            {data.genres.map((genre, index) =>
              <li key={index}>
                <Link href={`/?genre=${genre}`}>{genre}</Link>
              </li>
            )}
          </ul>
        </Stat>
        <div className="col-span-full flex flex-col gap-4 items-center justify-center mt-4">
          <Rating max={5} value={Number(data.rating)} size={8} />
          {data.comment ? <blockquote className="px-4">{data.comment}</blockquote> : null}
        </div>
      </div>
    </div>
  )
}
