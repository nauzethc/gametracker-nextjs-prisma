import { useForm } from '../../hooks/forms'
import { RefreshIcon, SearchIcon } from '@heroicons/react/solid'
import { Platform } from '@prisma/client'

type SearchData = {
  q?: string,
  status?: string,
  platformId?: number | string,
  order_by?: string
}

const defaults: SearchData = {
  q: '',
  status: '',
  platformId: '',
  order_by: 'startedOn'
}

export default function SearchForm ({
  className = '',
  platforms = [],
  pending,
  initialData,
  onSubmit
}: {
  className?: string,
  pending?: boolean,
  initialData?: SearchData,
  platforms?: Platform[]
  onSubmit?: Function
}) {
  const { data, handleChange, handleSubmit } = useForm<SearchData>({ defaults, initialData, onSubmit })
  return (
    <form onSubmit={handleSubmit} className={`grid grid-cols-3 md:grid-cols-5 gap-2 ${className}`}>
      <div className="field">
        <label htmlFor="status">Platform</label>
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

      <div className="col-span-full md:col-span-2 flex items-end gap-2">
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
            ? <RefreshIcon className="w-6 h-6 animate-spin" />
            : <SearchIcon className="w-6 h-6" />
          }
        </button>
      </div>
    </form>
  )
}
