import type { NextApiRequest, NextApiResponse } from 'next'
import { findGamesByName } from '../../../../services/igdb'
import { IGDBSearch, IGDBQueryParams } from '../../../../types/igdb'
import { parseGameQuery } from '../../../../utils/igdb'

type error = {
  message: string
}

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<IGDBSearch | error>
) {
  if (!req.query.q) {
    res.status(400).json({ message: 'Invalid request: \'q\' param is mandatory' })
  } else if (req.method !== 'GET') {
    res.status(400).json({ message: 'Invalid request: Only GET method supported' })
  } else {
    const query: IGDBQueryParams = parseGameQuery(req.query)
    const games = await findGamesByName(query)
    res.status(200).json(games)
  }
}
