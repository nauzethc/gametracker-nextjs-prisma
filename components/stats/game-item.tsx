import { GameStats } from '../../types/games'
import { ClockIcon, CalendarIcon } from '@heroicons/react/24/solid'
import DateField from '../common/date-field'
import { Card, CardBody, Image, Link } from '@nextui-org/react'
import { useImageColors } from '../../hooks/color'
import Medal from '../common/medal'
import CardBackground from '../common/card-background'

type GameItemProps = {
  className?: string,
  data: GameStats,
  ranking: number
}

export default function GameItem ({ className = '', data, ranking } : GameItemProps) {
  const { color, background } = useImageColors(data.cover)
  return (
    <Card className={`relative transition-colors duration-1000${className}`} style={{ color }}>
      <CardBackground color={background} />
      <CardBody>
        <div className={`ranking-${ranking}`}>
          <div className="flex gap-4">
            <div className="w-24 flex-shrink-0">
              <Image src={data.cover ?? undefined} alt={data.name} />
              <div className="z-10 -mt-4 relative flex justify-center">
                <Medal className="shadow-lg" ranking={ranking} />
              </div>
            </div>
            <div className="meta flex-grow grid xs:grid-cols-2 place-content-start gap-y-2 gap-x-4 sm:gap-y-3 md:grid-cols-1">
              <div className="col-span-full grid">
                <h1 className="font-semibold text-lg leading-6 whitespace-nowrap overflow-hidden text-ellipsis">
                  <Link style={{ color: 'inherit' }} href={`/?igdbId=${data.igdbId}`}>{data.name}</Link>
                </h1>
              </div>
              <div className="field items-center flex gap-3">
                <ClockIcon className="size-6" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Total time</span>
                  <span>{data._sum.totalHours} hours {data._count._all > 1 ? `(${data._count._all})` : ''}</span>
                </div>
              </div>
              <div className="field items-center flex gap-3">
                <CalendarIcon className="size-6" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Last time played</span>
                  <DateField format="medium" value={data._max.finishedOn || data._max.updatedAt} defaultValue="Unknown" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
