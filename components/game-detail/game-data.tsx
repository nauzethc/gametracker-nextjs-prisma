import { capitalize } from '../../utils/strings'
import { GameWithPlatform } from '../../types/games'
import { BriefcaseIcon, CalendarIcon, ChartPieIcon, ClockIcon, PaintBrushIcon, RocketLaunchIcon, TrophyIcon } from '@heroicons/react/24/solid'
import { GamepadAltIcon, StatusIcon, GameplayIcon } from '../common/icons'
import Rating from '../common/rating'
import DateField from '../common/date-field'
import { Link, Progress } from '@nextui-org/react'
import { getStatusColor } from '../../utils/colors'
import EmulatedFlag from '../common/emulated-flag'

type GameDataProps = {
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

function Stat ({ className = '', label, children } : { className?: string, label: string, children?: any }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="pl-12 block text-sm font-medium opacity-70">{label}</span>
      <div className="flex items-center gap-6">
        {children}
      </div>
    </div>
  )
}

export default function GameData ({ className = '', data }: GameDataProps) {
  return (
    <div className={`game-data grid gap-4 md:grid-cols-2 ${className}`}>
      <Stat label="Developer">
        <PaintBrushIcon className="size-6" />
        <ul className="comma-list">
          {data.developers.map((developer, index) =>
            <li key={index}>
              <Link href={`/?developer=${developer}`}>{developer}</Link>
            </li>
          )}
        </ul>
      </Stat>

      <Stat label="Publisher" className="col-span-full">
        <BriefcaseIcon className="size-6" />
        <ul className="comma-list">
          {data.publishers.map((publisher, index) =>
            <li key={index}>
              <Link href={`/?publisher=${publisher}`}>{publisher}</Link>
            </li>
          )}
        </ul>
      </Stat>

      <blockquote className="col-span-full p-4">{data.summary}</blockquote>
      <hr className="col-span-full my-3" />

      <Stat label="Started on">
        <CalendarIcon className="size-6" />
        <DateField value={data.startedOn} format="medium" />
      </Stat>

      <Stat label="Status">
        <StatusIcon status={data.status} className="size-6" />
        <StatusField status={data.status} date={data.finishedOn} />
      </Stat>

      <Stat label="Total hours">
        <ClockIcon className="size-6" />
        <span>{`${data.totalHours}h`}</span>
      </Stat>

      <Stat label="Progress">
        <ChartPieIcon className="size-6" />
        <Progress
          value={data.progress}
          color={getStatusColor(data.status)}
          aria-label={`${data.progress}% completed`} />
      </Stat>

      <Stat label="Gameplay">
        <GameplayIcon gameplay={data.gameplayType} className="size-6" />
        <span>{capitalize(data.gameplayType)}</span>
      </Stat>

      <Stat label="Platform">
        <GamepadAltIcon className="size-6" />
        <div className="flex items-center gap-2">
          <Link href={`/?platformId=${data.platformId}`}>
            {data.platform.name}
          </Link>
          <EmulatedFlag show={data.emulated} />
        </div>
      </Stat>

      <Stat label="Achievements">
        <TrophyIcon className="size-6" />
        <span>{`${data.achievementsUnlocked} of ${data.achievementsTotal}`}</span>
      </Stat>

      <Stat label="Genres">
        <RocketLaunchIcon className="size-6" />
        <ul className="comma-list">
          {data.genres.map((genre, index) =>
            <li key={index}>
              <Link href={`/?genre=${genre}`}>{genre}</Link>
            </li>
          )}
        </ul>
      </Stat>

      <div className="col-span-full flex flex-col gap-4 items-center justify-center mt-4">
        {data.comment ? <blockquote className="px-4">{data.comment}</blockquote> : null}
        <Rating max={5} value={Number(data.rating)} size={8} />
      </div>
    </div>
  )
}
