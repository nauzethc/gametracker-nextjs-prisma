import React from 'react'
import { PlatformStats } from '../../types/games'
import { reducePlatforms } from '../../utils/stats'
import { useColorScheme } from '../../hooks/color'
import {
  Bar,
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Line
} from 'recharts'

type PlatformsChartProps = {
  platforms?: PlatformStats[]
}

export default function PlatformsChart ({ platforms }: PlatformsChartProps) {
  const data = reducePlatforms(platforms ?? [])
  const maxHours = Math.max(...data.map(platform => platform._totalHours), 20)
  const maxCount = Math.max(...data.map(platform => platform._count), 5)
  const { colorScheme } = useColorScheme()
  return (
    Array.isArray(data)
      ? <ResponsiveContainer width="100%" height="90%">
        <ComposedChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={colorScheme === 'dark' ? 'white' : 'black'}
            strokeOpacity={0.5} />
          <XAxis
            dataKey="abbreviation"
            fontSize={14}
            fontWeight={600}
            stroke={colorScheme === 'dark' ? 'white' : 'black'} />
          <YAxis
            yAxisId="0"
            orientation="left"
            domain={[0, maxHours]}
            scale="linear"
            unit="h"
            fontSize={12}
            stroke={colorScheme === 'dark' ? 'white' : 'black'} />
          <YAxis
            yAxisId="1"
            orientation="right"
            domain={[0, maxCount]}
            scale="linear"
            fontSize={12}
            stroke={colorScheme === 'dark' ? 'white' : 'black'} />
          <Bar
            yAxisId="0"
            stackId="a"
            dataKey="finished._totalHours"
            stroke={colorScheme === 'light' ? '#22c55e' : '#166534'}
            strokeWidth={3}
            fill={colorScheme === 'light' ? '#22c55e' : '#166534'}
            fillOpacity={0.8}
            maxBarSize={50} />
          <Bar
            yAxisId="0"
            stackId="a"
            dataKey="abandoned._totalHours"
            stroke={colorScheme === 'light' ? '#ef4444' : '#991b1b'}
            strokeWidth={3}
            fill={colorScheme === 'light' ? '#ef4444' : '#991b1b'}
            fillOpacity={0.8}
            maxBarSize={50} />
          <Bar
            yAxisId="0"
            stackId="a"
            dataKey="pending._totalHours"
            stroke={colorScheme === 'light' ? '#64748b' : '#1e293b'}
            strokeWidth={3}
            fill={colorScheme === 'light' ? '#64748b' : '#1e293b'}
            fillOpacity={0.8}
            maxBarSize={50} />
          <Line
            yAxisId="1"
            type="monotone"
            dataKey="_count"
            stroke="#dc2626"
            strokeOpacity={0.8}
            strokeWidth={3} />
        </ComposedChart>
      </ResponsiveContainer>
      : null
  )
}
