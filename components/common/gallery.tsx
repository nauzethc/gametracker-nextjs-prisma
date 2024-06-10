import { Button, Image, Modal, ModalContent } from '@nextui-org/react'
import Link from 'next/link'
import NextImage from 'next/image'
import { useRouter } from 'next/router'
import { getImageURL } from '../../utils/igdb'
import { MouseEvent, useState, useEffect } from 'react'
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/solid'

function getPhotoId (url: string): string | undefined {
  return url.split('/').pop()?.replace('.jpg', '')
}

export default function Gallery ({ images = [] }: { images?: string[] }) {
  const router = useRouter()
  const [photoId, setPhotoId] = useState('')
  const [index, setIndex] = useState(-1)

  function handleImageClick (event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    const photoId = event.currentTarget.dataset.id
    if (photoId) {
      router.replace(
        `/games/${router.query.id}?photoId=${photoId}`,
        undefined,
        { shallow: true }
      )
    }
  }

  function handleImageChange (step = 1) {
    let newIndex
    // Next
    if (step > 0) {
      if (index + step < images.length) {
        newIndex = index + step
      } else {
        newIndex = 0
      }
    } else {
      if (index + step >= 0) {
        newIndex = index + step
      } else {
        newIndex = images.length - 1
      }
    }
    const newPhotoId = getPhotoId(images[newIndex])
    router.replace(`/games/${router.query.id}?photoId=${newPhotoId}`, undefined, { shallow: true })
  }

  function handleClose () {
    router.replace(`/games/${router.query.id}`, undefined, { shallow: true })
  }

  useEffect(() => {
    const { photoId } = router.query
    setPhotoId(photoId ? `${photoId}` : '')
  }, [router.query])

  useEffect(() => {
    setIndex(images.findIndex(url => getPhotoId(url) === photoId))
  }, [images, photoId])

  return (
    <>
    {images.map(
      (url, index) => url !== undefined
        ? <Link
            key={index}
            data-id={getPhotoId(url)}
            href={`/games/${router.query.id}?photoId=${getPhotoId(url)}`}
            onClick={handleImageClick}>
            <Image
              radius="none"
              as={NextImage}
              width={569}
              height={320}
              isZoomed
              src={url.replace('t_screenshot_big', 't_screenshot_med')}
              alt={`Screenshot ${index + 1}`} />
          </Link>
        : null
    )}
      <Modal isOpen={Boolean(photoId)} onClose={handleClose} size="5xl" backdrop="blur">
        <ModalContent className="relative">
          <Image
            removeWrapper
            src={getImageURL(`${photoId}`, '1080p')}
            alt="Screenshot" />
          <div className="absolute z-10 inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition">
            <Button
              aria-label="previous"
              isIconOnly
              radius="full"
              onClick={() => handleImageChange(-1)}>
              <ArrowLeftIcon className="size-5" />
            </Button>
            <Button
              aria-label="next"
              isIconOnly
              radius="full"
              onClick={() => handleImageChange()}>
              <ArrowRightIcon className="size-5" />
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </>
  )
}
