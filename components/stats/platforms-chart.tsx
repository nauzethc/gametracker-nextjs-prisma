import React from 'react'
import { useColorScheme } from '../../hooks/color'
import {
  ComposedChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line
} from 'recharts'

type PlatformsChartProps = {
  platforms?: {
    name: string,
    abbreviation: string | null,
    _count: { _all: number | null },
    _sum: { totalHours: number | null }
  }[]
}

export default function PlatformsChart ({ platforms }: PlatformsChartProps) {
  const data = platforms?.map(platform => ({
    name: platform.name,
    abbreviation: platform.abbreviation,
    games: platform._count._all,
    hours: platform._sum.totalHours
  }))
  const maxCount = Math.max(5, Math.max.apply(data?.map(p => p.games)))
  const maxHours = Math.max.apply(data?.map(p => p.hours))
  const { colorScheme } = useColorScheme()
  return (
    Array.isArray(data)
      ? <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <XAxis
            dataKey="abbreviation"
            fontSize={14}
            fontWeight={600}
            stroke={colorScheme === 'dark' ? 'white' : 'black'} />
          <YAxis
            yAxisId="0"
            dataKey="games"
            domain={[0, maxCount]}
            orientation="left"
            scale="linear"
            fontSize={14}
            stroke={colorScheme === 'dark' ? 'white' : 'black'} />
          <YAxis
            yAxisId="1"
            dataKey="hours"
            domain={[0, maxHours]}
            orientation="right"
            scale="linear"
            unit="h"
            fontSize={12}
            stroke={colorScheme === 'dark' ? 'white' : 'black'} />
          <Bar
            yAxisId="1"
            dataKey="hours"
            stroke="#2563eb"
            strokeWidth={2}
            strokeOpacity={0.6}
            fill="#3b82f6"
            fillOpacity={0.6}
            maxBarSize={50} />
          <Line
            yAxisId="0"
            type="monotone"
            dataKey="games"
            stroke="#dc2626"
            strokeOpacity={0.8}
            strokeWidth={3} />
        </ComposedChart>
      </ResponsiveContainer>
      : null
  )
}
