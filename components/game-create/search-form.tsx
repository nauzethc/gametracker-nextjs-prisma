import { useForm } from '../../hooks/forms'
import { ArrowPathIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { IGDBPlatform } from '../../types/igdb'
import { Button, Input, Select, SelectItem, SelectSection } from '@nextui-org/react'

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
    <form onSubmit={handleSubmit} className={`grid gap-2 grid-cols-3 ${className}`}>
      <Select
        label="Platform"
        name="platformId"
        selectedKeys={[data.platformId ?? '']}
        aria-label="platform"
        onChange={handleChange}
        disabled={pending}>
        <SelectItem key="">Any</SelectItem>
        <SelectSection>
          {platforms.map(p => <SelectItem key={p.igdbId}>{p.name}</SelectItem>)}
        </SelectSection>
      </Select>
      <div className="relative col-span-2">
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
