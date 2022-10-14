import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { streamGames } from '../../../services/games'
import { authOptions } from '../auth/[...nextauth]'
import { transformGameCSV } from '../../../utils/streams'

type error = {
  message: string
}

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<any | error>
) {
  // @ts-ignore
  const { user } = await unstable_getServerSession(req, res, authOptions)
  try {
    switch (req.method) {
      case 'GET': {
        const games = streamGames(user.id, 50)
        res.status(200)
        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', `attachment; filename=gametracker-${new Date().toISOString().slice(0, 10)}.csv`)
        res.write([
          'name',
          'gameplayType',
          'platform',
          'status',
          'startedOn',
          'finishedOn',
          'totalHours',
          'progress',
          'achievementsUnlocked',
          'achievementsTotal',
          'rating',
          'comment'
        ].join(';').concat('\n'))
        games.pipe(transformGameCSV).pipe(res)
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
