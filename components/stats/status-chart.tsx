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

type StatusChartProps = {
  status?: {
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

const RADIAN = Math.PI / 180

function getLabelPosition (offset: number, midAngle: number): string {
  if (midAngle < (90 - offset) || midAngle > (360 - offset)) {
    return 'start'
  }
  if (midAngle > (90 + offset) && midAngle < (270 - offset)) {
    return 'end'
  }
  return 'center'
}

function PercentLabel ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  scheme
}: {
  cx: number,
  cy: number,
  midAngle: number,
  outerRadius: number,
  percent: number,
  scheme: 'dark'|'light'
}) {
  const radius = outerRadius + 30
  const offset = 30 // degrees
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text
      x={x} y={y}
      fill={scheme === 'dark' ? 'white' : 'black'}
      textAnchor={getLabelPosition(offset, midAngle)}
      fontSize={14}
      fontWeight={600}
      dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function StatusChart ({ status }: StatusChartProps) {
  const data = status?.map(stat => ({
    name: capitalize(stat.status),
    fill: getFillColor(stat.status),
    totalHours: stat._sum.totalHours,
    avgHours: stat._avg.totalHours,
    count: stat._count._all
  }))
  const { colorScheme } = useColorScheme()
  return (
    Array.isArray(data)
      ? <div className="w-full h-full flex">
          <ResponsiveContainer width="50%" height="100%">
            <PieChart>
              <Pie
                data={data}
                nameKey="name"
                dataKey="totalHours"
                cx="50%"
                cy="50%"
                innerRadius="30%"
                outerRadius="55%"
                label={entry => <PercentLabel {...entry} scheme={colorScheme} />}>
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
            </PieChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="50%" height="100%">
            <PieChart>
              <Pie
                data={data}
                nameKey="name"
                dataKey="count"
                cx="50%"
                cy="50%"
                spacing={10}
                innerRadius="30%"
                outerRadius="55%"
                label={entry => <PercentLabel {...entry} scheme={colorScheme} />}>
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
        </div>
      : null
  )
}
