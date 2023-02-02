import React from 'react'
import { capitalize } from '../../utils/strings'
import { useColorScheme } from '../../hooks/color'
import {
  Cell,
  Pie,
  Label,
  PieChart,
  ResponsiveContainer
} from 'recharts'

type GamesChartProps = {
  games?: {
    status: string,
    _count: { _all: number | null },
    _avg: { totalHours: number | null },
    _sum: { totalHours: number | null }
  }[]
}

function getFillColor (status: string): string[] {
  // Get [light, dark] colors
  switch (status) {
    case 'finished':
      return ['#22c55e', '#166534']
    case 'abandoned':
      return ['#ef4444', '#991b1b']
    case 'pending':
    default:
      return ['#64748b', '#1e293b']
  }
}

export default function GamesChart ({ games }: GamesChartProps) {
  const data = games?.map(stat => ({
    name: capitalize(stat.status),
    fill: getFillColor(stat.status),
    totalHours: stat._sum.totalHours,
    avgHours: stat._avg.totalHours,
    count: stat._count._all
  }))
  const { colorScheme } = useColorScheme()
  return (
    Array.isArray(data)
      ? <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            nameKey="name"
            dataKey="totalHours"
            cx="25%"
            cy="50%"
            innerRadius="30%"
            outerRadius="60%">
              {data.map((entry, index) =>
                <Cell
                  key={`cell-${index}`}
                  fill={colorScheme === 'dark' ? entry.fill[1] : entry.fill[0]}
                  fillOpacity={0.8}
                  stroke={colorScheme === 'dark' ? entry.fill[1] : entry.fill[0]}
                  strokeWidth={3} />
              )}
            <Label
              value="Time"
              position="center"
              fontSize="14"
              fontWeight="600"
              fill={colorScheme === 'dark' ? 'white' : 'black'} />
          </Pie>
          <Pie
            data={data}
            nameKey="name"
            dataKey="count"
            cx="75%"
            cy="50%"
            spacing={10}
            innerRadius="30%"
            outerRadius="60%">
              {data.map((entry, index) =>
                <Cell
                  key={`cell-${index}`}
                  fill={colorScheme === 'dark' ? entry.fill[1] : entry.fill[0]}
                  fillOpacity={0.8}
                  stroke={colorScheme === 'dark' ? entry.fill[1] : entry.fill[0]}
                  strokeWidth={3} />
              )}
              <Label
                value="Games"
                position="center"
                fontSize="14"
                fontWeight="600"
                fill={colorScheme === 'dark' ? 'white' : 'black'} />
            </Pie>
        </PieChart>
      </ResponsiveContainer>
      : null
  )
}
