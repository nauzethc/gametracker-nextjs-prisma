import { useForm } from '../../hooks/forms'
import { ArrowPathIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { Select, SelectItem, Button } from '@nextui-org/react'
import DatePicker from '../common/date-picker'
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
  const { data, setData, handleChange, handleSubmit } = useForm<SearchData>({ defaults, initialData, onSubmit })
  function handleDate (field: 'from'|'to', value: string) {
    setData({ ...data, [field]: value })
  }
  return (
    <form onSubmit={handleSubmit} className={`grid grid-cols-2 gap-2 items-center md:flex ${className}`}>
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
        label="Period"
        name="period"
        selectedKeys={[data.period ?? '']}
        aria-label="period"
        onChange={handleChange}
        disabled={pending}>
        <SelectItem key="all">All</SelectItem>
        <SelectItem key="year">Last year</SelectItem>
        <SelectItem key="semester">Last 6 months</SelectItem>
        <SelectItem key="custom">Custom</SelectItem>
      </Select>

      <DatePicker
        className={data.period === 'custom' ? 'block' : 'hidden'}
        label="From"
        name="from"
        isRequired={data.period === 'custom'}
        value={data.from}
        onChange={value => handleDate('from', value)} />

      <DatePicker
        className={data.period === 'custom' ? 'block' : 'hidden'}
        label="To"
        name="to"
        isRequired={data.period === 'custom'}
        value={data.to}
        onChange={value => handleDate('to', value)} />

      <div className="col-span-full flex items-center justify-end">
        <Button className="self-center" color="primary" type="submit" isIconOnly radius="full">
          {pending
            ? <ArrowPathIcon className="size-6 animate-spin" />
            : <MagnifyingGlassIcon className="size-6" />
          }
        </Button>
      </div>
    </form>
  )
}
