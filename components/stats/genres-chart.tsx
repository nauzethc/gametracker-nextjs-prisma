import React from 'react'
import { useColorScheme } from '../../hooks/color'
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
  const { colorScheme } = useColorScheme()
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
            display="none"
            domain={[0, max]} />
          <Radar
            name="Games"
            dataKey="_count"
            stroke="#2563eb"
            strokeWidth={2}
            strokeOpacity={0.6}
            fill="#3b82f6"
            fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
      : null
  )
}
