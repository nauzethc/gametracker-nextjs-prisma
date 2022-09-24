import { Html, Head, Main, NextScript } from 'next/document'

export default function Document () {
  return (
    <Html className="h-full scroll-smooth bg-white antialiased">
      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <body className="flex flex-col min-h-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
