import { useState } from 'react'
import { useEndpoint } from '../hooks/http'
import { IGDBSearch, IGDBGameSelected } from '../types/igdb'
import { Dialog } from '@headlessui/react'

import Modal from '../components/common/modal'
import Error from '../components/common/error'
import SearchForm from '../components/game-create/search-form'
import SearchResults from '../components/game-create/search-results'
import GameForm, { GameplayData } from '../components/game-create/game-form'
import GamePreview from '../components/game-create/game-preview'
import { Game } from '@prisma/client'
import { GameCreate } from '../types/games'
import { parseGameCreate } from '../utils/games'
import { HeaderPortal } from '../components/app/header'
import UserButton from '../components/common/user-button'

export default function TrackView () {
  const igdb = useEndpoint<IGDBSearch>('/api/igdb/games')
  const game = useEndpoint<Game>('/api/games')
  const [selected, setSelected] = useState<IGDBGameSelected|null>(null)

  async function handleSubmit (gameplayData: GameplayData) {
    if (selected !== null) {
      // Complete data
      const data: GameCreate = parseGameCreate({ ...selected, ...gameplayData })
      // Send request
      await game.create(data)
      // Check error
      if (!game.state.error) setSelected(null)
    }
  }

  return (
    <div id="add-game-view">
      <div className="grid py-3 gap-8 md:grid-cols-2">
        <SearchForm className="col-span-full" onSubmit={igdb.retrieve} pending={igdb.state.pending} />
        <SearchResults results={igdb.state.data} onSelect={game => setSelected(game)} />
      </div>
      <Modal open={Boolean(selected)} onClose={() => setSelected(null)}>
        <Dialog.Panel className="dialog-panel">
          <GamePreview data={selected} />
          <GameForm initialData={{}} onSubmit={handleSubmit} />
          <Error error={game.state.error} />
        </Dialog.Panel>
      </Modal>
      <HeaderPortal>
        <UserButton />
      </HeaderPortal>
    </div>
  )
}
