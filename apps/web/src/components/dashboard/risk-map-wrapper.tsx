"use client"

import dynamic from "next/dynamic"
import type { ProvinceData } from "@/lib/data/provinces"

const RiskMapClient = dynamic(
  () => import("./risk-map").then((mod) => mod.RiskMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-80 rounded-lg bg-muted/30 border border-border flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 mx-auto rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-xs text-muted-foreground">Memuat peta Indonesia...</p>
        </div>
      </div>
    ),
  },
)

export function RiskMap(props: {
  height?: string
  provincesData?: Record<string, ProvinceData>
}) {
  return <RiskMapClient {...props} />
}