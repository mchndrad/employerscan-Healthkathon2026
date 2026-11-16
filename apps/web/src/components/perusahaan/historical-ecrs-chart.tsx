"use client"

import { Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface HistoricalEcrsChartProps {
  data: Array<{ month: string; score: number; tier: string }>
}

export function HistoricalEcrsChart({ data }: HistoricalEcrsChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Threshold reference lines */}
          <ReferenceLine y={30} stroke="#10b981" strokeDasharray="4 4" strokeOpacity={0.4} />
          <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.4} />
          <ReferenceLine y={70} stroke="#f97316" strokeDasharray="4 4" strokeOpacity={0.4} />

          <XAxis
            dataKey="month"
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
          />
          <YAxis
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            domain={[0, 100]}
            ticks={[0, 30, 50, 70, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "none",
              borderRadius: 8,
              color: "white",
              fontSize: 11,
            }}
            formatter={(value: any, name: any, props: any) => [
              `${value} (${props.payload.tier})`,
              "ECRS Score",
            ]}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ fill: "#ef4444", r: 5, strokeWidth: 2, stroke: "white" }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}