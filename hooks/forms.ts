import { useEffect, useState, SyntheticEvent, FormEventHandler, ChangeEvent } from 'react'

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
  const handleChange = (e: ChangeEvent<HTMLFormElement>) => {
    const validity = e.target.validity as ValidityState
    const { name } = e.target
    if (e.target.hasAttribute && e.target.hasAttribute('pattern')) {
      if (validity.valid) {
        setData({ ...data, [name]: e.target.value })
      }
    } else {
      setData({ ...data, [name]: e.target.value })
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
