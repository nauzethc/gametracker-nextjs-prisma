import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'

type CarouselProps = {
  className?: string,
  images: string[],
  alt?: string
}

const SCREEN_MED = [569, 320]

export default function Carousel ({ className = '', images, alt }: CarouselProps) {
  return (
    <Swiper
      className={`carousel ${className}`}
      autoHeight={true}
      slidesPerView="auto"
      pagination={{ dynamicBullets: true }}
      loop={true}
      modules={[Pagination]}>
      {images.map((url, index) =>
        <SwiperSlide key={index} style={{
          width: `${SCREEN_MED[0]}px`,
          maxHeight: `${SCREEN_MED[1]}px`,
          maxWidth: '100%',
          aspectRatio: SCREEN_MED[0] / SCREEN_MED[1]
        }}>
          <Image
            alt={alt}
            src={url.replace('t_screenshot_big', 't_screenshot_med')}
            width={SCREEN_MED[0]}
            height={SCREEN_MED[1]} />
        </SwiperSlide>
      )}
    </Swiper>
  )
}
