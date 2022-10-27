import { useForm } from '../../hooks/forms'
import { ArrowPathIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { IGDBPlatform } from '../../types/igdb'

type SearchData = {
  q: string,
  platformId?: number | string
}

const defaults: SearchData = {
  q: '',
  platformId: ''
}

export default function SearchForm ({
  className = '',
  platforms = [],
  pending,
  initialData,
  onSubmit
}: {
  className?: string,
  platforms?: IGDBPlatform[],
  pending?: boolean,
  initialData?: SearchData,
  onSubmit?: Function
}) {
  const { data, handleChange, handleSubmit } = useForm<SearchData>({ defaults, initialData, onSubmit })
  return (
    <form onSubmit={handleSubmit} className={`grid grid-cols-3 gap-2 ${className}`}>
      <div className="field col-span-full md:col-span-1">
        <label htmlFor="platformId">Platform</label>
        <select
          className="flex-shrink"
          name="platformId"
          value={data.platformId}
          aria-label="platform"
          onChange={handleChange}
          disabled={pending}>
          <option value="">Any</option>
          {platforms.map(platform =>
            <option key={platform.igdbId} value={platform.igdbId}>
              {platform.name}
            </option>
          )}
        </select>
      </div>
      <div className="col-span-full md:col-span-2 flex items-end gap-2">
        <input
          className="w-full"
          type="text"
          name="q"
          value={data.q}
          aria-label="search"
          placeholder="Search games..."
          onChange={handleChange}
          disabled={pending}
          required />
          <button className="h-10 w-10 p-2" type="submit" disabled={pending} aria-label="search">
            {pending
              ? <ArrowPathIcon className="w-6 h-6 animate-spin" />
              : <MagnifyingGlassIcon className="w-6 h-6" />
            }
          </button>
      </div>
    </form>
  )
}
