function clamp (min: number, max: number, value: number) {
  return Math.min(Math.max(min, value), max)
}

export default function ProgressBar ({
  className = '',
  max = 100,
  min = 0,
  value,
  children
}: {
  className?: string,
  max?: number,
  min?: number,
  value: number,
  children?: any
}) {
  const percent = clamp(min, max, value) * 100 / max
  return (
    <div className={`progress-bar relative h-6 rounded-lg w-full ${className}`}>
      <div className="fill-bar absolute h-6 rounded-lg flex items-center" style={{ width: `${percent}%` }}>
        {children}
      </div>
    </div>
  )
}
