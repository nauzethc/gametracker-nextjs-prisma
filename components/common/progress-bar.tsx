import { Progress } from '@nextui-org/react'

type ProgresColor = 'success' | 'danger' | 'default' | 'primary' | 'secondary' | 'warning' | undefined

function clamp (min: number, max: number, value: number) {
  return Math.min(Math.max(min, value), max)
}

function getColor (value?: string): ProgresColor {
  switch (value) {
    case 'finished':
      return 'success'
    case 'abandoned':
      return 'danger'
    case 'pending':
      return 'default'
    case 'ongoing':
    default:
      return 'primary'
  }
}

export default function ProgressBar ({
  className = '',
  max = 100,
  min = 0,
  value,
  status
}: {
  className?: string,
  max?: number,
  min?: number,
  value: number,
  status?: string,
  children?: any
}) {
  const percent = clamp(min, max, value) * 100 / max
  return <Progress className={className} value={percent} color={getColor(status)} />
}
