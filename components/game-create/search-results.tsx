import { PlusCircleIcon } from '@heroicons/react/solid'
import { IGDBGame, IGDBPlatform, IGDBSearch, IGDBGameSelected } from '../../types/igdb'
import Cover from '../common/cover'

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
      <button
        key={p.igdbId}
        className="text-sm font-semibold gap-1 px-2 py-1 rounded-full"
        onClick={() => onSelect(p)}
        aria-label={p.name}>
        <PlusCircleIcon className="w-5 h-5" />
        <span>{p.abbreviation ?? p.name}</span>
      </button>
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
  return (
    <div className="flex gap-4">
      <div className="w-24 flex-shrink-0">
        <Cover src={data.cover} alt={data.name} />
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
        <div className="col-span-full flex flex-wrap items-center gap-2 my-2">
          <Platforms data={data.platforms} onSelect={handleSelect} />
        </div>
      </div>
    </div>
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
