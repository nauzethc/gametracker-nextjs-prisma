import { Html, Head, Main, NextScript } from 'next/document'

export default function Document () {
  return (
    <Html lang="en" className="h-full scroll-smooth bg-white antialiased">
      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <body className="flex flex-col min-h-full bg-transparent">
        <div className="app-background fixed h-screen w-screen -z-10" />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
