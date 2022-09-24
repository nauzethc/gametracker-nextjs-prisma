import { Platform } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { findPlatforms } from '../../../services/games'

type error = {
  message: string
}

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<Platform[] | error>
) {
  try {
    switch (req.method) {
      case 'GET': {
        const platforms: Platform[] = await findPlatforms()
        res.status(200).json(platforms)
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
