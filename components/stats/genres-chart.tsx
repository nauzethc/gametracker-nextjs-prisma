import React from 'react'
import { semanticColors } from '@nextui-org/react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts'
import { useTheme } from 'next-themes'

type GenresChartProps = {
  genres?: {
    _count: number,
    _totalHours: number,
    genre: string
  }[]
}

export default function GenresChart ({ genres }: GenresChartProps) {
  const maxGames = Math.max(...genres?.map(genre => genre._count) ?? [5])
  const maxHours = Math.max(...genres?.map(genre => genre._totalHours) ?? [10])
  const { theme } = useTheme()
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
            stroke={theme === 'dark' ? 'white' : 'black'} />
          <PolarRadiusAxis
            radiusAxisId="0"
            stroke={theme === 'dark' ? 'white' : 'black'}
            angle={30}
            display="none"
            domain={[0, maxGames]} />
          <PolarRadiusAxis
            radiusAxisId="1"
            stroke={theme === 'dark' ? 'white' : 'black'}
            angle={30}
            display="none"
            domain={[0, maxHours]} />
          <Radar
            radiusAxisId="0"
            name="Games"
            dataKey="_count"
            stroke={theme === 'light' ? semanticColors.light.secondary[400] : semanticColors.dark.secondary[400]}
            strokeWidth={3}
            strokeOpacity={0.6}
            fill={theme === 'light' ? semanticColors.light.secondary[400] : semanticColors.dark.secondary[400]}
            fillOpacity={0.3} />
          <Radar
            radiusAxisId="1"
            name="Games"
            dataKey="_totalHours"
            stroke={theme === 'light' ? semanticColors.light.primary[400] : semanticColors.dark.primary[400]}
            strokeWidth={3}
            strokeOpacity={0.6}
            fill={theme === 'light' ? semanticColors.light.primary[400] : semanticColors.dark.primary[400]}
            fillOpacity={0.3} />
        </RadarChart>
      </ResponsiveContainer>
      : null
  )
}
