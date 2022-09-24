import Link from 'next/link'
import { PlayIcon } from '@heroicons/react/solid'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSession } from 'next-auth/react'

function Logo () {
  return (
    <div className="logo flex items-center text-lg">
      <span className="font-light">Game</span>
      <span className="font-bold">Tracker</span>
      <PlayIcon className="w-6 h-6" />
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
    ? <header className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
