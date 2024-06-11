import React from 'react'
import { PlatformStats } from '../../types/games'
import { reducePlatforms } from '../../utils/stats'
import { semanticColors } from '@nextui-org/react'
import {
  Bar,
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Line
} from 'recharts'
import { useTheme } from 'next-themes'

type PlatformsChartProps = {
  platforms?: PlatformStats[]
}

export default function PlatformsChart ({ platforms }: PlatformsChartProps) {
  const data = reducePlatforms(platforms ?? [])
  const maxHours = Math.max(...data.map(platform => platform._totalHours), 20)
  const maxCount = Math.max(...data.map(platform => platform._count), 5)
  const { theme } = useTheme()
  return (
    Array.isArray(data)
      ? <ResponsiveContainer width="100%" height="90%">
        <ComposedChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={theme === 'dark' ? 'white' : 'black'}
            strokeOpacity={0.5} />
          <XAxis
            dataKey="abbreviation"
            fontSize={14}
            fontWeight={600}
            stroke={theme === 'dark' ? 'white' : 'black'} />
          <YAxis
            yAxisId="0"
            orientation="left"
            domain={[0, maxHours]}
            scale="linear"
            unit="h"
            fontSize={12}
            stroke={theme === 'dark' ? 'white' : 'black'} />
          <YAxis
            yAxisId="1"
            orientation="right"
            domain={[0, maxCount]}
            scale="linear"
            fontSize={12}
            stroke={theme === 'dark' ? 'white' : 'black'} />
          <Bar
            yAxisId="0"
            stackId="a"
            dataKey="finished._totalHours"
            stroke={theme === 'light' ? semanticColors.light.success[400] : semanticColors.dark.success[400]}
            strokeWidth={3}
            fill={theme === 'light' ? semanticColors.light.success[400] : semanticColors.dark.success[400]}
            fillOpacity={0.8}
            maxBarSize={50} />
          <Bar
            yAxisId="0"
            stackId="a"
            dataKey="abandoned._totalHours"
            stroke={theme === 'light' ? semanticColors.light.danger[400] : semanticColors.dark.danger[400]}
            strokeWidth={3}
            fill={theme === 'light' ? semanticColors.light.danger[400] : semanticColors.dark.danger[400]}
            fillOpacity={0.8}
            maxBarSize={50} />
          <Bar
            yAxisId="0"
            stackId="a"
            dataKey="pending._totalHours"
            stroke={theme === 'light' ? semanticColors.light.default[400] : semanticColors.dark.default[400]}
            strokeWidth={3}
            fill={theme === 'light' ? semanticColors.light.default[400] : semanticColors.dark.default[400]}
            fillOpacity={0.8}
            maxBarSize={50} />
          <Bar
            yAxisId="0"
            stackId="a"
            dataKey="ongoing._totalHours"
            stroke={theme === 'light' ? semanticColors.light.primary[400] : semanticColors.dark.primary[400]}
            strokeWidth={3}
            fill={theme === 'light' ? semanticColors.light.primary[400] : semanticColors.dark.primary[400]}
            fillOpacity={0.8}
            maxBarSize={50} />
          <Line
            yAxisId="1"
            type="monotone"
            dataKey="_count"
            stroke={theme === 'light' ? semanticColors.light.secondary[400] : semanticColors.dark.secondary[400]}
            strokeOpacity={0.8}
            strokeWidth={3} />
        </ComposedChart>
      </ResponsiveContainer>
      : null
  )
}
