// @ts-nocheck
"use client"

import { useRef, useState } from "react"
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"
import { getProvinceData, getTierColor, type ProvinceData } from "@/lib/data/provinces"

const GEO_URL = "/geo/indonesia.json"

interface Tooltip {
  x: number
  y: number
  data: ProvinceData
}

interface HoverState {
  name: string
  x: number
  y: number
  isData: boolean
}

function matchProvinceName(raw: string): string | null {
  if (!raw) return null
  const normalized = raw.toUpperCase().trim()
  const aliases: Record<string, string> = {
    "JAKARTA RAYA": "DKI JAKARTA",
    JAKARTA: "DKI JAKARTA",
    "DAERAH KHUSUS IBUKOTA JAKARTA": "DKI JAKARTA",
    YOGYAKARTA: "DI YOGYAKARTA",
    "DAERAH ISTIMEWA YOGYAKARTA": "DI YOGYAKARTA",
    "BANGKA BELITUNG": "KEPULAUAN BANGKA BELITUNG",
    "BANGKA-BELITUNG": "KEPULAUAN BANGKA BELITUNG",
    "KEPULAUAN BANGKA-BELITUNG": "KEPULAUAN BANGKA BELITUNG",
    "KEP. BANGKA BELITUNG": "KEPULAUAN BANGKA BELITUNG",
    "KEP. RIAU": "KEPULAUAN RIAU",
    NTB: "NUSA TENGGARA BARAT",
    NTT: "NUSA TENGGARA TIMUR",
    "IRIAN JAYA BARAT": "PAPUA BARAT",
    "WEST JAVA": "JAWA BARAT",
    "CENTRAL JAVA": "JAWA TENGAH",
    "EAST JAVA": "JAWA TIMUR",
    "WEST PAPUA": "PAPUA BARAT",
    "WEST KALIMANTAN": "KALIMANTAN BARAT",
    "CENTRAL KALIMANTAN": "KALIMANTAN TENGAH",
    "SOUTH KALIMANTAN": "KALIMANTAN SELATAN",
    "EAST KALIMANTAN": "KALIMANTAN TIMUR",
    "NORTH KALIMANTAN": "KALIMANTAN UTARA",
    "WEST NUSA TENGGARA": "NUSA TENGGARA BARAT",
    "EAST NUSA TENGGARA": "NUSA TENGGARA TIMUR",
    "WEST SULAWESI": "SULAWESI BARAT",
    "CENTRAL SULAWESI": "SULAWESI TENGAH",
    "SOUTH SULAWESI": "SULAWESI SELATAN",
    "SOUTHEAST SULAWESI": "SULAWESI TENGGARA",
    "SOUTH EAST SULAWESI": "SULAWESI TENGGARA",
    "NORTH SULAWESI": "SULAWESI UTARA",
    "WEST SUMATRA": "SUMATERA BARAT",
    "WEST SUMATERA": "SUMATERA BARAT",
    "SOUTH SUMATRA": "SUMATERA SELATAN",
    "SOUTH SUMATERA": "SUMATERA SELATAN",
    "NORTH SUMATRA": "SUMATERA UTARA",
    "NORTH SUMATERA": "SUMATERA UTARA",
    "NORTH MALUKU": "MALUKU UTARA",
    "RIAU ISLANDS": "KEPULAUAN RIAU",
    "RIAU ARCHIPELAGO": "KEPULAUAN RIAU",
    "SPECIAL REGION OF YOGYAKARTA": "DI YOGYAKARTA",
    "SPECIAL CAPITAL REGION OF JAKARTA": "DKI JAKARTA",
  }
  return aliases[normalized] ?? normalized
}

export function RiskMap({
  height = "500px",
  provincesData,
}: {
  height?: string
  provincesData?: Record<string, ProvinceData>
} = {}) {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null)
  const [hovered, setHovered] = useState<HoverState | null>(null)
  const hoveredProvinceRef = useRef<string | null>(null)

  const resetAll = () => {
    setTooltip(null)
    setHovered(null)
    hoveredProvinceRef.current = null
  }

  // Lookup: prop (real data) → static fallback (backwards compat)
  const lookupData = (name: string): ProvinceData | null => {
    if (!name) return null
    const upper = name.toUpperCase().trim()
    if (provincesData && provincesData[upper]) return provincesData[upper]
    return getProvinceData(name)
  }

  return (
    <div
      onMouseLeave={resetAll}
      style={{
        position: "relative",
        width: "100%",
        height: height,
        borderRadius: "16px",
        backgroundColor: "#030712",
        backgroundImage: `
          radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 20% 80%, rgba(0,91,172,0.1) 0%, transparent 50%),
          radial-gradient(ellipse at 85% 20%, rgba(239,68,68,0.06) 0%, transparent 45%)
        `,
        border: "1px solid rgba(255,255,255,0.1)",
        overflow: "hidden",
        boxShadow:
          "0 25px 60px rgba(0,0,0,0.5), inset 0 2px 20px rgba(255,255,255,0.03)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 1300, center: [118, -2.5] }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <ZoomableGroup zoom={1} minZoom={0.8} maxZoom={5}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) => {
              return geographies.map((geo) => {
                const rawName =
                  geo.properties.NAME_1 ||
                  geo.properties.name ||
                  geo.properties.Propinsi ||
                  geo.properties.name_en ||
                  geo.properties.state ||
                  geo.properties.NAME ||
                  geo.properties.PROVINCE ||
                  ""

                const normalizedName = matchProvinceName(rawName)
                const data = normalizedName ? lookupData(normalizedName) : null
                const baseColor = data ? getTierColor(data.tier) : "#475569"
                const fillColor = baseColor + "30"
                const strokeColor = baseColor

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={1.2}
                    style={{
                      default: {
                        outline: "none",
                        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                        filter: `drop-shadow(0 0 4px ${baseColor}50)`,
                      },
                      hover: {
                        outline: "none",
                        cursor: "pointer",
                        fill: baseColor + "dd",
                        stroke: "#ffffff",
                        strokeWidth: 2,
                        filter: `drop-shadow(0 0 18px ${baseColor}) brightness(1.3)`,
                      },
                      pressed: { outline: "none" },
                    }}
                    onMouseEnter={(evt) => {
                      if (hoveredProvinceRef.current !== rawName) {
                        hoveredProvinceRef.current = rawName
                        const displayName = data ? data.name : rawName
                        setHovered({
                          name: displayName,
                          x: evt.clientX,
                          y: evt.clientY,
                          isData: !!data,
                        })
                        if (data) {
                          setTooltip({ x: evt.clientX, y: evt.clientY, data })
                        } else {
                          setTooltip(null)
                        }
                      }
                    }}
                    onMouseMove={(evt) => {
                      if (hoveredProvinceRef.current === rawName) {
                        if (data) {
                          setTooltip({ x: evt.clientX, y: evt.clientY, data })
                        }
                        setHovered((prev) =>
                          prev ? { ...prev, x: evt.clientX, y: evt.clientY } : null,
                        )
                      }
                    }}
                    onMouseLeave={() => {
                      if (hoveredProvinceRef.current === rawName) {
                        resetAll()
                      }
                    }}
                  />
                )
              })
            }}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {hovered && !hovered.isData && (
        <div
          style={{
            position: "fixed",
            zIndex: 40,
            left: hovered.x + 14,
            top: hovered.y - 10,
            background: "rgba(255,255,255,0.95)",
            color: "#0f172a",
            padding: "6px 12px",
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 700,
            pointerEvents: "none",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          📍 {hovered.name}
        </div>
      )}

      {tooltip && (
        <div
          style={{
            position: "fixed",
            zIndex: 50,
            left: tooltip.x + 14,
            top: tooltip.y + 14,
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(3,7,18,0.98) 100%)",
            color: "#fff",
            padding: "16px 18px",
            borderRadius: 14,
            boxShadow:
              "0 25px 70px rgba(0,0,0,0.7), 0 0 0 1px " +
              getTierColor(tooltip.data.tier) +
              "40",
            minWidth: "260px",
            pointerEvents: "none",
            backdropFilter: "blur(16px)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              paddingBottom: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>📍</span>
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em" }}>
                {tooltip.data.name}
              </span>
            </div>
            <span
              style={{
                fontSize: 9,
                padding: "4px 12px",
                borderRadius: 20,
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#fff",
                backgroundColor: getTierColor(tooltip.data.tier),
                boxShadow: "0 0 20px " + getTierColor(tooltip.data.tier),
              }}
            >
              {tooltip.data.tier}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11 }}>
              <span style={{ opacity: 0.6 }}>ECRS Score</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 70, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                  <div
                    style={{
                      width: tooltip.data.ecrs + "%",
                      height: "100%",
                      backgroundColor: getTierColor(tooltip.data.tier),
                      boxShadow: "0 0 10px " + getTierColor(tooltip.data.tier),
                    }}
                  />
                </div>
                <span style={{ fontWeight: 700, color: getTierColor(tooltip.data.tier), minWidth: 32, textAlign: "right" }}>
                  {tooltip.data.ecrs}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
              <span style={{ opacity: 0.6 }}>🏢 Total BU</span>
              <span style={{ fontWeight: 700 }}>{tooltip.data.totalBU.toLocaleString()}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
              <span style={{ opacity: 0.6 }}>⚠️ Kasus Kritis</span>
              <span style={{ fontWeight: 700, color: "#fca5a5" }}>{tooltip.data.kasusKritis}</span>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          color: "rgba(255,255,255,0.95)",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: 8,
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(12px)",
          padding: "8px 14px",
          borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.12)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            height: 7,
            width: 7,
            borderRadius: "50%",
            backgroundColor: "#10b981",
            boxShadow: "0 0 12px #10b981",
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
        LIVE MONITORING · 34 PROVINSI
      </div>

      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(12px)",
          padding: "8px 14px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.12)",
          display: "flex",
          gap: 12,
          fontSize: 10,
          color: "rgba(255,255,255,0.85)",
          fontWeight: 600,
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        {[
          { label: "Rendah", color: "#10b981" },
          { label: "Sedang", color: "#f59e0b" },
          { label: "Tinggi", color: "#f97316" },
          { label: "Kritis", color: "#ef4444" },
        ].map((t) => (
          <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span
              style={{
                height: 9,
                width: 9,
                borderRadius: "50%",
                backgroundColor: t.color,
                boxShadow: `0 0 8px ${t.color}`,
              }}
            />
            {t.label}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 14,
          right: 14,
          fontSize: 10,
          color: "rgba(255,255,255,0.5)",
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(10px)",
          padding: "6px 12px",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.08)",
          fontWeight: 500,
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        🖱️ Scroll zoom · Hover untuk detail
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}