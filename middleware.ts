export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/api',
    '/track',
    '/games',
    '/'
  ],
  pages: {
    signIn: '/auth/signin'
  }
}
