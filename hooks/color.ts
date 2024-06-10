import { useState, useEffect, useMemo } from 'react'
import { findDominantColors, rgbToHsl } from '../utils/colors'

const LOW_FILTER = 20
const CONTRAST = 20

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

type ImageColors = {
  color?: string,
  background?: string
}

export function useImageColors (src: string|null|undefined) {
  const [style, setStyle] = useState<ImageColors>({})

  useMemo(async () => {
    if (src) {
      const [dominant, secondary] = await findDominantColors(src, 3)
      if (dominant) {
        const { r: r1, g: g1, b: b1 } = dominant
        const { r: r2, g: g2, b: b2 } = secondary
        const { h, s, l } = rgbToHsl(dominant)

        setStyle({
          background: `linear-gradient(-30deg, rgb(${r1},${g1},${b1}) 0%, rgb(${r2},${g2},${b2}) 100%)`,
          color: `hsl(${h} ${s} ${l > LOW_FILTER ? CONTRAST : 100 - CONTRAST})`
        })
      }
    }
  }, [src])

  return style
}
