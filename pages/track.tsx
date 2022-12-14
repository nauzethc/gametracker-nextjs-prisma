import { useEffect, useState } from 'react'
import { useEndpoint } from '../hooks/http'
import { IGDBSearch, IGDBGameSelected, IGDBQueryParams, IGDBPlatform } from '../types/igdb'
import { Dialog } from '@headlessui/react'
import { DEFAULT_PAGE_SIZE } from '../config'
import { useRouter } from 'next/router'

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
import { GetServerSideProps } from 'next'
import { findGamesByName, findPlatforms } from '../services/igdb'
import { useDidMount } from '../hooks/lifecycle'
import { parseGameQuery } from '../utils/igdb'

export default function TrackView ({
  query: initialQuery,
  platforms = [],
  data,
  error
}: {
  query: IGDBQueryParams,
  data: IGDBSearch,
  platforms?: IGDBPlatform[],
  error: any
}) {
  const router = useRouter()
  const didMount = useDidMount()
  const [query, setQuery] = useState<Record<string, any>>(initialQuery)
  const [selected, setSelected] = useState<IGDBGameSelected|null>(null)
  const igdb = useEndpoint<IGDBSearch>('/api/igdb/games', { data, error })
  const game = useEndpoint<Game>('/api/games')

  const handlePageChange = (page: number) => setQuery({ ...query, page })
  const handleSubmitQuery = (query: Record<string, any>) => {
    // Omit some values
    const { page, ...newQuery } = query
    setQuery(newQuery)
  }

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
    if (didMount && query.q) {
      router.push({ pathname: '/track', query }, undefined, { shallow: true })
      igdb.retrieve(query)
    }
  }, [query])

  return (
    <div id="add-game-view">
      <HeaderPortal>
        <UserButton />
      </HeaderPortal>
      <div className="grid grid-cols-1 md:grid-cols-2 py-3 gap-8 mb-4">
        <SearchForm
          initialData={{ q: '', ...query }}
          className="col-span-full"
          onSubmit={handleSubmitQuery}
          platforms={platforms}
          pending={igdb.state.pending} />
        <SearchResults
          results={igdb.state.data}
          onSelect={game => setSelected(game)} />
        <Pagination
          className="col-span-full"
          pageSize={query?.page_size ?? DEFAULT_PAGE_SIZE}
          total={igdb.state.data?.count ?? 0}
          page={query?.page ?? 1}
          onChange={handlePageChange} />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query: IGDBQueryParams = parseGameQuery(context.query)
  try {
    const data = query.q ? await findGamesByName(query) : { count: 0, data: [] }
    const platforms = await findPlatforms()
    return {
      props: JSON.parse(JSON.stringify({
        data,
        platforms: platforms.data,
        error: null,
        query
      }))
    }
  } catch (error) {
    return {
      props: JSON.parse(JSON.stringify({
        data: { count: 0, data: [] },
        platforms: [],
        error: `${error}`,
        query
      }))
    }
  }
}
