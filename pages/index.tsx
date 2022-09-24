import { GameQueryParams, GameSearch } from '../types/games'
import { useEffect, useState } from 'react'
import { GetServerSidePropsContext } from 'next'
import { useEndpoint } from '../hooks/http'
import { useRouter } from 'next/router'
import { useDidMount } from '../hooks/lifecycle'

import Link from 'next/link'
import { PlusCircleIcon } from '@heroicons/react/solid'
import SearchForm from '../components/home/search-form'
import SearchResults from '../components/home/search-results'
import Pagination from '../components/common/pagination'
import { findGames, findPlatforms } from '../services/games'
import { parseGameQuery } from '../utils/games'
import { HeaderPortal } from '../components/app/header'
import UserButton from '../components/common/user-button'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'
import { Platform } from '@prisma/client'

export default function HomeView ({
  query: initialQuery,
  platforms = [],
  data,
  error
}: {
  query: GameQueryParams,
  data: GameSearch,
  platforms?: Platform[],
  error: any
}) {
  const didMount = useDidMount()
  const [query, setQuery] = useState<Record<string, any>>(initialQuery)
  const games = useEndpoint<GameSearch>('/api/games', { data, error })
  const router = useRouter()

  const handlePageChange = (page: Number) => setQuery({ ...query, page })
  const handleSubmit = (query: Record<string, any>) => setQuery(query)

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
          pending={games.state.pending} />
        <SearchResults
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
  const { user } = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )
  const query: GameQueryParams = parseGameQuery(context.query)
  const platforms = await findPlatforms()
  try {
    const data = await findGames(user.id, query)
    return {
      props: {
        error: null,
        data: JSON.parse(JSON.stringify(data)),
        platforms: JSON.parse(JSON.stringify(platforms)),
        query: JSON.parse(JSON.stringify(query))
      }
    }
  } catch (error) {
    return {
      props: {
        error,
        data: { count: 0, data: [] },
        platforms: JSON.parse(JSON.stringify(platforms)),
        query: JSON.parse(JSON.stringify(query))
      }
    }
  }
}
