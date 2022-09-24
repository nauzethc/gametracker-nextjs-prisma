import { useForm } from '../../hooks/forms'
import { RefreshIcon, SearchIcon } from '@heroicons/react/solid'

type SearchData = {
  q: string
}

const defaults: SearchData = {
  q: ''
}

export default function SearchForm ({
  className = '',
  pending,
  initialData,
  onSubmit
}: {
  className?: string,
  pending?: boolean,
  initialData?: SearchData,
  onSubmit?: Function
}) {
  const { data, handleChange, handleSubmit } = useForm<SearchData>({ defaults, initialData, onSubmit })
  return (
    <form onSubmit={handleSubmit} className={`flex items-center gap-2 ${className}`}>
      <input
        className="flex-grow"
        type="text"
        name="q"
        value={data.q}
        aria-label="search"
        placeholder="Search games..."
        onChange={handleChange}
        disabled={pending}
        required />
      <button className="h-10 w-10 p-2" type="submit" disabled={pending}>
        {pending
          ? <RefreshIcon className="w-6 h-6 animate-spin" />
          : <SearchIcon className="w-6 h-6" />
        }
      </button>
    </form>
  )
}
