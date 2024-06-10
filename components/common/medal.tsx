type MedalProps = {
  className?: string
  ranking: number,
  size?: number
}

export default function Medal ({ className = '', ranking, size = 8 }: MedalProps) {
  return (
    <div className={`medal medal-${ranking} size-${size} ${className}`}>
      <span className="inner">{ranking}</span>
    </div>
  )
}
