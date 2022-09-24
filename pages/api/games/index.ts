import { Game } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { createGame, findGames } from '../../../services/games'
import { GameQueryParams, GameSearch } from '../../../types/games'
import { parseGameQuery } from '../../../utils/games'
import { authOptions } from '../auth/[...nextauth]'

type error = {
  message: string
}

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<Game | GameSearch | error>
) {
  const { user } = await unstable_getServerSession(req, res, authOptions)
  try {
    switch (req.method) {
      case 'GET': {
        const params: GameQueryParams = parseGameQuery(req.query)
        const games: GameSearch = await findGames(user.id, params)
        res.status(200).json(games)
        break
      }
      case 'POST': {
        const game: Game = await createGame(user.id, req.body)
        res.status(200).json(game)
        break
      }
      default:
        res.status(400).json({ message: `Invalid request: ${req.method} method not allowed` })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: `Server error: ${error}` })
  }
}
