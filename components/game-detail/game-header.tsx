import { Image } from '@nextui-org/react'
import { GameWithPlatform } from '../../types/games'
import { toHumanReadableString } from '../../utils/strings'

type GamePreviewProps = {
  className?: string,
  data: GameWithPlatform,
  onBookmark?: Function
}

export default function GameHeader ({ className = '', data, onBookmark }: GamePreviewProps) {
  return (
    <div className={`flex flex-wrap gap-8 ${className}`}>
      <div className="w-24 flex-shrink-0 lg:w-32">
        <Image className="" src={data.cover || undefined} alt={data.name} />
      </div>
      <div className="flex flex-col flex-grow justify-end gap-4">
        <h1 className="text-2xl font-semibold">
          {data.name}
        </h1>
        <div className="field flex flex-col">
          <span className="font-semibold text-sm">Release date</span>
          <span>{toHumanReadableString(data.releaseDate)}</span>
        </div>
      </div>
    </div>
  )
}
