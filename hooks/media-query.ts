import { useState, useCallback, useEffect } from 'react'

export function useMediaQuery (query: string): boolean {
  const [isMatching, setIsMatching] = useState(false)

  const onChange = useCallback((e: MediaQueryListEvent) => {
    if (e.matches) {
      setIsMatching(true)
    } else {
      setIsMatching(false)
    }
  }, [])

  useEffect(() => {
    const matchQuery = window.matchMedia(query)
    matchQuery.addEventListener('change', onChange)
    return () => matchQuery.removeEventListener('change', onChange)
  }, [query, onChange])

  return isMatching
}
