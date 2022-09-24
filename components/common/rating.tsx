import { StarIcon } from '@heroicons/react/solid'
import { StarIcon as EmptyStarIcon } from '@heroicons/react/outline'

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
      {hasHalf
        ? <div className={`relative w-${size} h-${size}`}>
          <span className={`h-${size} absolute overflow-hidden`} style={{ width: '50%' }}>
            <StarIcon className={`w-${size} h-${size}`} />
          </span>
          <EmptyStarIcon className={`absolute w-${size} h-${size}`} />
        </div>
        : null
      }
      {[...new Array(emptyStars)].map((_, index) => <EmptyStarIcon className={`w-${size} h-${size}`} key={index} />)}
    </div>
  )
}
