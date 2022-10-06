import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { getStats } from '../../../services/games'
import { toString } from '../../../utils/url'
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
        const period = toString(req.query.period)
        const stats = await getStats(user.id, period)
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
