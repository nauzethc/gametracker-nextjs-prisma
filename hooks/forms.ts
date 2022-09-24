import { useEffect, useState, SyntheticEvent, FormEventHandler } from 'react'

export function useForm<T> ({
  initialData = {},
  defaults,
  onSubmit
} : {
  initialData?: Partial<T>,
  defaults: T,
  onSubmit?: Function | ((data: T) => void)
}): {
  data: T,
  setData: Function,
  handleChange: FormEventHandler,
  handleSubmit: FormEventHandler
} {
  const [data, setData] = useState<T>({ ...defaults, ...initialData })

  useEffect(() => setData({ ...defaults, ...initialData }), [])

  // This handle is for using directly with form input's `onChange`
  // property, update automatically form data
  const handleChange = (e: SyntheticEvent) => {
    const target = e.target as HTMLFormElement
    const validity = target.validity as ValidityState
    const { name } = target
    if (target.hasAttribute('pattern')) {
      if (validity.valid) {
        setData({ ...data, [name]: target.value })
      }
    } else {
      setData({ ...data, [name]: target.value })
    }
  }

  // This handle check if any callback is passed, then call it with form data
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    if (onSubmit !== undefined) {
      onSubmit(data)
    }
  }

  return { data, setData, handleChange, handleSubmit }
}
