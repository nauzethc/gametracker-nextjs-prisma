import Image from 'next/image'

const COVER = [264, 374]

export default function Cover ({ className = '', src, alt } : { className?: string, src?: string, alt?: string }) {
  return (
    <figure className={`cover ${className}`}>
      {src
        ? <Image className="rounded" src={src} alt={alt} width={COVER[0]} height={COVER[1]} />
        : <div className="placeholder rounded" style={{ width: COVER[0], maxWidth: '100%', aspectRatio: `${COVER[0] / COVER[1]}` }} />
      }
    </figure>
  )
}
