import Link from "next/link"
import { cn } from "cn"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChevronRight, Download, Layers, TrendingDown,
  Sparkles, Quote, ArrowRight, Globe2, AlertTriangle,
  BookOpen, Filter, CheckCircle2,
} from "lucide-react"
import { RiskMap } from "@/components/dashboard/risk-map-wrapper"
import { GeoCharts, type SektorChartPoint, type TrenChartPoint } from "@/components/geo/geo-charts"
import {
  getGeoAggregate,
  getSektorAggregate,
  getMonthlyTrend,
  getDashboardAggregate,
  getTopRiskCompaniesByProvince,
  getKotaBreakdownByProvince,
} from "@/lib/supabase-queries"
import { tierFromEcrs, type ProvinceData } from "@/lib/data/provinces"

export const revalidate = 60

const SEKTOR_COLORS = [
  "#10b981", "#3b82f6", "#f59e0b", "#8b5cf6",
  "#ec4899", "#06b6d4", "#f97316", "#14b8a6",
  "#64748b", "#ef4444",
]

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]

export default async function GeoIntelligencePage() {
  // Fetch semua agregat paralel
  const [geoAgg, sektorAgg, monthlyTrend, dashStats] = await Promise.all([
    getGeoAggregate(),
    getSektorAggregate(),
    getMonthlyTrend(),
    getDashboardAggregate(),
  ])

  // Build provinces map untuk RiskMap
  const provincesData: Record<string, ProvinceData> = {}
  geoAgg.forEach((agg) => {
    provincesData[agg.provinsi.toUpperCase().trim()] = {
      name: agg.provinsi,
      ecrs: Math.round(agg.avgEcrs),
      totalBU: agg.totalBU,
      kasusKritis: agg.kritis,
      tier: tierFromEcrs(agg.avgEcrs),
    }
  })

  // Classify tier per provinsi untuk hero monolith
  const tierCounts = { kritis: 0, tinggi: 0, sedang: 0, rendah: 0 }
  geoAgg.forEach((agg) => {
    const t = tierFromEcrs(agg.avgEcrs)
    tierCounts[t]++
  })
  const berisikoCount = tierCounts.tinggi + tierCounts.sedang
  const amanCount = tierCounts.rendah

  // Province of focus: provinsi dengan ECRS tertinggi
  const focusProvince = [...geoAgg].sort((a, b) => b.avgEcrs - a.avgEcrs)[0]
  const [focusTopBU, focusBreakdown] = focusProvince
    ? await Promise.all([
        getTopRiskCompaniesByProvince(focusProvince.provinsi, 3),
        getKotaBreakdownByProvince(focusProvince.provinsi),
      ])
    : [[], []]

  const focusData = focusProvince
    ? {
        name: focusProvince.provinsi,
        priority: tierFromEcrs(focusProvince.avgEcrs) === "kritis" ? "PRIORITAS 1" : "PERHATIAN",
        ecrs: Math.round(focusProvince.avgEcrs),
        tier: tierFromEcrs(focusProvince.avgEcrs).toUpperCase(),
        totalBu: focusProvince.totalBU,
        criticalBu: focusProvince.kritis,
        compliantBu: focusProvince.rendah + focusProvince.sedang,
        totalPekerja: focusProvince.totalKaryawan,
        topKritis: focusTopBU.map((bu) => ({
          name: bu.nama,
          ecrs: Math.round(bu.ecrs_score),
          wilayah: bu.kota,
        })),
        breakdown: focusBreakdown,
      }
    : null

  // Top 5 provinsi dengan ECRS tertinggi
  const topProvinsi = [...geoAgg]
    .sort((a, b) => b.avgEcrs - a.avgEcrs)
    .slice(0, 5)
    .map((p) => ({
      name: p.provinsi,
      ecrs: Math.round(p.avgEcrs),
      bu: p.totalBU,
    }))

  // Chart data
  const sektorChart: SektorChartPoint[] = sektorAgg.slice(0, 6).map((s, i) => ({
    name: s.sektor,
    value: s.totalBU,
    color: SEKTOR_COLORS[i] ?? "#64748b",
  }))

  const trenChart: TrenChartPoint[] = monthlyTrend.map((m) => ({
    bulan: `${MONTH_SHORT[m.bulan - 1]} '${String(m.tahun).slice(-2)}`,
    ecrs: Math.round(Math.min(100, m.totalWajib > 0 ? (m.totalTunggakan / m.totalWajib) * 100 : 0) * 10) / 10,
  }))

  // Format total pekerja (M = juta, K = ribu)
  const fmtPekerja = (n: number): string => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
    return n.toLocaleString("id-ID")
  }

  // AI advisor numbers dari real data
  const top2Kritis = [...geoAgg]
    .sort((a, b) => b.kritis - a.kritis)
    .slice(0, 2)
  const estimasiPenyelamatan = dashStats.totalTunggakan * 0.6 // 60% estimasi recovery

  return (
    <div className="space-y-10 animate-in fade-in-0 duration-500">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-semibold">Geo-Intelligence</span>
      </div>

      {/* ============== EDITORIAL HERO ============== */}
      <section className="relative py-6 animate-in fade-in-0 slide-in-from-top-2 duration-700">
        <div className="absolute -top-10 -left-10 h-80 w-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-0 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Geographic Intelligence · Peta Nasional ECRS
              </span>
              <div className="h-px flex-1 bg-linear-to-r from-primary/30 to-transparent max-w-24" />
            </div>

            <h1 className="font-heading text-6xl lg:text-7xl text-foreground tracking-tight leading-[0.95]">
              <span className="italic font-light text-slate-400">Dari Sabang</span>
              <br />
              <span className="font-normal">hingga </span>
              <span className="font-bold text-primary">Merauke</span>
              <span className="text-amber-500">.</span>
            </h1>

            <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
              {geoAgg.length} provinsi dalam satu peta. Dari BU mikro di pedalaman hingga enterprise di pusat kota —
              <strong className="text-foreground"> {dashStats.totalBU.toLocaleString("id-ID")} titik</strong> dipantau secara agregat, terkomputasi lewat model ECRS v4.2.
            </p>

            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <Button variant="outline" size="sm" className="gap-1.5 shadow-sm hover:shadow-md transition-shadow">
                <Download className="h-3.5 w-3.5" />
                Ekspor GeoJSON
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 shadow-sm hover:shadow-md transition-shadow">
                <Layers className="h-3.5 w-3.5" />
                Toggle Lapisan
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 shadow-sm hover:shadow-md transition-shadow">
                <Filter className="h-3.5 w-3.5" />
                Filter Lanjutan
              </Button>
            </div>
          </div>

          {/* Province Monolith */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative group">
              <div className="absolute -inset-4 bg-linear-to-br from-primary/20 via-blue-200/40 to-transparent blur-2xl group-hover:blur-3xl transition-all duration-700" />
              <div className="relative bg-white rounded-3xl p-8 border shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 w-80">
                <div className="flex items-center justify-between mb-6">
                  <Badge className="bg-primary text-white border-0 gap-1 text-[9px] font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    LIVE PANTAU
                  </Badge>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                    GADM 2026
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="font-heading text-8xl font-bold text-foreground tabular-nums leading-none">{geoAgg.length}</span>
                  <div className="pb-2">
                    <p className="font-heading text-2xl italic font-light text-primary">provinsi</p>
                    <p className="text-[10px] text-muted-foreground">terintegrasi</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t">
                  <div className="text-center group/stat">
                    <p className="font-heading text-xl font-bold text-red-600 tabular-nums">{tierCounts.kritis}</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Kritis</p>
                    <div className="h-0.5 w-full bg-red-500 mt-1 rounded-full opacity-60" />
                  </div>
                  <div className="text-center">
                    <p className="font-heading text-xl font-bold text-amber-600 tabular-nums">{berisikoCount}</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Berisiko</p>
                    <div className="h-0.5 w-full bg-amber-500 mt-1 rounded-full opacity-60" />
                  </div>
                  <div className="text-center">
                    <p className="font-heading text-xl font-bold text-primary tabular-nums">{amanCount}</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Aman</p>
                    <div className="h-0.5 w-full bg-primary mt-1 rounded-full opacity-60" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== FILTER STRIP ============== */}
      <section className="animate-in fade-in-0 slide-in-from-bottom-2 duration-700" style={{ animationDelay: "200ms", animationFillMode: "backwards" }}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-2">View:</span>
          {["Choropleth", "Heatmap", "Clusters"].map((v, i) => (
            <Badge key={v} className={cn(
              "cursor-pointer transition-all hover:scale-105",
              i === 0 ? "bg-primary text-white border-0" : "bg-white border text-foreground hover:border-primary/50"
            )}>
              {v}
            </Badge>
          ))}
          <div className="h-6 w-px bg-border mx-2" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-2">Tier:</span>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: "#10b981" }} />
            <span className="text-[10px] text-muted-foreground">Aman</span>
            <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: "#f59e0b" }} />
            <span className="text-[10px] text-muted-foreground">Perhatian</span>
            <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: "#f97316" }} />
            <span className="text-[10px] text-muted-foreground">Berisiko</span>
            <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: "#ef4444" }} />
            <span className="text-[10px] text-muted-foreground">Kritis</span>
          </div>
        </div>
      </section>

      {/* ============== THE MAP + PROVINCE DETAIL ============== */}
      <section className="animate-in fade-in-0 slide-in-from-bottom-3 duration-700" style={{ animationDelay: "300ms", animationFillMode: "backwards" }}>
        <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">The Territory</p>
            <h2 className="font-heading text-3xl font-normal">
              Setiap provinsi, <span className="italic font-light text-slate-500">dipetakan</span>.
            </h2>
          </div>
          <p className="text-xs text-muted-foreground max-w-sm">
            Pilih provinsi untuk melihat detail — ECRS tier, breakdown wilayah, dan BU paling kritis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-500">
              <RiskMap height="700px" provincesData={provincesData} />
            </Card>
          </div>

          <div className="lg:col-span-1">
            {focusData && (
              <Card className="h-full overflow-hidden relative hover:shadow-xl transition-shadow duration-500 bg-linear-to-br from-red-50/50 via-white to-white border-red-200/60">
                <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-red-200/40 blur-3xl pointer-events-none" />

                <CardContent className="pt-5 space-y-4 relative">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge className="bg-red-500 text-white border-0 text-[9px] font-bold mb-2">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {focusData.priority}
                      </Badge>
                      <h3 className="font-heading text-2xl font-bold text-foreground">{focusData.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {focusData.breakdown.length} kota/kabupaten · Fokus audit Q4
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center py-4">
                    <div className="relative w-32 h-32">
                      <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#fecaca" strokeWidth="8" />
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#dc2626" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(focusData.ecrs / 100) * 264} 264`} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="font-heading text-3xl font-bold text-red-600 tabular-nums leading-none">{focusData.ecrs}</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-1">ECRS</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <StatBoxSmall label="Total BU" value={focusData.totalBu.toLocaleString("id-ID")} color="slate" />
                    <StatBoxSmall label="BU Kritis" value={focusData.criticalBu.toLocaleString("id-ID")} color="red" />
                    <StatBoxSmall label="BU Patuh" value={focusData.compliantBu.toLocaleString("id-ID")} color="primary" />
                    <StatBoxSmall label="Pekerja JKN" value={fmtPekerja(focusData.totalPekerja)} color="amber" />
                  </div>

                  {focusData.breakdown.length > 0 && (
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Breakdown Wilayah</p>
                      <div className="space-y-1.5">
                        {focusData.breakdown.map((w) => (
                          <div key={w.wilayah} className="flex items-center justify-between gap-2 text-xs hover:bg-slate-50 p-1.5 rounded transition-colors">
                            <span className="text-foreground truncate">{w.wilayah}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-muted-foreground tabular-nums">{w.bu}</span>
                              <Badge className={cn("text-[8px] font-bold border-0", w.ecrs > 75 ? "bg-red-100 text-red-700" : w.ecrs > 50 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700")}>
                                {w.ecrs}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {focusData.topKritis.length > 0 && (
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Top 3 BU Kritis</p>
                      <div className="space-y-1.5">
                        {focusData.topKritis.map((bu, i) => (
                          <div key={bu.name} className="flex items-start gap-2 p-2 rounded-lg bg-red-50/50 hover:bg-red-50 border border-red-100 transition-all cursor-pointer group">
                            <span className="font-heading text-sm font-bold text-red-600 tabular-nums shrink-0">#{i + 1}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-bold text-foreground truncate group-hover:text-red-700 transition-colors">{bu.name}</p>
                              <p className="text-[9px] text-muted-foreground">{bu.wilayah}</p>
                            </div>
                            <span className="font-heading text-base font-bold text-red-600 tabular-nums">{bu.ecrs}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button size="sm" className="w-full gap-1.5 bg-red-600 hover:bg-red-700 text-white">
                    Deep Dive {focusData.name}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* ============== 3 BOTTOM CHARTS ============== */}
      <section className="animate-in fade-in-0 slide-in-from-bottom-3 duration-700" style={{ animationDelay: "500ms", animationFillMode: "backwards" }}>
        <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">National Snapshot</p>
            <h2 className="font-heading text-3xl font-normal">
              Potret <span className="italic font-light text-slate-500">nasional</span>.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-5 space-y-3">
              <div>
                <h3 className="font-heading text-base font-bold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Top 5 Provinsi <span className="italic font-light">Prioritas</span>
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">ECRS tertinggi · Fokus WASRIK Q4</p>
              </div>
              <div className="space-y-2.5">
                {topProvinsi.map((p, i) => (
                  <div key={p.name} className="group">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-sm font-bold text-slate-400 tabular-nums">#{i + 1}</span>
                        <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{p.name}</span>
                      </div>
                      <span className="font-heading text-base font-bold text-red-600 tabular-nums">{p.ecrs}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-linear-to-r from-red-400 to-red-600 transition-all duration-1000" style={{ width: `${p.ecrs}%` }} />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{p.bu.toLocaleString("id-ID")} BU</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-5 space-y-3">
              <div>
                <h3 className="font-heading text-base font-bold flex items-center gap-2">
                  <Globe2 className="h-4 w-4 text-primary" />
                  Distribusi <span className="italic font-light">Sektor</span>
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {sektorChart.length} sektor terbesar
                </p>
              </div>
              <GeoCharts type="sektor" sektorData={sektorChart} />
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-5 space-y-3">
              <div>
                <h3 className="font-heading text-base font-bold flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-primary" />
                  Tren Tunggakan <span className="italic font-light">Nasional</span>
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {monthlyTrend.length} bulan agregat
                </p>
              </div>
              <GeoCharts type="tren" trenData={trenChart} />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ============== AI ADVISOR ============== */}
      <section className="animate-in fade-in-0 slide-in-from-bottom-3 duration-700" style={{ animationDelay: "700ms", animationFillMode: "backwards" }}>
        <Card className="overflow-hidden relative bg-linear-to-br from-primary/5 via-white to-emerald-50/50 border-primary/30 hover:shadow-xl transition-shadow">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <CardContent className="pt-5 relative">
            <div className="flex items-start gap-4 flex-wrap">
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/30 hover:scale-110 hover:rotate-3 transition-transform">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h3 className="font-heading text-lg font-bold">
                    AI <span className="italic font-light">Geographic Advisor</span>
                  </h3>
                  <Badge className="bg-primary text-white border-0 text-[9px] gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    REKOMENDASI v4.2
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Prioritaskan audit lapangan di{" "}
                  {top2Kritis.length >= 1 && (
                    <strong className="text-foreground">
                      {top2Kritis[0].provinsi} ({top2Kritis[0].kritis.toLocaleString("id-ID")} BU kritis)
                    </strong>
                  )}
                  {top2Kritis.length >= 2 && (
                    <>
                      {" "}dan{" "}
                      <strong className="text-foreground">
                        {top2Kritis[1].provinsi} ({top2Kritis[1].kritis.toLocaleString("id-ID")} BU kritis)
                      </strong>
                    </>
                  )}.
                  {" "}Estimasi potensi recovery iuran{" "}
                  <strong className="text-primary">
                    Rp {(estimasiPenyelamatan / 1_000_000_000).toFixed(1)} miliar
                  </strong>
                  {" "}dalam periode berikutnya.
                </p>
              </div>
              <Button className="gap-1.5 bg-primary hover:bg-primary/90 shadow-md shrink-0">
                Terapkan Rekomendasi
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ============== MANIFESTO BOTTOM ============== */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-amber-50 via-stone-50 to-blue-50/40 border border-stone-200/80 p-8 lg:p-14 animate-in fade-in-0 slide-in-from-bottom-3 duration-700" style={{ animationDelay: "900ms", animationFillMode: "backwards" }}>
        <div className="absolute top-10 right-20 h-56 w-56 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-32 h-40 w-40 rounded-full bg-blue-200/30 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #78716c 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        <div className="absolute left-0 top-0 bottom-0 w-14 lg:w-20 border-r border-dashed border-stone-300/60 flex items-center justify-center">
          <div className="transform -rotate-90 whitespace-nowrap">
            <span className="font-heading text-[10px] tracking-[0.5em] font-bold text-stone-500 uppercase">
              Peta · Nasional · 2026
            </span>
          </div>
        </div>

        <div className="absolute top-6 right-6 lg:top-10 lg:right-10 z-10 hidden md:block">
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 rounded-full bg-amber-300/40 blur-xl group-hover:bg-amber-300/60 transition-all" />
            <div className="relative h-28 w-28 rounded-full border-3 border-stone-700 bg-amber-50 flex items-center justify-center shadow-xl rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <div className="h-24 w-24 rounded-full border border-stone-400 border-dashed flex items-center justify-center">
                <div className="text-center">
                  <p className="font-heading text-[8px] font-bold tracking-[0.2em] text-stone-700 uppercase leading-tight">
                    GADM<br />Verified
                  </p>
                  <div className="h-px w-10 bg-stone-400 my-1.5 mx-auto" />
                  <p className="font-heading text-sm font-bold italic text-primary">{geoAgg.length} PRV</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative pl-14 lg:pl-20 max-w-5xl">
          <div className="mb-10">
            <div className="flex items-start gap-4">
              <Quote className="h-12 w-12 lg:h-16 lg:w-16 text-amber-400 shrink-0 -mt-2" />
              <div>
                <h2 className="font-heading text-4xl lg:text-6xl text-stone-900 leading-none tracking-tight">
                  Keadilan bukan <span className="italic font-light text-stone-400">Jakarta</span>
                  <span className="font-normal">-sentris</span>
                  <span className="text-amber-500">.</span>
                </h2>
                <p className="text-[11px] font-bold text-stone-500 uppercase tracking-[0.25em] mt-4">
                  — EmployerScan Geographic Charter · Pasal 2
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-8 max-w-md">
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-stone-400 to-transparent" />
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-500">∴ {geoAgg.length} Provinsi ∴</span>
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-stone-400 to-transparent" />
          </div>

          <div className="space-y-5 max-w-3xl">
            <p className="font-heading text-xl lg:text-2xl text-stone-800 leading-relaxed">
              Setiap <em className="text-rose-700">titik</em> di peta ini adalah{" "}
              <strong className="text-primary">pekerja</strong>.
            </p>
            <p className="text-sm lg:text-[15px] text-stone-700 leading-relaxed">
              BU di <em className="text-amber-700 font-semibold">Papua Pegunungan</em> dipantau dengan intensitas yang sama dengan BU di
              <em className="text-amber-700 font-semibold"> DKI Jakarta</em>. Peta ini bukan dekorasi — ini pernyataan bahwa setiap pekerja JKN,
              di mana pun berada, berhak atas penegakan kepatuhan yang
              <span className="relative inline-block mx-1">
                <span className="relative z-10">adil</span>
                <span className="absolute left-0 right-0 bottom-0.5 h-2 bg-amber-200/70 z-0" />
              </span>.
            </p>
            <p className="text-sm lg:text-[15px] text-stone-700 leading-relaxed">
              Data GADM 2026 memastikan batas administratif akurat hingga tingkat kabupaten.
              Visualisasi geografis adalah bentuk <em>akuntabilitas publik</em> — setiap orang dapat melihat,
              setiap orang dapat memverifikasi.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y-2 border-stone-900/10">
            <ManifestoStat value={String(geoAgg.length)} label="Provinsi" accent="amber" />
            <ManifestoStat value={String(new Set(geoAgg.flatMap(g => [g.provinsi])).size)} label="Wilayah Terdata" accent="rose" />
            <ManifestoStat value={`${(dashStats.totalBU / 1000).toFixed(0)}K`} label="BU Terpantau" accent="primary" />
            <ManifestoStat value="24/7" label="Sinkronisasi" accent="stone" />
          </div>

          <div className="mt-10 flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="font-heading italic text-3xl text-stone-800 leading-none">EmployerScan Geo</div>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-px w-10 bg-stone-400" />
                <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">
                  Powered by GADM · Natural Earth · OpenStreetMap
                </p>
              </div>
              <p className="text-[10px] text-stone-500 mt-1 italic">Jakarta, Oktober 2026</p>
            </div>
            <Button size="lg" className="gap-2 bg-stone-900 text-amber-50 hover:bg-stone-800 hover:scale-105 shadow-xl transition-all h-12 px-6 group">
              <BookOpen className="h-4 w-4 group-hover:rotate-6 transition-transform" />
              Charter Geografis
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function StatBoxSmall({ label, value, color }: { label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    slate: "bg-slate-50 border-slate-200 text-slate-900",
    red: "bg-red-50 border-red-200 text-red-900",
    primary: "bg-emerald-50 border-emerald-200 text-emerald-900",
    amber: "bg-amber-50 border-amber-200 text-amber-900",
  }
  return (
    <div className={cn("rounded-lg border p-2 hover:scale-105 transition-transform", colors[color])}>
      <p className="text-[9px] font-bold uppercase tracking-widest opacity-70">{label}</p>
      <p className="font-heading text-lg font-bold tabular-nums">{value}</p>
    </div>
  )
}

function ManifestoStat({ value, label, accent }: { value: string; label: string; accent: "amber" | "rose" | "primary" | "stone" }) {
  const colors = {
    amber: { text: "text-amber-600", dot: "bg-amber-500" },
    rose: { text: "text-rose-600", dot: "bg-rose-500" },
    primary: { text: "text-primary", dot: "bg-primary" },
    stone: { text: "text-stone-800", dot: "bg-stone-700" },
  }[accent]
  return (
    <div className="group hover:-translate-y-1 transition-transform duration-300 cursor-default">
      <div className="flex items-baseline gap-1.5">
        <p className={cn("font-heading text-5xl lg:text-6xl font-normal tabular-nums leading-none", colors.text)}>{value}</p>
        <span className={cn("h-2 w-2 rounded-full group-hover:scale-150 transition-transform", colors.dot)} />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 mt-3 leading-tight">{label}</p>
    </div>
  )
}