import { useForm } from '../../hooks/forms'
import { ArrowPathIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { Platform } from '@prisma/client'

type SearchData = {
  period?: string,
  platformId?: string | number,
  from?: string,
  to?: string
}

const defaults: SearchData = {
  period: 'year',
  platformId: ''
}

function toDateString (date?: string | Date | null): string {
  return date !== null
    ? (date instanceof Date ? date.toISOString() : date ?? '').slice(0, 10)
    : ''
}

export default function SearchForm ({
  className = '',
  platforms = [],
  pending,
  initialData,
  onSubmit
}: {
  className?: string,
  platforms?: Platform[],
  pending?: boolean,
  initialData?: SearchData,
  onSubmit?: Function
}) {
  const { data, handleChange, handleSubmit } = useForm<SearchData>({ defaults, initialData, onSubmit })
  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-y-8 gap-x-4 items-end md:flex">
      <div className="field w-full">
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

      <div className="field w-full">
        <label htmlFor="period">Period</label>
        <select
          name="period"
          value={data.period}
          aria-label="period"
          onChange={handleChange}
          disabled={pending}>
          <option value="all">All</option>
          <option value="year">Last year</option>
          <option value="semester">Last 6 months</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div className={`field w-full ${data.period === 'custom' ? 'block' : 'hidden'}`}>
        <label htmlFor="from">From</label>
        <input
          type="date"
          name="from"
          value={toDateString(data.from)}
          onChange={handleChange}
          required={data.period === 'custom'} />
      </div>

      <div className={`field w-full ${data.period === 'custom' ? 'block' : 'hidden'}`}>
        <label htmlFor="to">To</label>
        <input
          type="date"
          name="to"
          value={toDateString(data.to)}
          onChange={handleChange}
          required={data.period === 'custom'} />
      </div>

      <div className="col-span-full flex justify-end">
        <button className="h-10 md:w-10 px-4 md:p-2" type="submit" disabled={pending} aria-label="search">
          {pending
            ? <ArrowPathIcon className="w-6 h-6 animate-spin" />
            : <MagnifyingGlassIcon className="w-6 h-6" />
          }
          <span className="text-sm md:hidden">Search</span>
        </button>
      </div>
    </form>
  )
}
