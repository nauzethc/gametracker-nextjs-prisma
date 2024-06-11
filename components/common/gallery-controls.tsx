import { useState, TouchEvent, useEffect } from 'react'
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/solid'
import { Button } from '@nextui-org/react'

type GalleryControlsProps = {
  className?: string
  onNext?: Function,
  onPrevious?: Function
}

export default function GalleryControls ({
  className = '',
  onNext,
  onPrevious
}: GalleryControlsProps) {
  const [lastX, setLastX] = useState(0)
  const [direction, setDirection] = useState(0)

  const handleNext = () => onNext && onNext()
  const handlePrevious = () => onPrevious && onPrevious()

  function handleTouchMove (event: TouchEvent<HTMLDivElement>) {
    const currentX = event.touches[0].clientX
    setDirection(currentX - lastX)
    setLastX(currentX)
  }

  function handleTouchEnd (event: TouchEvent<HTMLDivElement>) {
    if (direction < 0) handleNext()
    if (direction > 0) handlePrevious()
    setLastX(0)
    setDirection(0)
  }

  function handleKeyDown (event: globalThis.KeyboardEvent) {
    if (event.key === 'ArrowLeft') handlePrevious()
    if (event.key === 'ArrowRight') handleNext()
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  })

  return (
    <div className={`flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition ${className}`} tabIndex={0}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}>
        <Button
          aria-label="previous"
          isIconOnly
          radius="full"
          variant="flat"
          onClick={handlePrevious}>
          <ArrowLeftIcon className="size-5" />
        </Button>
        <Button
          aria-label="next"
          isIconOnly
          radius="full"
          variant="flat"
          onClick={handleNext}>
          <ArrowRightIcon className="size-5" />
        </Button>
    </div>
  )
}
