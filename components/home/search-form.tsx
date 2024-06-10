import { useForm } from '../../hooks/forms'
import { ArrowPathIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
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
      <Select
        label="Platform"
        name="platformId"
        selectedKeys={[data.platformId ?? '']}
        aria-label="platform"
        onChange={handleChange}
        disabled={pending}>
        <SelectItem key="">Any</SelectItem>
        {platforms.map(p => <SelectItem key={p.igdbId}>{p.name}</SelectItem>)}
      </Select>
      <Select
        label="Genre"
        name="genre"
        selectedKeys={[data.genre ?? '']}
        aria-label="genre"
        onChange={handleChange}
        disabled={pending}>
        <SelectItem key="">Any</SelectItem>
        {genres.map(genre => <SelectItem key={genre}>{genre}</SelectItem>)}
      </Select>
      <Select
        label="Status"
        name="status"
        selectedKeys={[data.status ?? '']}
        aria-label="status"
        onChange={handleChange}
        disabled={pending}>
        <SelectItem key="">Any</SelectItem>
        <SelectItem key="finished">Finished</SelectItem>
        <SelectItem key="pending">Pending</SelectItem>
        <SelectItem key="ongoing">On Going</SelectItem>
        <SelectItem key="abandoned">Abandoned</SelectItem>
      </Select>
      <Select
        label="Order by"
        name="order_by"
        selectedKeys={[data.order_by ?? '']}
        aria-label="order_by"
        onChange={handleChange}
        disabled={pending}>
        <SelectItem key="startedOn">Started on</SelectItem>
        <SelectItem key="name">Name</SelectItem>
        <SelectItem key="releaseDate">Release date</SelectItem>
        <SelectItem key="totalHours">Total time</SelectItem>
      </Select>
      <div className="col-start-1 row-start-1 col-span-full md:col-span-2 md:col-start-5 flex items-center gap-2 relative">
        <Input
          color="primary"
          name="q"
          label="Name"
          value={data.q}
          aria-label="search"
          placeholder="i.e.: 'zelda'"
          onChange={handleChange}
          disabled={pending}
          endContent={
            <Button className="self-center" color="primary" variant="light" type="submit" isIconOnly radius="full">
              {pending
                ? <ArrowPathIcon className="size-6 animate-spin" />
                : <MagnifyingGlassIcon className="size-6" />
              }
            </Button>
          } />
      </div>
    </form>
  )
}
