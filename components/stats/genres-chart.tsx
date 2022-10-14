import React, { useState, useEffect } from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts'

type GenresChartProps = {
  genres?: { _count: number, genre: string }[]
}

export default function GenresChart ({ genres }: GenresChartProps) {
  const max = Math.max.apply(genres?.map(genre => genre._count) ?? [5])
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

  return (
    Array.isArray(genres)
      ? <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          cx="50%"
          cy="50%"
          outerRadius="80%"
          data={genres.slice(0, 8)}>
          <PolarGrid />
          <PolarAngleAxis
            dataKey="genre"
            fontFamily='Inter var, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
            fontSize="0.875rem"
            fontWeight="600"
            stroke={colorScheme === 'dark' ? 'white' : 'black'} />
          <PolarRadiusAxis
            stroke={colorScheme === 'dark' ? 'white' : 'black'}
            angle={30}
            fontSize="12px"
            display="none"
            domain={[0, max]} />
          <Radar
            name="Games"
            dataKey="_count"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
      : null
  )
}
