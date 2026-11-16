"use client"

import {
  PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from "recharts"

export type SektorChartPoint = { name: string; value: number; color: string }
export type TrenChartPoint = { bulan: string; ecrs: number }

const DEFAULT_SEKTOR: SektorChartPoint[] = [
  { name: "Manufaktur", value: 2340, color: "#10b981" },
  { name: "Perdagangan", value: 2410, color: "#3b82f6" },
  { name: "Konstruksi", value: 1890, color: "#f59e0b" },
  { name: "Transportasi", value: 1680, color: "#8b5cf6" },
  { name: "Pertanian", value: 1850, color: "#ec4899" },
  { name: "Lainnya", value: 4830, color: "#64748b" },
]

const DEFAULT_TREN: TrenChartPoint[] = [
  { bulan: "Nov '25", ecrs: 68.2 },
  { bulan: "Des '25", ecrs: 67.5 },
  { bulan: "Jan '26", ecrs: 66.8 },
  { bulan: "Feb '26", ecrs: 65.1 },
  { bulan: "Mar '26", ecrs: 64.3 },
  { bulan: "Apr '26", ecrs: 63.8 },
  { bulan: "Mei '26", ecrs: 62.9 },
  { bulan: "Jun '26", ecrs: 62.1 },
  { bulan: "Jul '26", ecrs: 61.4 },
  { bulan: "Agu '26", ecrs: 60.8 },
  { bulan: "Sep '26", ecrs: 60.2 },
  { bulan: "Okt '26", ecrs: 59.8 },
]

export function GeoCharts({
  type,
  sektorData,
  trenData,
}: {
  type: "sektor" | "tren"
  sektorData?: SektorChartPoint[]
  trenData?: TrenChartPoint[]
}) {
  if (type === "sektor") {
    const data =
      sektorData && sektorData.length > 0 ? sektorData : DEFAULT_SEKTOR

    return (
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={75}
              paddingAngle={2}
              dataKey="value"
              animationDuration={1200}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "11px",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              }}
              formatter={(v: number) => [
                v.toLocaleString("id-ID") + " BU",
                "Jumlah",
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-1 mt-2">
          {data.map((s) => (
            <div
              key={s.name}
              className="flex items-center gap-1.5 text-[10px]"
            >
              <span
                className="h-2 w-2 rounded-sm"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-muted-foreground truncate">{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const points =
    trenData && trenData.length > 0 ? trenData : DEFAULT_TREN
  const ecrsValues = points.map((p) => p.ecrs)
  const minY = Math.max(0, Math.floor(Math.min(...ecrsValues) - 5))
  const maxY = Math.ceil(Math.max(...ecrsValues) + 5)

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="trenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="bulan"
            tick={{ fontSize: 9, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 9, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            domain={[minY, maxY]}
          />
          <Tooltip
            contentStyle={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "11px",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            }}
            formatter={(v: number) => [v.toFixed(1), "Indeks Risiko"]}
          />
          <Area
            type="monotone"
            dataKey="ecrs"
            stroke="#10b981"
            strokeWidth={2.5}
            fill="url(#trenGradient)"
            animationDuration={1500}
            dot={{ r: 3, fill: "#10b981", strokeWidth: 2, stroke: "white" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}