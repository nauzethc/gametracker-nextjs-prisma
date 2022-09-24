import { Fragment } from 'react'
import { GameWithPlatform } from '../../types/games'
import GameItem from './game-item'

type SearchResultProps = {
  data?: GameWithPlatform[],
  count?: number
}

export default function SearchResults ({ data, count }: SearchResultProps) {
  return (
    <Fragment>
      {Array.isArray(data)
        ? data.map(game => <GameItem key={game.id} data={game} />)
        : null
      }
    </Fragment>
  )
}
