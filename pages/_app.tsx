import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import Header from '../components/app/header'
import Head from 'next/head'

export default function App ({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) {
  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <Head>
        <title>GameTracker</title>
      </Head>
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  )
}
