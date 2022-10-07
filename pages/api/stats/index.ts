import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { findStats } from '../../../services/games'
import { parseStatsQuery } from '../../../utils/games'
import { authOptions } from '../auth/[...nextauth]'

type error = {
  message: string
}

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<any|error>
) {
  // @ts-ignore
  const { user } = await unstable_getServerSession(req, res, authOptions)
  try {
    switch (req.method) {
      case 'GET': {
        const query = parseStatsQuery(req.query)
        const stats = await findStats(user.id, query)
        res.status(200).json(stats)
        break
      }
      default:
        res.status(400).json({ message: `Invalid request: ${req.method} method not allowed` })
    }
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` })
  }
}
