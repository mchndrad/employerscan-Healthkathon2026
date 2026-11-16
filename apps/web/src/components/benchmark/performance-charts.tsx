"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Line, ComposedChart } from "recharts"

const rocData = [
  { fpr: 0, tpr: 0, baseline: 0 },
  { fpr: 0.02, tpr: 0.42, baseline: 0.02 },
  { fpr: 0.05, tpr: 0.68, baseline: 0.05 },
  { fpr: 0.08, tpr: 0.81, baseline: 0.08 },
  { fpr: 0.12, tpr: 0.89, baseline: 0.12 },
  { fpr: 0.18, tpr: 0.93, baseline: 0.18 },
  { fpr: 0.25, tpr: 0.96, baseline: 0.25 },
  { fpr: 0.35, tpr: 0.98, baseline: 0.35 },
  { fpr: 0.50, tpr: 0.99, baseline: 0.50 },
  { fpr: 0.75, tpr: 0.995, baseline: 0.75 },
  { fpr: 1.0, tpr: 1.0, baseline: 1.0 },
]

export function PerformanceCharts() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={rocData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id="rocGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="fpr"
            type="number"
            domain={[0, 1]}
            tick={{ fontSize: 10, fill: "#64748b" }}
            label={{ value: "False Positive Rate", position: "insideBottom", offset: -10, fontSize: 11, fill: "#475569" }}
          />
          <YAxis
            type="number"
            domain={[0, 1]}
            tick={{ fontSize: 10, fill: "#64748b" }}
            label={{ value: "True Positive Rate", angle: -90, position: "insideLeft", fontSize: 11, fill: "#475569" }}
          />
          <Tooltip
            contentStyle={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "11px",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            }}
            formatter={(v: number, name: string) => [v.toFixed(3), name === "tpr" ? "ECRS v4.2" : "Random Baseline"]}
          />
          <ReferenceLine y={0.5} stroke="#cbd5e1" strokeDasharray="2 2" />
          <Area
            type="monotone"
            dataKey="tpr"
            stroke="#10b981"
            strokeWidth={3}
            fill="url(#rocGradient)"
            animationDuration={1500}
          />
          <Line
            type="monotone"
            dataKey="baseline"
            stroke="#94a3b8"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            dot={false}
            animationDuration={2000}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}