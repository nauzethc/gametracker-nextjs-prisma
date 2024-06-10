import { Image } from '@nextui-org/react'
import { ReactNode, useMemo, useState } from 'react'

type BackgroundProps = {
  className?: string
  title?: string
  screenshots?: string[],
  isBlur?: boolean
  children?: ReactNode
}

function getRandomItem<T> (items?: T[]): T | undefined {
  return Array.isArray(items) && items.length > 0
    ? items[Math.floor(Math.random() * items.length)]
    : undefined
}

export default function Background ({
  className = '',
  title = 'Background',
  screenshots = [],
  isBlur,
  children
}: BackgroundProps) {
  const [background, setBackground] = useState<string|undefined>(undefined)

  useMemo(() => {
    setBackground(getRandomItem(screenshots))
  }, [screenshots])

  return (
    <div className={`background relative ${className}`}>
      <Image
        removeWrapper
        className="object-cover w-full h-full"
        radius="none"
        src={background} alt={title} />
      <div className={`absolute inset-0 z-10 bg-gradient-to-t from-black via-transparent ${isBlur ? 'backdrop-blur' : ''}`}>
        <div className="flex flex-col justify-end h-full text-white">
          {children}
        </div>
      </div>
    </div>
  )
}
