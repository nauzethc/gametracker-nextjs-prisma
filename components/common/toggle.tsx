import { Switch } from '@headlessui/react'

type ToggleProps = {
  label?: string
  onChange?: (checked: boolean) => void
  checked?: boolean
}

export default function Toggle ({ label = 'Toggle', onChange, checked }: ToggleProps) {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      className={'relative inline-block h-5 w-10 rounded-full shrink-0 grow-0 toggle'}>
      <span className="sr-only">{label}</span>
      <span className={`${checked ? 'translate-x-5' : 'translate-x-0'} absolute top-0 left-0 inline-block h-5 w-5 transform rounded-full transition toggle-input`} />
    </Switch>
  )
}
