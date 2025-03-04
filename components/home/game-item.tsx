import { GameWithPlatform } from '../../types/games'
import { GamepadAltIcon, GameplayIcon } from '../common/icons'
import { BookmarkIcon, CalendarIcon, ChartPieIcon, ClockIcon } from '@heroicons/react/24/solid'
import { capitalize } from '../../utils/strings'
import DateField from '../common/date-field'
import { Card, CardBody, Image, Link, Progress } from '@nextui-org/react'
import { useImageColors } from '../../hooks/color'
import Rating from '../common/rating'
import { getStatusColor } from '../../utils/colors'
import CardBackground from '../common/card-background'
import EmulatedFlag from '../common/emulated-flag'

function Bookmark ({ isEnabled = false }: { isEnabled?: boolean | null }) {
  return isEnabled
    ? <BookmarkIcon className="text-danger size-5 sm:size-6 absolute top-0 right-0 -mt-1 mr-2 z-10" />
    : null
}

type GameItemProps = {
  data: GameWithPlatform,
  onClick?: (id: string) => void
}

export default function GameItem ({ data, onClick }: GameItemProps) {
  const { color, background } = useImageColors(data.cover)
  const ICON_SIZE = 'size-5'

  function handleClick () {
    if (onClick) onClick(data.id)
  }

  return (
    <Card
      className="relative transition-colors duration-1000"
      style={{ color }}
      isPressable={onClick !== undefined}
      onPress={handleClick}>
      <CardBackground color={background} />
      <CardBody>
        <div className="flex items-start gap-4 @container">
          <div className="w-24 flex-shrink-0 relative flex flex-col items-center gap-3">
            <Image src={data.cover || undefined} alt={data.name} />
            <Bookmark isEnabled={data.fixed} />
            <Rating className="@sm:hidden" value={data.rating ?? 0} size={4} />
          </div>
          <div className="flex-grow grid gap-2 text-sm @sm:grid-cols-2">
            <div className="col-span-full">
              <h4 className="font-semibold">
                <Link style={{ color: 'inherit' }} href={`/games/${data.id}`}>{data.name}</Link>
              </h4>
            </div>
            <div className="flex items-center gap-3">
              <GameplayIcon className={ICON_SIZE} gameplay={data.gameplayType} />
              <span>{capitalize(data.gameplayType)}</span>
            </div>
            <div className="flex items-center gap-3">
              <GamepadAltIcon className={ICON_SIZE} />
              <span className="hidden @lg:block">{data.platform.name}</span>
              <span className="block @lg:hidden">{data.platform.abbreviation}</span>
              <EmulatedFlag show={data.emulated} />
            </div>
            <div className="flex gap-3">
              <ClockIcon className={ICON_SIZE} />
              <span>{data.totalHours} hours</span>
            </div>
            <div className="flex gap-3">
              <CalendarIcon className={ICON_SIZE} />
              <DateField format="medium" value={data.startedOn} />
            </div>
            <div className="flex gap-3 items-center col-span-full">
              <ChartPieIcon className={ICON_SIZE} />
              <Progress value={data.progress} color={getStatusColor(data.status)} />
            </div>
            <div className="col-span-full hidden @sm:flex justify-end my-1">
              <Rating value={data.rating ?? 0} size={4} />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
