import { PlusCircleIcon } from '@heroicons/react/20/solid'
import { IGDBGame, IGDBPlatform, IGDBSearch, IGDBGameSelected } from '../../types/igdb'
import { Image, Button, Card, CardFooter, CardBody } from '@nextui-org/react'
import { useImageColors } from '../../hooks/color'
import CardBackground from '../common/card-background'

type SearchResultsProps = {
  results: IGDBSearch|null,
  onSelect?: (data: IGDBGameSelected) => void
}
type ResultProps = {
  data: IGDBGame,
  onSelect?: (data: IGDBGameSelected) => void
}
type PlatformsProps = {
  data: IGDBPlatform[],
  onSelect: (data: IGDBPlatform) => void
}

function Platforms ({ data, onSelect }: PlatformsProps) {
  return (
    <>
      {data.map(p =>
      <Button
        key={p.igdbId}
        color="primary"
        radius="full"
        size="sm"
        onClick={() => onSelect(p)}
        aria-label={p.name}>
        <PlusCircleIcon className="w-4 h-4" />
        <span className="font-semibold">{p.abbreviation ?? p.name}</span>
      </Button>
      )}
    </>
  )
}

function Result ({ data, onSelect }: ResultProps) {
  const handleSelect = (platform: IGDBPlatform) => {
    const { platforms, ...game } = data
    if (typeof onSelect === 'function') {
      onSelect({ ...game, platform })
    }
  }
  const { color, background } = useImageColors(data.cover)
  return (
    <Card className="relative transition-colors duration-1000" style={{ color }}>
      <CardBackground color={background} />
      <CardBody>
        <div className="flex items-start gap-4">
          <div className="w-24 flex-shrink-0">
            <Image src={data.cover} alt={data.name} />
          </div>
          <div className="flex-grow grid place-content-start gap-1">
            <h1 className="text-lg font-semibold leading-6 col-span-full">{data.name}</h1>
            <div className="flex flex-col">
              <span className="text-sm opacity-70 font-semibold">Developers</span>
              <span className="text-sm sm:text-base">{data.developers.join(', ')}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm opacity-70 font-semibold">Publishers</span>
              <span className="text-sm sm:text-base">{data.publishers.join(', ')}</span>
            </div>
          </div>
        </div>
      </CardBody>
      <CardFooter className="bg-default/20 flex flex-wrap items-center justify-end gap-2 z-10">
        <Platforms data={data.platforms} onSelect={handleSelect} />
      </CardFooter>
    </Card>
  )
}

export default function SearchResults ({ results, onSelect }: SearchResultsProps) {
  return (
    <>
      {results !== null && Array.isArray(results?.data)
        ? results?.data.map(data =>
          <Result key={data.igdbId} data={data} onSelect={onSelect} />
        )
        : null
      }
    </>
  )
}
