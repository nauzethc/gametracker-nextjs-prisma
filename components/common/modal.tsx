import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

type ModalProps = {
  open?: boolean,
  onClose: (value: boolean) => void,
  children?: any
}

export default function Modal ({ open, onClose, children } : ModalProps) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/50 backdrop-blur" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95">
          <div className="fixed inset-0 flex items-center justify-center p-4">
            {children}
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}
