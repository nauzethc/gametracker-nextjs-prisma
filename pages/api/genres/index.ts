import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { findGenres } from '../../../services/games'
import { authOptions } from '../auth/[...nextauth]'

type error = {
  message: string
}

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<string[] | error>
) {
  try {
    // @ts-ignore
    const { user } = await unstable_getServerSession(req, res, authOptions)
    switch (req.method) {
      case 'GET': {
        const genres: string[] = await findGenres(user.id)
        res.status(200).json(genres)
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
