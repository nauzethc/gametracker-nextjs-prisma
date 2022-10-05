import { useEffect, useState } from 'react'
import { useEndpoint } from '../hooks/http'
import { IGDBSearch, IGDBGameSelected, IGDBQueryParams } from '../types/igdb'
import { Dialog } from '@headlessui/react'
import { DEFAULT_PAGE_SIZE } from '../config'

import Modal from '../components/common/modal'
import Error from '../components/common/error'
import SearchForm from '../components/game-create/search-form'
import SearchResults from '../components/game-create/search-results'
import GameForm, { GameplayData } from '../components/game-create/game-form'
import GamePreview from '../components/game-create/game-preview'
import { Game } from '@prisma/client'
import { GameCreate } from '../types/games'
import { parseGameCreate } from '../utils/games'
import Pagination from '../components/common/pagination'
import UserButton from '../components/common/user-button'
import { HeaderPortal } from '../components/app/header'

export default function TrackView () {
  const igdb = useEndpoint<IGDBSearch>('/api/igdb/games')
  const game = useEndpoint<Game>('/api/games')
  const [selected, setSelected] = useState<IGDBGameSelected|null>(null)
  const [query, setQuery] = useState<IGDBQueryParams>({ q: '' })

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

  // Update results on query change
  useEffect(() => {
    igdb.retrieve(query)
  }, [query])

  return (
    <div id="add-game-view">
      <HeaderPortal>
        <UserButton extended />
      </HeaderPortal>
      <div className="grid py-3 gap-8 md:grid-cols-2">
        <SearchForm
          className="col-span-full"
          onSubmit={setQuery}
          pending={igdb.state.pending} />
        <SearchResults
          results={igdb.state.data}
          onSelect={game => setSelected(game)} />
        <Pagination
          className="col-span-full"
          pageSize={query?.page_size ?? DEFAULT_PAGE_SIZE}
          total={igdb.state.data?.count ?? 0}
          page={query?.page ?? 1}
          onChange={page => setQuery({ ...query, page })} />
      </div>
      <Modal open={Boolean(selected)} onClose={() => setSelected(null)}>
        <Dialog.Panel className="dialog-panel">
          <GamePreview data={selected} />
          <GameForm initialData={{}} onSubmit={handleSubmit} />
          <Error error={game.state.error} />
        </Dialog.Panel>
      </Modal>
    </div>
  )
}
