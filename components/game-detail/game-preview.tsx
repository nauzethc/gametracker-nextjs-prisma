import Cover from '../common/cover'
import { capitalize } from '../../utils/strings'
import { GameWithPlatform } from '../../types/games'
import { CalendarIcon, ChartPieIcon, ClockIcon } from '@heroicons/react/solid'
import { GamepadAltIcon, TrophyIcon, StatusIcon, GameplayIcon } from '../common/icons'
import Rating from '../common/rating'
import ProgressBar from '../common/progress-bar'

type GamePreviewProps = {
  data: GameWithPlatform
}

function getStatus (status: string, date: Date | null): string {
  if (status === 'finished') {
    return date
      ? `Finished (${new Date(date).toISOString().substring(0, 10)})`
      : 'Finished'
  }
  return capitalize(status)
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

export default function GamePreview ({ data }: GamePreviewProps) {
  return (
    <div className="game-preview grid">
      <div className="flex flex-wrap gap-4">
        <div className="w-32 flex-shrink-0">
          <Cover src={data.cover || undefined} alt={data.name} />
        </div>
        <div className="flex flex-col flex-grow gap-2">
          <h1 className="text-xl font-semibold">{data.name}</h1>
          <div className="field flex flex-col">
            <span className="font-semibold text-sm">Developer</span>
            <span>{data.developers.join(', ')}</span>
          </div>
          <div className="field flex flex-col">
            <span className="font-semibold text-sm">Publisher</span>
            <span>{data.publishers.join(', ')}</span>
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
          <span className="text-lg">
            {`${new Date(data.startedOn).toISOString().substring(0, 10)}`}
          </span>
        </Stat>
        <Stat label="Status">
          <StatusIcon status={data.status} className="w-8 h-8" />
          <span className="text-lg">
            {getStatus(data.status, data.finishedOn)}
          </span>
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
          <Rating max={5} value={Number(data.rating)} size={8} />
          {data.comment ? <blockquote className="px-4">{data.comment}</blockquote> : null}
        </div>
      </div>
    </div>
  )
}
