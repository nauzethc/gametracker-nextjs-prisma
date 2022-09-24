import type { NextApiRequest, NextApiResponse } from 'next'
import { findGamesByName } from '../../../../services/igdb'
import { IGDBSearch } from '../../../../types/igdb'
import { toString, toNumber } from '../../../../utils/url'

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
    const { q, page_size, page, order_by } = req.query
    const games = await findGamesByName({
      q: toString(q) ?? '',
      page_size: toNumber(page_size),
      page: toNumber(page),
      order_by: toString(order_by)
    })
    res.status(200).json(games)
  }
}
