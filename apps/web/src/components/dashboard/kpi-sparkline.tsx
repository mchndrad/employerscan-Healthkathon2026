"use client"

import { Area, AreaChart, ResponsiveContainer } from "recharts"

interface KpiSparklineProps {
  data: number[]
  color: "primary" | "destructive" | "chart-4"
}

export function KpiSparkline({ data, color }: KpiSparklineProps) {
  const chartData = data.map((value, index) => ({ index, value }))

  const colorMap = {
    primary: "oklch(0.60 0.17 155)",
    destructive: "oklch(0.55 0.22 25)",
    "chart-4": "oklch(0.70 0.17 55)",
  }

  const strokeColor = colorMap[color]
  const gradientId = `sparkline-gradient-${color}`

  return (
    <div className="h-10 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.4} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={false}
            isAnimationActive={true}
            animationDuration={1200}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}