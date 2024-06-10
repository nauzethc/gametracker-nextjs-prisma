import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSession } from 'next-auth/react'
import Logo from './logo'
import { Link, Navbar, NavbarBrand, NavbarContent } from '@nextui-org/react'

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
    ? (
      <Navbar>
        <NavbarBrand>
          <Link href="/"><Logo /></Link>
        </NavbarBrand>
        <NavbarContent justify="end">
          <div id="app-bar--portal" className="flex items-center gap-x-2 md:gap-x-4" />
        </NavbarContent>
      </Navbar>
      )
    : null
}
