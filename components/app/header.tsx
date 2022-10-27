import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSession } from 'next-auth/react'

function Logo () {
  return (
    <div className="logo flex items-center text-lg">
      <span className="font-light">Game</span>
      <span className="font-bold">Tracker</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z" clipRule="evenodd" />
      </svg>
    </div>
  )
}

export function HeaderPortal ({ children }: { children?: any }) {
  const [mounted, setMounted] = useState(false)
  const { data: session } = useSession()
  const [element, setElement] = useState<any | null>(null)

  useEffect(() => {
    setMounted(true)
    setElement(document.querySelector('#app-bar--portal'))
    return () => setMounted(false)
  }, [session])

  return (mounted && element)
    ? createPortal(children, element as Element)
    : null
}

export default function Header () {
  const { data: session } = useSession()
  return (session && session.user)
    ? <header className="app-header">
      <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link href="/">
              <a><Logo /></a>
            </Link>
            <div className="hidden md:flex md:gap-x-6"></div>
          </div>
          <div id="app-bar--portal" className="flex items-center gap-x-2 md:gap-x-4" />
        </nav>
      </div>
    </header>
    : null
}
