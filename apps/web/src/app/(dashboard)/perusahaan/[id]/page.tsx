/**
 * PERUSAHAAN DETAIL PAGE
 * Informasi lengkap BU + SHAP breakdown + monthly reports
 */

import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  ChevronRight,
  Building2,
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  Users,
  Target,
  DollarSign,
  TrendingDown,
  Activity,
  ArrowLeft,
  Download,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import { getCompanyDetail } from "@/lib/supabase-queries"
import { humanizeFeature } from "@/lib/ml-data"

export const revalidate = 60

const fmtRupiah = (n: number): string => {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(2)} M`
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)} Jt`
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)} rb`
  return `Rp ${n.toLocaleString("id-ID")}`
}

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
]

const tierColor = (t: string) => {
  switch (t) {
    case "KRITIS":
      return "bg-destructive text-destructive-foreground border-0"
    case "TINGGI":
      return "bg-chart-4 text-white border-0"
    case "SEDANG":
      return "bg-chart-3 text-white border-0"
    default:
      return "bg-primary text-primary-foreground border-0"
  }
}

export default async function PerusahaanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const detail = await getCompanyDetail(id)

  if (!detail) notFound()

  const { company, monthlyReports, shap } = detail

  // Agregat 12 bulan
  const totalTunggakan = monthlyReports.reduce(
    (s, r) => s + (r.tunggakan ?? 0),
    0,
  )
  const totalWajib = monthlyReports.reduce(
    (s, r) => s + (r.iuran_jkn_wajib ?? 0),
    0,
  )
  const totalDibayar = monthlyReports.reduce(
    (s, r) => s + (r.iuran_jkn_dibayar ?? 0),
    0,
  )
  const recoveryRate = totalWajib > 0 ? (totalDibayar / totalWajib) * 100 : 0
  const anomalyCount = monthlyReports.filter((r) => r.anomaly_flag).length
  const bulanTunggak = monthlyReports.filter((r) => (r.tunggakan ?? 0) > 0).length

  // Max tunggakan untuk scaling bar chart
  const maxTunggakan = Math.max(
    ...monthlyReports.map((r) => r.tunggakan ?? 0),
    1,
  )

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href="/perusahaan"
          className="hover:text-foreground transition-colors"
        >
          Perusahaan
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium truncate max-w-xs">
          {company.nama}
        </span>
      </div>

      {/* Back button */}
      <Link href="/perusahaan">
        <Button variant="ghost" size="sm" className="gap-1 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar
        </Button>
      </Link>

      {/* Company Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 className="h-7 w-7 text-primary" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-heading text-2xl text-foreground tracking-tight">
                    {company.nama}
                  </h1>
                  <Badge className={tierColor(company.ecrs_tier)}>
                    {company.ecrs_tier}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {company.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                  <span className="font-mono">NPWP: {company.npwp}</span>
                  <span>·</span>
                  <span>{company.bentuk_badan}</span>
                  <span>·</span>
                  <span>{company.sektor_usaha}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="h-3.5 w-3.5" />
                Laporan BU
              </Button>
              <Button size="sm" className="gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Terbitkan SP
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Lokasi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <InfoRow label="Alamat" value={company.alamat} />
            <InfoRow label="Kelurahan" value={company.kelurahan ?? "—"} />
            <InfoRow label="Kecamatan" value={company.kecamatan ?? "—"} />
            <InfoRow label="Kota" value={company.kota} />
            <InfoRow label="Provinsi" value={company.provinsi} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Penanggung Jawab
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <InfoRow label="Nama PIC" value={company.pic_name ?? "—"} />
            <InfoRow
              label="Telepon"
              value={company.pic_phone ?? "—"}
              icon={<Phone className="h-3 w-3" />}
            />
            <InfoRow
              label="Email"
              value={company.pic_email ?? "—"}
              icon={<Mail className="h-3 w-3" />}
            />
            <InfoRow
              label="Tanggal Berdiri"
              value={
                company.tanggal_berdiri
                  ? new Date(company.tanggal_berdiri).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "—"
              }
              icon={<Calendar className="h-3 w-3" />}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Tenaga Kerja
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <InfoRow
              label="Terdaftar BPJS"
              value={company.jumlah_karyawan_terdaftar.toLocaleString("id-ID")}
            />
            <InfoRow
              label="Aktual (Kemnaker)"
              value={
                company.jumlah_karyawan_aktual
                  ? company.jumlah_karyawan_aktual.toLocaleString("id-ID")
                  : "—"
              }
            />
            {company.jumlah_karyawan_aktual &&
              company.jumlah_karyawan_aktual > company.jumlah_karyawan_terdaftar && (
                <div className="rounded-md bg-amber-50 border border-amber-200 p-2 mt-2">
                  <p className="text-[11px] text-amber-900">
                    <strong>Selisih:</strong>{" "}
                    {(
                      company.jumlah_karyawan_aktual -
                      company.jumlah_karyawan_terdaftar
                    ).toLocaleString("id-ID")}{" "}
                    pekerja berpotensi tidak terdaftar.
                  </p>
                </div>
              )}
          </CardContent>
        </Card>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          label="Skor ECRS"
          value={Math.round(company.ecrs_score).toString()}
          sub={`Tier ${company.ecrs_tier}`}
          icon={Target}
          color={
            company.ecrs_tier === "KRITIS"
              ? "destructive"
              : company.ecrs_tier === "TINGGI"
                ? "chart-4"
                : company.ecrs_tier === "SEDANG"
                  ? "chart-3"
                  : "primary"
          }
        />
        <KpiCard
          label="Tunggakan 12 Bulan"
          value={fmtRupiah(totalTunggakan)}
          sub={`${bulanTunggak} bulan tunggak`}
          icon={DollarSign}
          color={totalTunggakan > 0 ? "destructive" : "primary"}
        />
        <KpiCard
          label="Tingkat Pembayaran"
          value={`${recoveryRate.toFixed(1)}%`}
          sub={`${fmtRupiah(totalDibayar)} dari ${fmtRupiah(totalWajib)}`}
          icon={TrendingDown}
          color={recoveryRate >= 95 ? "primary" : recoveryRate >= 80 ? "chart-3" : "destructive"}
        />
        <KpiCard
          label="Deteksi Anomali"
          value={anomalyCount.toString()}
          sub={`dari ${monthlyReports.length} laporan bulanan`}
          icon={AlertCircle}
          color={anomalyCount > 0 ? "chart-4" : "primary"}
        />
      </div>

      {/* SHAP Breakdown */}
      {shap && shap.top_contributing_features.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-heading text-lg">
                  Faktor Pendorong Skor ECRS
                </CardTitle>
                <CardDescription className="text-xs">
                  Analisis SHAP · 10 fitur dengan kontribusi tertinggi terhadap
                  prediksi
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px]">
                Model XGBoost v4.2
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {shap.top_contributing_features.slice(0, 10).map((f, i) => {
              const h = humanizeFeature(f.feature)
              const isPositive = f.shap_contribution > 0
              const maxShap = Math.max(
                ...shap.top_contributing_features.map((x) =>
                  Math.abs(x.shap_contribution),
                ),
              )
              const widthPct = (Math.abs(f.shap_contribution) / maxShap) * 100

              return (
                <div
                  key={f.feature}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/40 transition-colors"
                >
                  <div className="h-6 w-6 rounded bg-muted flex items-center justify-center shrink-0">
                    <span className="font-heading text-xs font-bold text-muted-foreground">
                      {i + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {h.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          {f.feature} · nilai: {f.value.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant="outline"
                          className={`text-[9px] font-bold ${
                            isPositive
                              ? "border-destructive/30 text-destructive bg-destructive/5"
                              : "border-primary/30 text-primary bg-primary/5"
                          }`}
                        >
                          {isPositive ? "↑ Risiko" : "↓ Risiko"}
                        </Badge>
                        <span className="font-mono text-xs font-bold tabular-nums w-20 text-right">
                          {isPositive ? "+" : ""}
                          {f.shap_contribution.toFixed(3)}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isPositive ? "bg-destructive" : "bg-primary"
                        }`}
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="pt-3 border-t text-[11px] text-muted-foreground">
              <strong>Interpretasi:</strong> Fitur dengan ↑ Risiko mendorong skor
              ECRS ke atas (menuju non-compliant). Fitur dengan ↓ Risiko menarik
              skor ke bawah (menuju patuh). Metode SHAP memastikan setiap prediksi
              dapat dijelaskan ke BU yang bersangkutan (Right-to-Explanation).
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monthly Reports Chart */}
      {monthlyReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">
              Tren Pembayaran Bulanan
            </CardTitle>
            <CardDescription className="text-xs">
              {monthlyReports.length} laporan bulan terdokumentasi — iuran wajib
              vs dibayar vs tunggakan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {monthlyReports.map((r) => {
                const pct = r.iuran_jkn_wajib > 0 ? (r.iuran_jkn_dibayar / r.iuran_jkn_wajib) * 100 : 0
                const tunggakanPct = (r.tunggakan / maxTunggakan) * 100

                return (
                  <div
                    key={r.id}
                    className="grid grid-cols-12 gap-3 items-center p-2 rounded-md hover:bg-muted/40 transition-colors"
                  >
                    <div className="col-span-2">
                      <p className="text-xs font-semibold text-foreground">
                        {monthNames[r.bulan - 1]} {r.tahun}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {r.status_bayar}
                      </p>
                    </div>
                    <div className="col-span-6">
                      <div className="h-5 bg-muted rounded-sm overflow-hidden relative">
                        <div
                          className="absolute inset-y-0 left-0 bg-primary/80"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                        {r.tunggakan > 0 && (
                          <div
                            className="absolute inset-y-0 right-0 bg-destructive/80"
                            style={{ width: `${tunggakanPct}%` }}
                          />
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 text-right">
                      <p className="font-mono text-xs text-foreground">
                        {fmtRupiah(r.iuran_jkn_dibayar)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">dibayar</p>
                    </div>
                    <div className="col-span-2 text-right">
                      {r.tunggakan > 0 ? (
                        <>
                          <p className="font-mono text-xs text-destructive font-bold">
                            {fmtRupiah(r.tunggakan)}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            tunggakan
                          </p>
                        </>
                      ) : (
                        <Badge className="bg-primary/15 text-primary border-0 text-[9px]">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Lunas
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Total Wajib
                </p>
                <p className="font-mono font-bold text-foreground mt-1">
                  {fmtRupiah(totalWajib)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Total Dibayar
                </p>
                <p className="font-mono font-bold text-primary mt-1">
                  {fmtRupiah(totalDibayar)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Total Tunggakan
                </p>
                <p className="font-mono font-bold text-destructive mt-1">
                  {fmtRupiah(totalTunggakan)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-3 text-xs">
      <span className="text-muted-foreground flex items-center gap-1 shrink-0">
        {icon}
        {label}
      </span>
      <span className="text-foreground text-right">{value}</span>
    </div>
  )
}

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string
  value: string
  sub: string
  icon: React.ComponentType<{ className?: string }>
  color: "primary" | "destructive" | "chart-3" | "chart-4"
}) {
  const colors = {
    primary: { border: "border-primary/30", bg: "bg-primary/5", text: "text-primary" },
    destructive: {
      border: "border-destructive/30",
      bg: "bg-destructive/5",
      text: "text-destructive",
    },
    "chart-3": { border: "border-chart-3/30", bg: "bg-chart-3/5", text: "text-chart-3" },
    "chart-4": { border: "border-chart-4/30", bg: "bg-chart-4/5", text: "text-chart-4" },
  }[color]

  return (
    <Card className={`${colors.border}`}>
      <CardContent className="pt-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
          <div
            className={`h-8 w-8 rounded-lg flex items-center justify-center ${colors.bg}`}
          >
            <Icon className={`h-4 w-4 ${colors.text}`} />
          </div>
        </div>
        <p className="font-heading text-3xl font-bold tabular-nums leading-none text-foreground">
          {value}
        </p>
        <p className="text-[11px] text-muted-foreground mt-2">{sub}</p>
      </CardContent>
    </Card>
  )
}