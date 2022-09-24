import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      name?: string | null,
      email?: string | null,
      image?: string | null,
      picture?: string | null
    } & DefaultSession['user']
  }
}
