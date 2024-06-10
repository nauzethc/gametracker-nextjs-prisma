import NextImage from 'next/image'
import { Image } from '@nextui-org/react'

const COVER = [264, 374]

export default function Cover ({ className = '', src, alt } : { className?: string, src?: string, alt?: string }) {
  return (
    <Image
      className={`cover ${className}`}
      as={NextImage}
      width={COVER[0]}
      height={COVER[1]}
      src={src}
      alt={alt} />
  )
}
