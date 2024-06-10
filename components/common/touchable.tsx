import { ReactNode, TouchEvent, useState } from 'react'

type TouchableProps = {
  className?: string
  children?: ReactNode,
  onSwipeLeft?: Function,
  onSwipeRight?: Function
}

export default function Touchable ({
  className = '',
  onSwipeRight,
  onSwipeLeft,
  children
}: TouchableProps) {
  const [lastX, setLastX] = useState(0)
  const [direction, setDirection] = useState(0)

  function handleTouchMove (event: TouchEvent<HTMLDivElement>) {
    const currentX = event.touches[0].clientX
    setDirection(currentX - lastX)
    setLastX(currentX)
  }
  function handleTouchEnd (event: TouchEvent<HTMLDivElement>) {
    if (direction > 0 && onSwipeRight) {
      onSwipeRight()
    }
    if (direction < 0 && onSwipeLeft) {
      onSwipeLeft()
    }
  }

  return (
    <div className={`bg-red-500/50 ${className}`}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}>
      {children}
    </div>
  )
}
