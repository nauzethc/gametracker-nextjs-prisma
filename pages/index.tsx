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
import { capitalize } from '../utils/strings'
import { Button, Chip, Switch } from '@nextui-org/react'

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
  const filters = query !== undefined
    ? ['developer', 'publisher']
        .map(key => [key, query[key]])
        .filter(([key, value]) => value)
    : []

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
      <div className="grid">
        <SearchForm
          initialData={query}
          className="col-span-full mb-4"
          onSubmit={handleSubmit}
          platforms={platforms}
          genres={genres}
          pending={games.state.pending} />
        <div className="flex items-start justify-between gap-6 col-span-full">
          <div className="flex flex-wrap items-start gap-2">
            {games.state.data?.count
              ? <Chip>{games.state.data.count} {games.state.data.count > 1 ? 'games' : 'game'}</Chip>
              : <Chip color="danger">No games found</Chip>
            }
            {filters.map(([key, value]) =>
              <Chip key={key} color="secondary">{capitalize(key)}: {value}</Chip>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Squares2X2Icon className="size-6" />
            <Switch isSelected={showTable} onValueChange={setTable} className="-mr-2" />
            <QueueListIcon className="size-6" />
          </div>
        </div>
        <div className="grid gap-4 py-6 md:grid-cols-2">
          <SearchResults asTable={showTable} {...games.state.data} />
        </div>
        <Pagination
          className="col-span-full grid justify-center mt-4"
          page={Number(query?.page ?? 1)}
          pageSize={Number(query?.page_size ?? 10)}
          total={games.state.data ? games.state.data.count : 0}
          onChange={handlePageChange} />
      </div>
      <HeaderPortal>
        <UserButton />
        <Button as={Link} color="primary" href="/track" radius="full">
          <PlusCircleIcon className="size-6" /> Track
        </Button>
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
