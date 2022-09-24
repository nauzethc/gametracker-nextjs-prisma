import { GameUpdate, GameWithPlatform } from '../../types/games'
import { useEndpoint } from '../../hooks/http'
import { GetServerSideProps } from 'next'
import { useState } from 'react'
import GamePreview from '../../components/game-detail/game-preview'
import GameForm, { GameplayData } from '../../components/game-create/game-form'
import { HeaderPortal } from '../../components/app/header'
import { PencilIcon, TrashIcon } from '@heroicons/react/solid'
import Modal from '../../components/common/modal'
import { Dialog } from '@headlessui/react'
import { parseGameUpdate } from '../../utils/games'
import { useRouter } from 'next/router'
import { retrieveGame } from '../../services/games'
import { toString } from '../../utils/url'

type GameDetailProps = {
  id: string,
  data?: GameWithPlatform,
  error?: Error
}

export default function GameDetail ({ id, data, error }: GameDetailProps) {
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

  async function handleDelete () {
    // Send request
    await game.delete()
    // Check error
    if (!game.state.error) router.push({ pathname: '/' })
  }

  return game.state.data
    ? <div id="game-detail-view" className="grid px-4 py-3">
      <GamePreview data={game.state.data} />

      <HeaderPortal>
        <button onClick={() => setEditModal(true)} className="h-10 w-10 sm:w-auto sm:px-4 text-sm font-semibold">
          <PencilIcon className="h-6 w-6" />
          <span className="hidden sm:block">Edit</span>
        </button>
        <button onClick={() => setDeleteModal(true)} className="btn-danger h-10 w-10 sm:w-auto sm:px-4 text-sm font-semibold">
          <TrashIcon className="h-6 w-6" />
          <span className="hidden sm:block">Delete</span>
        </button>
      </HeaderPortal>

      <Modal open={showEditModal} onClose={() => setEditModal(false)}>
        <Dialog.Panel className="dialog-panel">
          <GameForm
            initialData={{ ...data }}
            onSubmit={handleEdit}
            pending={game.state.pending} />
        </Dialog.Panel>
      </Modal>

      <Modal open={showDeleteModal} onClose={() => setDeleteModal(false)}>
        <Dialog.Panel className="dialog-panel">
          <Dialog.Title className="font-semibold">
            Delete {game.state.data.name}?
          </Dialog.Title>
          <div className="flex items-center justify-end gap-2">
            <button className="btn-invisible h-10 px-4 text-sm font-semibold" onClick={() => setDeleteModal(false)}>Cancel</button>
            <button className="btn-danger h-10 px-4 text-sm font-semibold" onClick={handleDelete}>
              <TrashIcon className="h-6 w-6" />
              <span>Delete</span>
            </button>
          </div>
        </Dialog.Panel>
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
    return {
      props: {
        id,
        data: JSON.parse(JSON.stringify(data)),
        error: null
      }
    }
  } catch (error) {
    return {
      props: {
        id,
        data: null,
        error: `${error}`
      }
    }
  }
}
