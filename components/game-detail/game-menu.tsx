import { Key } from 'react'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from '@nextui-org/react'
import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/solid'

type GameMenuProps = {
  onEdit?: Function
  onDelete?: Function
}

export default function GameMenu ({ onEdit, onDelete }: GameMenuProps) {
  function handleAction (key: Key) {
    switch (key) {
      case 'edit':
        onEdit && onEdit()
        break
      case 'delete':
        onDelete && onDelete()
        break
    }
  }
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly variant="light" radius="full">
          <EllipsisVerticalIcon className="size-5" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="game actions" onAction={handleAction}>
        <DropdownItem
          key="edit"
          startContent={<PencilIcon className="size-5" />}>
          Edit
        </DropdownItem>
        <DropdownItem
          key="delete"
          color="danger"
          className="text-danger"
          startContent={<TrashIcon className="size-5" />}>
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
