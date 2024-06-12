import {
  ChartBarIcon,
  ArrowDownTrayIcon,
  ArrowLeftStartOnRectangleIcon,
  UserCircleIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/solid'
import { useSession, signOut } from 'next-auth/react'
import { useMediaQuery } from '../../hooks/media-query'
import Link from 'next/link'
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { TokenData } from '../../types/token'

export default function UserButton () {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const { data: session } = useSession()
  const isMatching = useMediaQuery('(max-width: 639px)')
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState<TokenData|undefined>()

  const handleLogout = () => signOut()
  const handleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  useEffect(() => {
    if (session && session.user) {
      setUser(session.user as TokenData)
    }
  }, [session])

  if (!(session && session.user)) return null

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button
            radius="full"
            aria-label="user menu"
            className="relative min-w-0 w-10 sm:w-auto sm:pl-10"
            color="primary"
            variant="flat"
            isIconOnly={isMatching}>
            <Avatar
              className="absolute left-1"
              size="sm"
              showFallback
              src={user?.picture ?? undefined}
              fallback={<UserCircleIcon className="size-8" />} />
            <span className="hidden sm:block ml-1">
              {user?.name ?? user?.email}
            </span>
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="User menu">
          <DropdownItem
            href="/stats"
            key="stats"
            startContent={<ChartBarIcon className="size-5" />}>
            Stats
          </DropdownItem>
          <DropdownItem
            key="backup"
            onClick={() => setModalOpen(true)}
            startContent={<ArrowDownTrayIcon className="size-5" />}>
            Backup
          </DropdownItem>
          <DropdownItem
            showDivider
            key="switch-theme"
            onClick={handleTheme}
            startContent={theme === 'light'
              ? <MoonIcon className="size-5" />
              : <SunIcon className="size-5" />
            }>
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </DropdownItem>
          <DropdownItem
            key="logout"
            className="text-danger"
            onClick={handleLogout}
            startContent={<ArrowLeftStartOnRectangleIcon className="size-5" />}>
            Logout
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal
        size="xs"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        backdrop="blur">
        <ModalContent>
          <ModalHeader>Backup</ModalHeader>
          <ModalBody>
            <p className="py-2">Would you like to download your tracking data?</p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary"as={Link} href="/api/download?format=json">JSON</Button>
            <Button color="primary"as={Link} href="/api/download?format=csv">CSV</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
