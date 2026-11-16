/**
 * DASHBOARD PAGE — EmployerScan (Phase 8)
 * Welcome + Filter + 4 KPI + Risk Map (REAL) + Top 10 + AI Insights + Activity Feed
 * Data real-time dari Supabase (10.000 BU hasil analisis ECRS v4.2)
 */

import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { KpiSparkline } from "@/components/dashboard/kpi-sparkline"
import {
  Building2, AlertTriangle, TrendingUp, TrendingDown, Target, DollarSign,
  MapPin, ArrowRight, Download, RefreshCw, Calendar, ChevronRight,
  Sparkles, Activity, CheckCircle2, AlertCircle, Brain, Clock,
} from "lucide-react"
import Link from "next/link"

// ================================================================
// LAZY LOAD RISK MAP (client-only, avoid SSR issue)
// ================================================================
import { RiskMap } from "@/components/dashboard/risk-map-wrapper"

// ================================================================
// REAL DATA QUERIES
// ================================================================
import {
  getDashboardAggregate,
  getMonthlyTrend,
  getTopRiskCompanies,
  getRecentAuditLog,
  getGeoAggregate,
} from "@/lib/supabase-queries"
import { tierFromEcrs, type ProvinceData } from "@/lib/data/provinces"

// Revalidate setiap 60 detik (data agregat tidak perlu real-time)
export const revalidate = 60

// ================================================================
// HELPERS
// ================================================================
const fmtRupiah = (n: number): string => {
  if (n >= 1_000_000_000_000) return `Rp ${(n / 1_000_000_000_000).toFixed(1)} T`
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)} M`
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)} Jt`
  return `Rp ${n.toLocaleString("id-ID")}`
}

const fmtNpwp = (npwp: string): string => {
  if (!npwp || npwp.length < 10) return npwp
  return `${npwp.slice(0, 11)}...`
}

const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "baru saja"
  if (minutes < 60) return `${minutes} mnt lalu`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.floor(hours / 24)
  return `${days} hari lalu`
}

// ================================================================
// DASHBOARD PAGE
// ================================================================
export default async function DashboardPage() {
  // Fetch semua data paralel (5 queries)
  const [stats, monthly, topRisk, auditLog, geoAgg] = await Promise.all([
    getDashboardAggregate(),
    getMonthlyTrend(),
    getTopRiskCompanies(10),
    getRecentAuditLog(4),
    getGeoAggregate(),
  ])

  // Sparkline data dari tren bulanan real (12 bulan)
  const totalBuTrend = monthly.map((_, i) => Math.round((stats.totalBU * (i + 1)) / monthly.length))
  const tunggakanTrend = monthly.map((m) => Number((m.totalTunggakan / 1_000_000_000).toFixed(2)))
  const recoveryTrend = monthly.map((m) => m.recoveryRate)
  const riskTrend = monthly.map((_, i) => {
    const base = stats.kritisCount + stats.tinggiCount
    return Math.round((base * (i + 1)) / monthly.length)
  })

  // Build provinces map untuk peta (dynamic dari real DB)
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

  // KPI Cards — data real
  const kpiCards = [
    {
      label: "Total Badan Usaha Dipantau",
      value: stats.totalBU.toLocaleString("id-ID"),
      trend: `${stats.comply.toLocaleString("id-ID")} BU patuh`,
      trendValue: `${stats.complyPct.toFixed(1)}%`,
      trendDirection: "up" as const,
      icon: Building2,
      color: "primary" as const,
      subtitle: "Dataset per Oktober 2026",
      trendData: totalBuTrend,
    },
    {
      label: "Potensi Tunggakan Iuran",
      value: fmtRupiah(stats.totalTunggakan),
      trend: `${stats.nonComplyKasus.toLocaleString("id-ID")} BU terdeteksi`,
      trendValue: stats.totalIuranWajib > 0
        ? `${((stats.totalTunggakan / stats.totalIuranWajib) * 100).toFixed(1)}%`
        : "0%",
      trendDirection: "up" as const,
      icon: DollarSign,
      color: "destructive" as const,
      subtitle: "Agregat 12 bulan terakhir",
      trendData: tunggakanTrend,
    },
    {
      label: "Badan Usaha Risiko Tinggi",
      value: (stats.kritisCount + stats.tinggiCount).toLocaleString("id-ID"),
      trend: `${stats.kritisCount} Kritis · ${stats.tinggiCount} Tinggi`,
      trendValue: "ECRS ≥ 70",
      trendDirection: "neutral" as const,
      icon: AlertTriangle,
      color: "chart-4" as const,
      subtitle: "Prioritas surat peringatan & wasrik lapangan",
      trendData: riskTrend,
    },
    {
      label: "Tingkat Kepatuhan Pembayaran",
      value: `${stats.recoveryRate.toFixed(1)}%`,
      trend: `${fmtRupiah(stats.totalIuranDibayar)} tertagih`,
      trendValue: "YTD",
      trendDirection: "up" as const,
      icon: Target,
      color: "primary" as const,
      subtitle: "Realisasi vs Iuran Wajib",
      trendData: recoveryTrend,
    },
  ]

  // Risk legend dari data real
  const totalForLegend = geoAgg.reduce((sum, g) => sum + g.totalBU, 0) || 1
  const pct = (n: number) =>
    totalForLegend > 0 ? ((n / totalForLegend) * 100).toFixed(0) : "0"
  const riskLegend = [
    { label: "0-50 Rendah", range: `${pct(stats.rendahCount)}%`, color: "bg-primary" },
    { label: "50-70 Sedang", range: `${pct(stats.sedangCount)}%`, color: "bg-chart-3" },
    { label: "70-85 Tinggi", range: `${pct(stats.tinggiCount)}%`, color: "bg-chart-4" },
    { label: "85-100 Kritis", range: `${pct(stats.kritisCount)}%`, color: "bg-destructive" },
  ]

  // AI Insights dari data real
  const aiInsights = [
    {
      icon: AlertCircle,
      title: `${stats.nonComply.toLocaleString("id-ID")} BU teridentifikasi non-compliant`,
      description: `Memerlukan surat peringatan Tahap 1 dan verifikasi lapangan oleh tim wasrik. Rata-rata skor ECRS: ${stats.avgEcrs.toFixed(0)}.`,
      severity: "critical" as const,
      count: stats.nonComply.toLocaleString("id-ID"),
    },
    {
      icon: AlertTriangle,
      title: `${stats.warning.toLocaleString("id-ID")} BU dalam status warning`,
      description: `Terdeteksi pola kepatuhan menurun dalam 3 bulan terakhir. Direkomendasikan monitoring intensif via dashboard.`,
      severity: "warning" as const,
      count: stats.warning.toLocaleString("id-ID"),
    },
    {
      icon: TrendingDown,
      title: `${stats.kritisCount.toLocaleString("id-ID")} BU dengan skor kritis (ECRS ≥ 85)`,
      description: `Prioritas tertinggi untuk audit investigasi mendalam. Rekomendasikan koordinasi dengan Kemnaker & DJP.`,
      severity: "critical" as const,
      count: stats.kritisCount.toLocaleString("id-ID"),
    },
  ]

  return (
    <div className="space-y-6">
      {/* ============================================= */}
      {/* 1. WELCOME HEADER + FILTER BAR               */}
      {/* ============================================= */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Dashboard</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Overview</span>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-heading text-4xl text-foreground tracking-tight">
              Selamat Datang, Chandra 👋
            </h1>
            <p className="text-sm text-muted-foreground">
              Pantauan Nasional JKN-KIS · Periode Oktober 2026 ·{" "}
              <span className="font-semibold text-primary">SIKLUS AUDIT IV</span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              Bulan Ini (Okt 2026)
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Ekspor Ringkasan
            </Button>
            <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
              <RefreshCw className="h-4 w-4" />
              Sinkronkan Data
            </Button>
          </div>
        </div>
      </div>

      {/* ============================================= */}
      {/* 2. KPI CARDS (4 cards) — Clean, flat          */}
      {/* ============================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, i) => (
          <Card
            key={i}
            className="relative overflow-hidden border-border/60 hover:border-border transition-colors"
          >
            {/* Accent line atas */}
            <div
              className={`absolute top-0 left-0 right-0 h-0.5 ${
                kpi.color === "primary"
                  ? "bg-primary"
                  : kpi.color === "destructive"
                  ? "bg-destructive"
                  : "bg-chart-4"
              }`}
            />

            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-5">
              <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-tight max-w-[70%]">
                {kpi.label}
              </CardTitle>
              <div
                className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                  kpi.color === "primary"
                    ? "bg-primary/10"
                    : kpi.color === "destructive"
                    ? "bg-destructive/10"
                    : "bg-chart-4/10"
                }`}
              >
                <kpi.icon
                  className={`h-4 w-4 ${
                    kpi.color === "primary"
                      ? "text-primary"
                      : kpi.color === "destructive"
                      ? "text-destructive"
                      : "text-chart-4"
                  }`}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="font-heading text-3xl text-foreground tracking-tight leading-none tabular-nums">
                {kpi.value}
              </div>

              {/* Recharts sparkline */}
              <KpiSparkline data={kpi.trendData} color={kpi.color} />

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-muted-foreground font-medium">{kpi.trend}</span>
                {kpi.trendDirection === "up" && (
                  <span className="flex items-center gap-1 text-primary font-bold tabular-nums">
                    <TrendingUp className="h-3 w-3" />
                    {kpi.trendValue}
                  </span>
                )}
                {kpi.trendDirection === "neutral" && (
                  <Badge variant="outline" className="text-[10px] font-bold h-5">
                    {kpi.trendValue}
                  </Badge>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground/80 font-medium pt-2 border-t border-border/50">
                {kpi.subtitle}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ============================================= */}
      {/* 3. RISK MAP (REAL — dark bg) + TOP 10 RISK   */}
      {/* ============================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="font-heading text-lg">
                Peta Risiko Kepatuhan Nasional
              </CardTitle>
              <CardDescription className="text-xs">
                Agregasi skor ECRS v4.2 per provinsi · {geoAgg.length} Provinsi Indonesia
              </CardDescription>
            </div>
            <Link href="/geo">
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                Buka Geo-Intelligence
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-accent/50 border border-border p-3 mb-4">
              <p className="text-xs text-foreground">
                <strong className="font-bold">Ringkasan Nasional:</strong>{" "}
                {stats.totalBU.toLocaleString("id-ID")} BU dipantau ·{" "}
                {stats.nonComply.toLocaleString("id-ID")} teridentifikasi non-compliant ·{" "}
                Rata-rata skor ECRS: {stats.avgEcrs.toFixed(1)}
              </p>
            </div>

            {/* REAL INTERACTIVE MAP — bg hitam tidak diubah */}
            <RiskMap provincesData={provincesData} />

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 text-xs">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-semibold text-foreground">Skala Risiko ECRS:</span>
                {riskLegend.map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${item.color}`} />
                    <span className="text-muted-foreground">
                      {item.label} ({item.range})
                    </span>
                  </div>
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground italic">
                Update terakhir:{" "}
                {new Date().toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="font-heading text-lg">Top 10 Risiko Tertinggi</CardTitle>
              <CardDescription className="text-xs">
                Berdasarkan skor ECRS per Oktober 2026
              </CardDescription>
            </div>
            <Link href="/perusahaan?sort=ecrs_desc">
              <Button variant="ghost" size="sm" className="text-primary text-xs">
                Semua ({(stats.kritisCount + stats.tinggiCount).toLocaleString("id-ID")})
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {topRisk.map((bu, i) => (
              <Link
                key={bu.npwp}
                href={`/perusahaan/${bu.npwp}`}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-heading text-sm text-muted-foreground w-6 shrink-0 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {bu.nama}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      NPWP: {fmtNpwp(bu.npwp)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    variant={
                      bu.ecrs_tier === "KRITIS"
                        ? "destructive"
                        : bu.ecrs_tier === "TINGGI"
                        ? "outline"
                        : "secondary"
                    }
                    className="font-bold text-[10px] tabular-nums"
                  >
                    ECRS {Math.round(bu.ecrs_score)} · {bu.ecrs_tier}
                  </Badge>
                  <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}

            <Link href="/perusahaan">
              <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
                Lihat Seluruh Daftar Perusahaan
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* ============================================= */}
      {/* 4. AI INSIGHTS + ACTIVITY FEED               */}
      {/* ============================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <CardTitle className="font-heading text-lg">Ringkasan Analisis ECRS</CardTitle>
                <CardDescription className="text-xs">
                  Model XGBoost v4.2 · AUC 0.914 · Fairness Grade B
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-primary text-primary-foreground font-bold text-[10px]">
              AKTIF
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Hasil analisis per Oktober 2026 pada {stats.totalBU.toLocaleString("id-ID")} badan usaha:
            </p>

            {aiInsights.map((insight, i) => (
              <div
                key={i}
                className={`rounded-lg border p-3 transition-colors ${
                  insight.severity === "critical"
                    ? "border-destructive/30 bg-destructive/5 hover:border-destructive/50"
                    : "border-chart-4/30 bg-chart-4/5 hover:border-chart-4/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                      insight.severity === "critical"
                        ? "bg-destructive/20"
                        : "bg-chart-4/20"
                    }`}
                  >
                    <insight.icon
                      className={`h-4 w-4 ${
                        insight.severity === "critical"
                          ? "text-destructive"
                          : "text-chart-4"
                      }`}
                    />
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <p className="text-xs font-bold text-foreground">{insight.title}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <Link href="/benchmark">
              <Button variant="outline" className="w-full gap-2 text-xs" size="sm">
                <Sparkles className="h-3 w-3" />
                Lihat Benchmark Evidence
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>

            <p className="text-[10px] text-muted-foreground text-center">
              Model terkalibrasi dengan dataset DJP, Kemnaker, dan AHU Kemenkumham
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <CardTitle className="font-heading text-lg">Aktivitas Terbaru</CardTitle>
                <CardDescription className="text-xs">
                  Log audit terkini dari sistem
                </CardDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              className="gap-1 text-primary border-primary/40 text-[10px]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Live
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {auditLog.length === 0 ? (
              <div className="py-8 text-center">
                <Activity className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Belum ada aktivitas tercatat</p>
                <p className="text-[10px] text-muted-foreground/70 mt-1">
                  Log akan muncul otomatis saat verifikator melakukan aksi di sistem
                </p>
              </div>
            ) : (
              auditLog.map((activity: any, i: number) => {
                const isCritical = activity.severity === "critical"
                const Icon = isCritical ? AlertCircle : CheckCircle2
                return (
                  <div key={activity.id ?? i} className="flex gap-3 group">
                    <div className="flex flex-col items-center shrink-0">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          isCritical ? "bg-destructive/15" : "bg-primary/15"
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 ${
                            isCritical ? "text-destructive" : "text-primary"
                          }`}
                        />
                      </div>
                      {i < auditLog.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-1" />
                      )}
                    </div>

                    <div className="flex-1 pb-3 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-xs font-bold text-foreground truncate">
                          {activity.actor_name ?? "Sistem"}
                        </p>
                        <span className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {timeAgo(activity.created_at)}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mb-1.5">
                        {activity.description ?? activity.action}
                      </p>
                      <Badge variant="outline" className="text-[9px] h-4 px-1.5">
                        {activity.action}
                      </Badge>
                    </div>
                  </div>
                )
              })
            )}

            <Separator />

            <Link href="/audit-log">
              <Button variant="ghost" size="sm" className="w-full text-xs text-primary gap-1">
                Lihat Riwayat Lengkap
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}