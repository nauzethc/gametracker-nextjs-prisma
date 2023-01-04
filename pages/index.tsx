import { GameQueryParams, GameSearch } from '../types/games'
import { useEffect, useState } from 'react'
import { GetServerSidePropsContext } from 'next'
import { useEndpoint } from '../hooks/http'
import { useRouter } from 'next/router'
import { useDidMount } from '../hooks/lifecycle'

import Link from 'next/link'
import { PlusCircleIcon, QueueListIcon, Squares2X2Icon } from '@heroicons/react/24/solid'
import SearchForm from '../components/home/search-form'
import SearchResults from '../components/home/search-results'
import Pagination from '../components/common/pagination'
import { findGames, findGenres, findPlatforms } from '../services/games'
import { parseGameQuery } from '../utils/games'
import { HeaderPortal } from '../components/app/header'
import UserButton from '../components/common/user-button'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'
import { Platform } from '@prisma/client'
import Toggle from '../components/common/toggle'

export default function HomeView ({
  query: initialQuery,
  platforms = [],
  genres = [],
  data,
  error
}: {
  query: GameQueryParams,
  data: GameSearch,
  platforms?: Platform[],
  genres?: string[],
  error: any
}) {
  const didMount = useDidMount()
  const [query, setQuery] = useState<Record<string, any>>(initialQuery)
  const [showTable, setTable] = useState<boolean>(false)
  const games = useEndpoint<GameSearch>('/api/games', { data, error })
  const router = useRouter()

  const handlePageChange = (page: number) => setQuery({ ...query, page })
  const handleSubmit = (query: Record<string, any>) => {
    // Omit some values
    const { igdbId, ...newQuery } = query
    setQuery(newQuery)
  }

  // Update results on query change
  useEffect(() => {
    if (didMount) {
      router.push({ pathname: '/', query }, undefined, { shallow: true })
      games.retrieve(query)
    }
  }, [query])

  return (
    <div id="home-view">
      <div className="grid grid-cols-1 md:grid-cols-2 py-3 gap-8 mb-4">
        <SearchForm
          initialData={query}
          className="col-span-full mb-4"
          onSubmit={handleSubmit}
          platforms={platforms}
          genres={genres}
          pending={games.state.pending} />
        <div className="flex items-center justify-between gap-6 col-span-full">
          <div>
            {games.state.data?.count
              ? <span className="badge">{games.state.data.count} {games.state.data.count > 1 ? 'games' : 'game'}</span>
              : <span className="badge badge-danger">No games found</span>
            }
          </div>
          <div className="flex items-center gap-2">
            <Squares2X2Icon className="w-6 h-6" />
            <Toggle checked={showTable} onChange={setTable} />
            <QueueListIcon className="w-6 h-6" />
          </div>
        </div>
        <SearchResults
          asTable={showTable}
          {...games.state.data} />
        <Pagination
          className="col-span-full mt-4"
          page={Number(query.page || 1)}
          pageSize={10}
          total={games.state.data ? games.state.data.count : 0}
          onChange={handlePageChange} />
      </div>
      <HeaderPortal>
        <UserButton />
        <Link href="/track">
          <a className="btn btn-primary px-4 h-10 text-sm">
            <PlusCircleIcon className="h-6 w-6" />
            <span>Track</span>
          </a>
        </Link>
      </HeaderPortal>
    </div>
  )
}

export async function getServerSideProps (context: GetServerSidePropsContext) {
  // @ts-ignore
  const { user } = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )
  const query: GameQueryParams = parseGameQuery(context.query)
  const platforms = await findPlatforms()
  const genres = await findGenres(user.id)
  try {
    const data = await findGames(user.id, query)
    return {
      props: JSON.parse(JSON.stringify({
        data,
        platforms,
        genres,
        error: null,
        query
      }))
    }
  } catch (error) {
    return {
      props: JSON.parse(JSON.stringify({
        data: { count: 0, data: [] },
        platforms,
        genres,
        error: `${error}`,
        query
      }))
    }
  }
}
