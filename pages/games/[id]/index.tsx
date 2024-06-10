import { GameUpdate, GameWithPlatform } from '../../../types/games'
import { useEndpoint } from '../../../hooks/http'
import { GetServerSideProps } from 'next'
import { useState } from 'react'
import GameForm, { GameplayData } from '../../../components/game-create/game-form'
import { HeaderPortal } from '../../../components/app/header'
import { TrashIcon } from '@heroicons/react/24/solid'
import { parseGameUpdate } from '../../../utils/games'
import { useRouter } from 'next/router'
import { retrieveGame } from '../../../services/games'
import { findGameById } from '../../../services/igdb'
import { toString } from '../../../utils/url'
import { IGDBGame } from '../../../types/igdb'
import { Button, Modal, ModalContent, ModalBody, ModalFooter, ModalHeader } from '@nextui-org/react'
import GameMenu from '../../../components/game-detail/game-menu'
import Background from '../../../components/game-detail/background'
import GameHeader from '../../../components/game-detail/game-header'
import GameData from '../../../components/game-detail/game-data'
import Gallery from '../../../components/common/gallery'

type GameDetailProps = {
  id: string,
  data?: GameWithPlatform,
  metadata?: IGDBGame,
  error?: Error
}

export default function GameDetail ({ id, data, metadata, error }: GameDetailProps) {
  const game = useEndpoint<GameWithPlatform>(`/api/games/${id}`, { data, error })
  const [showEditModal, setEditModal] = useState(false)
  const [showDeleteModal, setDeleteModal] = useState(false)
  const router = useRouter()

  async function handleEdit (formData: GameplayData) {
    // Check data
    const data: GameUpdate = parseGameUpdate(formData)
    // Send request
    await game.update(data)
    // Check error
    if (!game.state.error) setEditModal(false)
  }

  /*
  async function handleBookmark () {
    // Send request
    await game.update({ fixed: !game.state.data?.fixed })
  }
  */

  async function handleDelete () {
    // Send request
    await game.delete()
    // Check error
    if (!game.state.error) router.push({ pathname: '/' })
  }

  return game.state.data
    ? <div id="game-detail-view" className="grid">

      <Background
        className="-mx-6 shadow-lg lg:rounded-xl lg:overflow-hidden lg:mx-0"
        screenshots={metadata?.screenshots}
        title={game.state.data?.name}>
        <GameHeader
          className="px-6 py-4"
          data={game.state.data} />
      </Background>

      <GameData
        className="py-6"
        data={game.state.data} />

      <div className="grid grid-cols-3 gap-1 md:grid-cols-4 py-6">
        <Gallery images={metadata?.screenshots} />
      </div>

      <HeaderPortal>
        <GameMenu
          onEdit={() => setEditModal(true)}
          onDelete={() => setDeleteModal(true)} />
      </HeaderPortal>

      <Modal backdrop="blur" isOpen={showEditModal} onClose={() => setEditModal(false)}>
        <ModalContent>
          <ModalHeader>Edit</ModalHeader>
          <ModalBody>
            <GameForm
              initialData={{ ...data }}
              onSubmit={handleEdit}
              pending={game.state.pending} />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal backdrop="blur" isOpen={showDeleteModal} onClose={() => setDeleteModal(false)}>
        <ModalContent>
          <ModalHeader>Delete {game.state.data.name}?</ModalHeader>
          <ModalFooter>
            <Button
              onClick={() => setDeleteModal(false)}
              aria-label="cancel">
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              aria-label="delete"
              color="danger"
              startContent={<TrashIcon className="size-5" />}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
    : <span className="px-4 py-3 rounded-lg bg-red-500 text-red-100">
      {`${game.state.error}`}
    </span>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params ?? {}
  const gameId = toString(id)
  if (!gameId) {
    return { notFound: true }
  }
  try {
    const data = await retrieveGame(gameId)
    const metadata = await findGameById(`${data.igdbId}`)
    return {
      props: {
        id,
        data: JSON.parse(JSON.stringify(data)),
        metadata: JSON.parse(JSON.stringify(metadata)),
        error: null
      }
    }
  } catch (error) {
    return {
      props: {
        id,
        data: null,
        metadata: null,
        error: `${error}`
      }
    }
  }
}
