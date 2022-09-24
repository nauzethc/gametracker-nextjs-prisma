import { Game } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { retrieveGame, updateGame, deleteGame } from '../../../services/games'
import { toString } from '../../../utils/url'

type error = {
  message: string
}

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<Game | error>
) {
  const id: string | undefined = toString(req.query.id)
  if (!id) {
    res.status(404).json({ message: 'Game not found or invalid ID' })
    return
  }

  let game: Game

  try {
    switch (req.method) {
      case 'GET':
        game = await retrieveGame(id)
        res.status(200).json(game)
        break
      case 'DELETE':
        game = await deleteGame(id)
        res.status(200).json(game)
        break
      case 'PATCH':
        game = await updateGame(id, req.body)
        res.status(200).json(game)
        break
      default:
        res.status(400).json({ message: `Invalid request: ${req.method} method not allowed` })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: `Server error: ${error}` })
  }
}
