import { Menu } from '@headlessui/react'
import { LogoutIcon, UserCircleIcon } from '@heroicons/react/solid'
import { useSession, signOut } from 'next-auth/react'

export default function UserButton ({ className = '' }: { className?: string }) {
  const { data: session } = useSession()
  const handleLogout = () => signOut()

  return (session && session.user)
    ? <Menu as="div" className="dropdown h-10">
      <Menu.Button className="btn h-10 text-sm font-semibold px-1">
        {(session.user.image || session.user.picture)
          ? <img className="w-8 h-8 rounded-full"
              src={session.user.image || session.user.picture}
              alt={session.user.email ?? 'User'} />
          : <UserCircleIcon className="w-8 h-8" />
        }
        <span className="hidden pr-2 sm:block">{session.user.name ?? session.user.email}</span>
      </Menu.Button>
      <Menu.Items className="dropdown-menu">
        <Menu.Item>
          <button className="dropdown-item" onClick={handleLogout}>
            <LogoutIcon className="w-6 h-6" />
            <span>Logout</span>
          </button>
        </Menu.Item>
      </Menu.Items>
    </Menu>
    : null
}
