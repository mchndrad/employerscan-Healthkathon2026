"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Line, ComposedChart } from "recharts"

const data = [
  { month: "Jun '26", dp: 11.8, threshold: 5 },
  { month: "Jul '26", dp: 9.3, threshold: 5 },
  { month: "Aug '26", dp: 7.1, threshold: 5 },
  { month: "Sep '26", dp: 5.4, threshold: 5 },
  { month: "Oct '26", dp: 4.2, threshold: 5 },
]

export function FairnessJourneyChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id="dpGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.5} />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
            domain={[0, 14]}
          />
          <Tooltip
            contentStyle={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              fontSize: "11px",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
            }}
            formatter={(v: number) => [`${v}%`, "Demographic Parity"]}
          />
          <ReferenceLine
            y={5}
            stroke="#ef4444"
            strokeDasharray="4 4"
            label={{ value: "Threshold 5%", fill: "#ef4444", fontSize: 10, position: "right" }}
          />
          <Area
            type="monotone"
            dataKey="dp"
            stroke="#10b981"
            strokeWidth={3}
            fill="url(#dpGradient)"
            animationDuration={2000}
            dot={{ r: 6, fill: "#10b981", strokeWidth: 3, stroke: "white" }}
            activeDot={{ r: 8, fill: "#10b981", strokeWidth: 3, stroke: "white" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}