type CardBackgroundProps = {
  className?: string
  color?: string
}

export default function CardBackground ({ className = '', color }: CardBackgroundProps) {
  return (
    <div
      className={`absolute inset-0 fade-in ${className}`}
      style={{ background: color }} />
  )
}
