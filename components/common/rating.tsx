import { StarIcon } from '@heroicons/react/24/solid'
import { useId } from 'react'

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
  const maskId = useId()
  const fillStars = Math.floor(value)
  const emptyStars = Math.floor(max - value)
  const hasHalf = Math.ceil(max - value) - Math.floor(max - value)
  return (
    <div className={`rating flex items-center ${className}`}>
      {[...new Array(fillStars)].map((_, index) => <StarIcon className={`size-${size}`} key={index} />)}
      {hasHalf
        ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-${size}`}>
            <mask id={maskId}>
              <polygon fill="#ffffff" points="0,0 0,24 12,24 12,0"></polygon>
              <polygon fill="rgba(255,255,255,0.3)" points="12,0 12,24 24,24 24,0"></polygon>
            </mask>
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
              clipRule="evenodd"
              mask={`url(#${maskId})`} />
          </svg>
        : null
      }
      {[...new Array(emptyStars)].map((_, index) => <StarIcon className={`size-${size} opacity-30`} key={index} />)}
    </div>
  )
}
