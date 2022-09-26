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
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
        <meta name="application-name" content="GameTracker" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GameTracker" />
        <meta name="description" content="Track your games activity" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/touch-icon-ipad.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png" />

        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://gametracker-nextjs.vercel.app" />
        <meta name="twitter:title" content="GameTracker" />
        <meta name="twitter:description" content="Track your games activity" />
        <meta name="twitter:image" content="https://gametracker-nextjs.vercel.app/icons/android-chrome-192x192.png" />
        <meta name="twitter:creator" content="@nauzethc" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="GameTracker" />
        <meta property="og:description" content="Track your games activity" />
        <meta property="og:site_name" content="GameTracker" />
        <meta property="og:url" content="https://gametracker-nextjs.vercel.app" />
        <meta property="og:image" content="https://gametracker-nextjs.vercel.app/icons/touch-icon-retina.png" />
      </Head>
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  )
}
