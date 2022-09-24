import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import type { NextAuthOptions } from 'next-auth'

export function withUser ({
  req,
  res,
  authOptions
}: {
  req: NextRequest | NextApiRequest,
  res: NextResponse | NextApiResponse,
  authOptions: NextAuthOptions
}) {
  
}
