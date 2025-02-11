import { useForm } from '../../hooks/forms'
import { Button, Checkbox, DatePicker, Input, Select, SelectItem, Slider, Textarea } from '@nextui-org/react'
import { ZonedDateTime, parseAbsoluteToLocal } from '@internationalized/date'
import RatingInput from '../common/rating-input'

export type GameplayData = {
  gameplayType: string,
  status: string,
  startedOn: string | Date,
  finishedOn?: string | Date | null,
  totalHours: number | null,
  progress: number,
  achievementsTotal?: number,
  achievementsUnlocked?: number,
  comment?: string | null,
  rating?: number | null,
  emulated?: boolean | null
}

const defaults: GameplayData = {
  gameplayType: 'main',
  status: 'ongoing',
  startedOn: new Date().toISOString(),
  finishedOn: '',
  totalHours: 0,
  progress: 0,
  achievementsTotal: 0,
  achievementsUnlocked: 0,
  comment: '',
  rating: 0,
  emulated: false
}

export default function GameForm ({
  pending,
  initialData = {},
  onSubmit
}: {
  pending?: boolean,
  initialData?: Partial<GameplayData>,
  onSubmit?: (data: GameplayData) => void
}) {
  const { data, setData, handleChange, handleSubmit } = useForm<GameplayData>({ defaults, initialData, onSubmit })

  function handleDate (field: 'startedOn'|'finishedOn', value: ZonedDateTime) {
    setData({ ...data, [field]: new Date(value.toDate()).toISOString() })
  }
  function handleNumber (field: 'rating'|'progress', value: number) {
    setData({ ...data, [field]: value })
  }
  function handleBoolean (field: 'emulated', value: boolean) {
    setData({ ...data, [field]: value })
  }

  return (
    <form className="grid gap-2 relative" onSubmit={handleSubmit}>
      <Select
        label="Gameplay type"
        name="gameplayType"
        selectedKeys={[data.gameplayType ?? '']}
        aria-label="gameplay type"
        onChange={handleChange}
        disabled={pending}>
        <SelectItem key="main">Main</SelectItem>
        <SelectItem key="extended">Extended</SelectItem>
        <SelectItem key="completionist">Completionist</SelectItem>
        <SelectItem key="speedrun">Speedrun</SelectItem>
        <SelectItem key="online">Online</SelectItem>
      </Select>

      <DatePicker
        label="Started on"
        name="startedOn"
        granularity="day"
        value={data.startedOn ? parseAbsoluteToLocal(`${data.startedOn}`) : null}
        onChange={value => handleDate('startedOn', value)} />

      <DatePicker
        label="Finished on"
        name="finishedOn"
        granularity="day"
        value={data.finishedOn ? parseAbsoluteToLocal(`${data.finishedOn}`) : null}
        onChange={value => handleDate('finishedOn', value)} />

      <Select
        label="Status"
        name="status"
        selectedKeys={[data.status ?? '']}
        aria-label="status"
        onChange={handleChange}
        disabled={pending}>
        <SelectItem key="">Any</SelectItem>
        <SelectItem key="ongoing" className="text-primary">On Going</SelectItem>
        <SelectItem key="pending">Pending</SelectItem>
        <SelectItem key="finished" className="text-success">Finished</SelectItem>
        <SelectItem key="abandoned" className="text-danger">Abandoned</SelectItem>
      </Select>

      <div className="flex items-end">
        <Input
          type="number"
          label="Unlocked"
          placeholder="0"
          pattern="[0-9]+"
          name="achievementsUnlocked"
          value={`${data.achievementsUnlocked || '0'}`}
          onChange={handleChange} />
        <span className="p-2">of</span>
        <Input
          type="number"
          label="Achievements"
          placeholder="12"
          pattern="[0-9]+"
          name="achievementsTotal"
          value={`${data.achievementsTotal || '0'}`}
          onChange={handleChange} />
      </div>

      <Input
        type="number"
        label="Played hours"
        pattern="[0-9]+"
        name="totalHours"
        value={`${data.totalHours || 0}`}
        onChange={handleChange} />

      <Slider
        label="Completion progress"
        className="my-4"
        name="progress"
        getValue={(progress) => `${progress}%`}
        step={1}
        minValue={0}
        maxValue={100}
        value={data.progress}
        onChange={value => handleNumber('progress', Array.isArray(value) ? value[0] : value)} />

      <div className="flex flex-col items-center gap-2">
        <Textarea
          placeholder="Enter your comments about game..."
          name="comment"
          value={data.comment ?? ''}
          onChange={handleChange} />
        <div className="react-stars">
          <RatingInput
            color="warning"
            size={8}
            value={data.rating}
            onChange={(value: number) => handleNumber('rating', value)} />
        </div>
      </div>
      <div className="flex flex-row gap-2 py-2 justify-between">
        <Checkbox
          defaultSelected={data.emulated ?? false}
          onValueChange={checked => handleBoolean('emulated', checked)}
          aria-label="emulated"
          name="emulated">
          Emulated
        </Checkbox>
        <Button
          aria-label="save"
          type="submit"
          color="primary">
          Save
        </Button>
      </div>
    </form>
  )
}
