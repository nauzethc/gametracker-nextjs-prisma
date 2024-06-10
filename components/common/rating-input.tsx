import Rating from 'react-rating'
import { StarIcon } from '@heroicons/react/24/solid'

type RatingInputProps = {
  color?: 'default'|'primary'|'danger'|'success'|'warning'|'secondary'
  size?: number
  value?: number | null
  onChange?: (value: number) => void
}

export default function RatingInput ({ color = 'default', size = 5, value, onChange }: RatingInputProps) {
  return (
    <div className={`text-${color}`}>
      <Rating
        start={0}
        stop={5}
        step={1}
        fractions={2}
        initialRating={value || 0}
        emptySymbol={<StarIcon className={`w-${size} h-${size} opacity-30`} />}
        fullSymbol={<StarIcon className={`w-${size} h-${size}`} />}
        onChange={onChange} />
    </div>
  )
}
