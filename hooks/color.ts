import { useState, useEffect } from 'react'

export function useColorScheme () {
  const [colorScheme, setColorScheme] = useState<string>('light')

  const handleColorSchemeEvent = (event: MediaQueryListEvent) => {
    setColorScheme(event.matches ? 'dark' : 'light')
  }

  useEffect(() => {
    setColorScheme(
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    )
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', handleColorSchemeEvent)
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', handleColorSchemeEvent)
    }
  }, [])

  return { colorScheme }
}
