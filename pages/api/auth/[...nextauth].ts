import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'

import GithubProvider from 'next-auth/providers/github'
// import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '../../../lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? ''
    })
    /*
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code'
    })
    */
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/signin'
  },
  callbacks: {
    async jwt ({ token, user, account }) {
      if (user) token.id = user.id
      if (account?.access_token) token.access_token = account.access_token
      return token
    },
    async session ({ session, token }) {
      if (token) session.user = token
      return session
    }
  }
}

export default NextAuth(authOptions)
