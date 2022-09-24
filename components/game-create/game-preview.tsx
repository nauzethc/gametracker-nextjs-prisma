import Cover from '../common/cover'
import { IGDBGameSelected } from '../../types/igdb'

type GamePreviewProps = {
  data: IGDBGameSelected|null
}

function toDateString (date?: Date): string {
  return date ? new Date(date).toDateString() : 'Unknown release'
}

export default function GamePreview ({ data }: GamePreviewProps) {
  return (data !== null)
    ? <div className="game-preview grid">
        <div className="flex gap-4">
          <div className="w-24 flex-shrink-0">
            <Cover src={data.cover || undefined} alt={data.name} />
          </div>
          <div className="flex flex-col flex-grow gap-1 justify-start">
            <h1 className="text-xl font-semibold">{data.name}</h1>
            <div className="flex flex-col">
              <span className="text-sm font-semibold opacity-70">Developers</span>
              <span className="text-sm">{data.developers.join(', ')}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold opacity-70">Publishers</span>
              <span className="text-sm">{data.publishers.join(', ')}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold opacity-70">Release date</span>
              <span className="text-sm">{toDateString(data.releaseDate)}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-2">
          <span className="text-sm font-semibold opacity-70">Platform</span>
          <span className="form-input font-semibold disabled">{data.platform.name}</span>
        </div>
      </div>
    : null
}
