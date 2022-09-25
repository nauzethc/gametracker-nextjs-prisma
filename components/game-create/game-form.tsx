import { useForm } from '../../hooks/forms'

// @ts-ignore
import ReactStars from 'react-rating-stars-component'

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
  rating?: number | null
}

const defaults: GameplayData = {
  gameplayType: 'main',
  status: 'pending',
  startedOn: new Date().toISOString().slice(0, 10),
  finishedOn: '',
  totalHours: 0,
  progress: 0,
  achievementsTotal: 0,
  achievementsUnlocked: 0,
  comment: '',
  rating: 0
}

function toDateString (date?: string | Date | null): string {
  return date !== null
    ? (date instanceof Date ? date.toISOString() : date ?? '').slice(0, 10)
    : ''
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
  const handleRating = (rating: number) => setData({ ...data, rating })

  return (
    <form className="grid-form" onSubmit={handleSubmit}>
      <div className="form-control">
        <label htmlFor="gameplayType">Gameplay</label>
        <select name="gameplayType" value={data.gameplayType} onChange={handleChange}>
          <option value="main">Main</option>
          <option value="extended">Extended</option>
          <option value="completionist">Completionist</option>
          <option value="speedrun">Speedrun</option>
        </select>
      </div>

      <div className="form-control">
        <label htmlFor="startedOn">Started</label>
        <input
          type="date"
          name="startedOn"
          value={toDateString(data.startedOn)}
          onChange={handleChange} />
      </div>

      <div className="form-control">
        <label htmlFor="finishedOn">Finished</label>
        <input
          type="date"
          name="finishedOn"
          value={toDateString(data.finishedOn)}
          onChange={handleChange} />
      </div>

      <div className="form-control">
        <label htmlFor="status">Status</label>
        <select
          name="status"
          value={data.status}
          onChange={handleChange}>
          <option value="pending">Pending</option>
          <option value="finished">Finished</option>
          <option value="abandoned">Abandoned</option>
        </select>
      </div>

      <div className="form-control">
        <label htmlFor="achievementsTotal">Achievements</label>
        <div className="flex items-center">
          <input
            className="input input-bordered flex-grow flex-shrink w-full"
            pattern="[0-9]+"
            type="text"
            placeholder="0"
            name="achievementsUnlocked"
            value={data.achievementsUnlocked ?? 0}
            onChange={handleChange} />
          <span className="px-2">of</span>
          <input
            className="input input-bordered flex-grow flex-shrink w-full"
            pattern="[0-9]+"
            type="text"
            placeholder="total"
            name="achievementsTotal"
            value={data.achievementsTotal ?? 0}
            onChange={handleChange} />
        </div>
      </div>

      <div className="form-control">
        <label htmlFor="totalHours">Hours</label>
        <input
          type="text"
          pattern="[0-9]+"
          name="totalHours"
          value={data.totalHours ?? 0}
          onChange={handleChange} />
      </div>

      <div className="form-control col-span-full">
        <label htmlFor="progress">Progress ({data.progress}%)</label>
        <input
          className="w-full mt-2"
          type="range"
          min="0"
          max="100"
          step="1"
          name="progress"
          value={data.progress ?? 0}
          onChange={handleChange} />
      </div>

      <div className="form-control col-span-full">
        <label htmlFor="comment">Rating</label>
        <textarea
          name="comment"
          rows={4}
          value={data.comment ?? ''}
          onChange={handleChange} />
        <div className="flex justify-center h-12">
          <ReactStars count={5} isHalf={true} size={32}
            onChange={handleRating}
            value={data.rating} />
        </div>
      </div>

      <div className="modal-action col-span-full flex justify-center">
        <button className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm w-full sm:w-64"
          disabled={pending}
          type="submit">Save</button>
      </div>
    </form>
  )
}
