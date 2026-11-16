"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from "recharts"

const calibrationData = [
  { pred: 0.0, perfect: 0.0, overall: 0.00, mikro: 0.00, besar: 0.00, papua: 0.00 },
  { pred: 0.1, perfect: 0.1, overall: 0.09, mikro: 0.11, besar: 0.08, papua: 0.13 },
  { pred: 0.2, perfect: 0.2, overall: 0.19, mikro: 0.22, besar: 0.18, papua: 0.24 },
  { pred: 0.3, perfect: 0.3, overall: 0.28, mikro: 0.33, besar: 0.27, papua: 0.35 },
  { pred: 0.4, perfect: 0.4, overall: 0.38, mikro: 0.43, besar: 0.37, papua: 0.44 },
  { pred: 0.5, perfect: 0.5, overall: 0.49, mikro: 0.53, besar: 0.48, papua: 0.54 },
  { pred: 0.6, perfect: 0.6, overall: 0.59, mikro: 0.63, besar: 0.58, papua: 0.63 },
  { pred: 0.7, perfect: 0.7, overall: 0.70, mikro: 0.73, besar: 0.69, papua: 0.72 },
  { pred: 0.8, perfect: 0.8, overall: 0.81, mikro: 0.82, besar: 0.80, papua: 0.82 },
  { pred: 0.9, perfect: 0.9, overall: 0.91, mikro: 0.91, besar: 0.90, papua: 0.91 },
  { pred: 1.0, perfect: 1.0, overall: 1.00, mikro: 1.00, besar: 1.00, papua: 1.00 },
]

export function CalibrationChart() {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={calibrationData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="pred"
            type="number"
            domain={[0, 1]}
            tick={{ fontSize: 10, fill: "#64748b" }}
            label={{ value: "Predicted Probability", position: "insideBottom", offset: -10, fontSize: 11, fill: "#475569" }}
          />
          <YAxis
            type="number"
            domain={[0, 1]}
            tick={{ fontSize: 10, fill: "#64748b" }}
            label={{ value: "Observed Frequency", angle: -90, position: "insideLeft", fontSize: 11, fill: "#475569" }}
          />
          <Tooltip
            contentStyle={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "11px",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
          <Line type="monotone" dataKey="perfect" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1.5} dot={false} name="Perfect Calibration" />
          <Line type="monotone" dataKey="overall" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Overall Model" />
          <Line type="monotone" dataKey="mikro" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Mikro BU" />
          <Line type="monotone" dataKey="besar" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="Besar BU" />
          <Line type="monotone" dataKey="papua" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Maluku & Papua" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}