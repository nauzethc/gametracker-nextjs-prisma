import { Image, Modal, ModalContent } from '@nextui-org/react'
import Link from 'next/link'
import NextImage from 'next/image'
import { useRouter } from 'next/router'
import { getImageURL } from '../../utils/igdb'
import { MouseEvent, useState, useMemo } from 'react'
import GalleryControls from './gallery-controls'

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
    let newIndex = index + step
    if (newIndex < 0) {
      newIndex = images.length - 1
    } else if (newIndex >= images.length) {
      newIndex = 0
    }
    const newPhotoId = getPhotoId(images[newIndex])
    router.replace(`/games/${router.query.id}?photoId=${newPhotoId}`, undefined, { shallow: true })
  }

  function handleClose () {
    router.replace(`/games/${router.query.id}`, undefined, { shallow: true })
  }

  useMemo(() => {
    const { photoId } = router.query
    setPhotoId(photoId ? `${photoId}` : '')
    setIndex(images.findIndex(url => getPhotoId(url) === photoId))
  }, [router.query, images])

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
      <Modal
        isOpen={Boolean(photoId)}
        placement="center"
        onClose={handleClose}
        size="5xl"
        backdrop="blur">
        <ModalContent className="relative">
          <Image
            removeWrapper
            src={getImageURL(`${photoId}`, '1080p')}
            alt="Screenshot" />
          <GalleryControls
            className="absolute z-10 inset-0"
            onPrevious={() => handleImageChange(-1)}
            onNext={() => handleImageChange(1)}>
          </GalleryControls>
        </ModalContent>
      </Modal>
    </>
  )
}
