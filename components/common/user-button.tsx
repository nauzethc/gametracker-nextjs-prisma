import { useState } from 'react'
import { Menu, Dialog } from '@headlessui/react'
import { ChartBarIcon, ArrowDownTrayIcon, ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Modal from './modal'

function Avatar ({ src, alt }: { src?: string | null, alt?: string | null }) {
  return src
    ? <img className="w-8 h-8 rounded-full"
      src={src}
      alt={alt ?? 'User'} />
    : <UserCircleIcon className="w-8 h-8" />
}

export default function UserButton ({
  className = '',
  extended
}: {
  className?: string,
  extended?: boolean
}) {
  const { data: session } = useSession()
  const handleLogout = () => signOut()
  const [showBackupModal, setBackupModal] = useState(false)

  if (!(session && session.user)) return null

  return (
    <div className="user-button">
      <Modal open={showBackupModal} onClose={() => setBackupModal(false)}>
        <Dialog.Panel className="dialog-panel">
          <h3 className="font-semibold">Backup</h3>
          <span className="py-2">Download your tracking data</span>
          <div className="modal-action flex items-center justify-end gap-2">
            <Link href="/api/download?format=json" legacyBehavior>
              <a className="btn btn-primary px-4 py-2">JSON</a>
            </Link>
            <Link href="/api/download?format=csv" legacyBehavior>
              <a className="btn btn-primary px-4 py-2">CSV</a>
            </Link>
          </div>
        </Dialog.Panel>
      </Modal>
      <Menu as="div" className="dropdown h-10">
        <Menu.Button className="btn h-10 text-sm font-semibold px-1" aria-label="user menu">
          {
            // @ts-ignore
            <Avatar src={session.user.image || session.user.picture} alt={session.user.name} />
          }
          <span className={`${extended ? 'block' : 'hidden'} pr-2 sm:block`}>{session.user.name ?? session.user.email}</span>
        </Menu.Button>
        <Menu.Items className="dropdown-menu min-w-full w-36 p-1 grid gap-1">
          <Menu.Item>
            <Link href="/stats" legacyBehavior>
              <a className="btn dropdown-item">
                <span className="text-sm">Stats</span>
                <ChartBarIcon className="w-5 h-5" />
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item>
            <a href="#download"
              onClick={() => setBackupModal(true)}
              className="btn dropdown-item">
              <span className="text-sm">Backup</span>
              <ArrowDownTrayIcon className="w-5 h-5" />
            </a>
          </Menu.Item>
          <hr className="w-full border-slate-300 dark:border-slate-700" />
          <Menu.Item>
            <button className="dropdown-item" onClick={handleLogout} aria-label="logout">
              <span className="text-sm">Logout</span>
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </button>
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  )
}
