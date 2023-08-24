import { useForm } from '../../hooks/forms'
import { ArrowPathIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { Platform } from '@prisma/client'

type SearchData = {
  q?: string,
  status?: string,
  platformId?: number | string,
  genre?: string,
  order_by?: string
}

const defaults: SearchData = {
  q: '',
  status: '',
  platformId: '',
  genre: '',
  order_by: 'startedOn'
}

export default function SearchForm ({
  className = '',
  platforms = [],
  genres = [],
  pending,
  initialData,
  onSubmit
}: {
  className?: string,
  pending?: boolean,
  initialData?: SearchData,
  platforms?: Platform[],
  genres?: string[],
  onSubmit?: Function
}) {
  const { data, handleChange, handleSubmit } = useForm<SearchData>({ defaults, initialData, onSubmit })
  return (
    <form onSubmit={handleSubmit} className={`grid grid-cols-2 md:grid-cols-6 gap-x-2 gap-y-4 ${className}`}>
      <div className="field">
        <label htmlFor="platformId">Platform</label>
        <select
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

      <div className="field">
        <label htmlFor="genre">Genre</label>
        <select
          name="genre"
          value={data.genre}
          aria-label="genre"
          onChange={handleChange}
          disabled={pending}>
          <option value="">Any</option>
          {genres.map((genre, index) =>
            <option key={index}>
              {genre}
            </option>
          )}
        </select>
      </div>

      <div className="field">
        <label htmlFor="status">Status</label>
        <select
          name="status"
          value={data.status}
          aria-label="status"
          onChange={handleChange}
          disabled={pending}>
          <option value="">Any</option>
          <option value="finished">Finished</option>
          <option value="pending">Pending</option>
          <option value="ongoing">On Going</option>
          <option value="abandoned">Abandoned</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="order_by">Order by</label>
        <select
          name="order_by"
          value={data.order_by}
          aria-label="order by"
          onChange={handleChange}
          disabled={pending}>
          <option value="startedOn">Started on</option>
          <option value="name">Name</option>
          <option value="releaseDate">Release date</option>
          <option value="totalHours">Total time</option>
        </select>
      </div>

      <div className="col-start-1 row-start-1 col-span-full md:col-span-2 md:col-start-5 flex items-end gap-3">
        <input
          className="flex-grow"
          type="text"
          name="q"
          value={data.q}
          aria-label="search"
          placeholder="Search games..."
          onChange={handleChange}
          disabled={pending} />
        <button className="group inline-flex items-center justify-center rounded-full p-2 text-sm" type="submit" disabled={pending} aria-label="search">
          {pending
            ? <ArrowPathIcon className="w-6 h-6 animate-spin" />
            : <MagnifyingGlassIcon className="w-6 h-6" />
          }
        </button>
      </div>
    </form>
  )
}
