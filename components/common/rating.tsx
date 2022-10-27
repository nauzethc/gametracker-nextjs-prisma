import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as EmptyStarIcon } from '@heroicons/react/24/outline'
import { HalfStarIcon } from './icons'

export default function Rating ({
  className = '',
  value = 0,
  max = 5,
  size = 6
}: {
  className?: string,
  value: number,
  max?: number,
  size?: number
}) {
  const fillStars = Math.floor(value)
  const emptyStars = Math.floor(max - value)
  const hasHalf = Math.ceil(max - value) - Math.floor(max - value)
  return (
    <div className={`rating flex items-center ${className}`}>
      {[...new Array(fillStars)].map((_, index) => <StarIcon className={`w-${size} h-${size}`} key={index} />)}
      {hasHalf ? <HalfStarIcon className={`w-${size} h-${size}`} /> : null}
      {[...new Array(emptyStars)].map((_, index) => <EmptyStarIcon className={`w-${size} h-${size}`} key={index} />)}
    </div>
  )
}
