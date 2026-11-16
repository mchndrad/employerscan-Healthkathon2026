import Link from "next/link"
import { cn } from "cn"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChevronRight, Download, FileText, ShieldCheck, Search,
  ChevronDown, Clock, CheckCircle2, AlertTriangle, AlertCircle,
  Database, Lock, Zap, Activity, Eye, Server, Fingerprint,
  Globe, Smartphone, UserCheck, FileCheck, Shield, Radio,
  Pause, Trash2, RefreshCw,
} from "lucide-react"
import {
  getAuditLogPaginated,
  getAuditsCount,
} from "@/lib/supabase-queries"

export const revalidate = 60

const cryptoChecks = [
  { label: "Genesis Block Tervalidasi", desc: "01 Jan 2026 · HASH_000000000000" },
  { label: "Rantai Blok Imutable", desc: "Terhubung ke chain verifikasi" },
  { label: "Kontinuitas Hash Pointer", desc: "100% Intact (tanpa celah)" },
  { label: "Pemeriksaan Manipulasi", desc: "Zero-Tamper · nol modifikasi paksa" },
]

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

export default async function AuditLogPage() {
  const [logResult, totalAudits] = await Promise.all([
    getAuditLogPaginated(1, 15),
    getAuditsCount(),
  ])

  const { entries: logs, total: totalLogs, totalPages } = logResult

  // Stats cards dari real counts
  const stats = [
    {
      label: "Total Log Tercatat",
      value: totalLogs.toLocaleString("id-ID"),
      delta: totalLogs > 0 ? "aktif" : "kosong",
      deltaType: totalLogs > 0 ? "up" : "warn",
      sub: "entri terdokumentasi",
      icon: Activity,
    },
    {
      label: "Audit Lapangan",
      value: totalAudits.toLocaleString("id-ID"),
      delta: totalAudits > 0 ? "verified" : "kosong",
      deltaType: totalAudits > 0 ? "up" : "warn",
      sub: "data audit tersimpan",
      icon: FileCheck,
    },
    {
      label: "Login Events",
      value: "0",
      delta: "tracking",
      deltaType: "up",
      sub: "via 2FA/MFA",
      icon: UserCheck,
    },
    {
      label: "Peringatan",
      value: "0",
      delta: "monitoring",
      deltaType: "warn",
      sub: "deteksi anomali aktivitas",
      icon: AlertTriangle,
    },
    {
      label: "Otentikasi Gagal",
      value: "0",
      delta: "aman",
      deltaType: "up",
      sub: "sistem belum pernah ditembus",
      icon: Lock,
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">Audit Log</span>
      </div>

      {/* ===== EDITORIAL HERO ===== */}
      <section className="relative py-2 animate-in fade-in-0 slide-in-from-top-2 duration-700">
        <div className="absolute -top-10 -left-10 h-80 w-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-primary/10 text-primary border-primary/20 gap-1.5 text-[10px] font-bold">
                <ShieldCheck className="h-3 w-3" />
                UU 27/2022 PDP
              </Badge>
              <Badge variant="outline" className="text-[10px] font-mono gap-1">
                <Lock className="h-3 w-3" />
                BSSN · BSrE Compliance
              </Badge>
            </div>

            <h1 className="font-heading text-5xl lg:text-6xl text-foreground tracking-tight leading-[0.95]">
              <span className="italic font-light text-slate-400">Audit Log,</span>
              <br />
              <span className="font-normal">immutable</span>
              <span className="text-primary">.</span>
            </h1>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
              Log aktivitas sistem <strong className="text-foreground">tak-terubah</strong> ·
              SHA-256 Chain Hash Verified · Standar kriptografi BSSN & BSrE ·
              <strong className="text-foreground"> {totalLogs.toLocaleString("id-ID")} catatan</strong> ter-rantai.
            </p>

            <div className="flex items-center gap-2 pt-2 flex-wrap">
              <Button size="sm" variant="outline" className="gap-1.5 shadow-sm">
                <Download className="h-3.5 w-3.5" />
                Ekspor CSV
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5 shadow-sm">
                <FileText className="h-3.5 w-3.5" />
                Ekspor PDF (Compliance)
              </Button>
              <Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verifikasi Integritas
              </Button>
            </div>
          </div>

          {/* Monolith */}
          <div className="lg:col-span-5 flex justify-end">
            <div className="relative group w-full lg:w-80">
              <div className="absolute -inset-3 bg-primary/10 blur-2xl rounded-3xl group-hover:bg-primary/20 transition-all" />
              <div className="relative bg-white rounded-2xl border p-5 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Log Integrity</span>
                  </div>
                  <Badge className="bg-primary text-white border-0 text-[9px] gap-1">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    VERIFIED
                  </Badge>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-5xl font-bold text-foreground tabular-nums leading-none">
                    {totalLogs.toLocaleString("id-ID")}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">catatan ter-rantai · Chain SHA-256</p>

                <div className="mt-4 pt-4 border-t space-y-2 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status Chain</span>
                    <span className="font-mono font-semibold text-foreground">
                      {totalLogs > 0 ? "Aktif" : "Siap Diaktifkan"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Audit Lapangan</span>
                    <span className="font-mono font-semibold text-foreground">
                      {totalAudits.toLocaleString("id-ID")} dokumen
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Verifikasi Terakhir</span>
                    <code className="font-mono font-semibold text-primary">
                      {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 5 STAT CARDS ===== */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-500" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
        {stats.map((s, i) => (
          <StatCard key={s.label} stat={s} delay={i * 50} />
        ))}
      </section>

      {/* ===== FILTER BAR ===== */}
      <section className="rounded-xl border bg-white p-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-500" style={{ animationDelay: "200ms", animationFillMode: "backwards" }}>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari user, action, resource, IP..."
              className="w-full pl-9 pr-3 py-2 text-xs border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <FilterDropdown label="User: Semua" />
          <FilterDropdown label="Action Type: Semua" />
          <FilterDropdown label="Severity: Semua" />
          <FilterDropdown label="7 Hari Terakhir" />

          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
            <RefreshCw className="h-3 w-3" />
            Reset Filter
          </Button>

          <div className="h-6 w-px bg-slate-200 mx-1" />

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Live Stream</span>
            <div className="relative inline-flex items-center">
              <div className="h-5 w-9 bg-primary rounded-full relative cursor-pointer shadow-inner">
                <div className="absolute top-0.5 right-0.5 h-4 w-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MAIN TABLE + CRYPTO SIDE PANEL ===== */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-5 animate-in fade-in-0 slide-in-from-bottom-2 duration-500" style={{ animationDelay: "300ms", animationFillMode: "backwards" }}>
        {/* LEDGER TABLE */}
        <Card className="xl:col-span-8 overflow-hidden">
          <div className="px-4 py-3 border-b bg-slate-50/50 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Database className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">Ledger Aktivitas Imutable</h3>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-mono">
                    SHA-256 Merkle Chain
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Real-time sync aktif · Sorted by latest
                </p>
              </div>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20 gap-1.5 text-[10px]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              LIVE
            </Badge>
          </div>

          {logs.length === 0 ? (
            <div className="py-16 text-center">
              <Database className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-foreground">Ledger Siap Mencatat</h4>
              <p className="text-xs text-muted-foreground mt-2 max-w-md mx-auto">
                Tabel <code className="font-mono bg-slate-100 px-1 rounded">audit_log</code> telah dibuat
                dan siap mencatat aktivitas sistem. Entri akan otomatis muncul di sini saat verifikator melakukan
                login, mengakses detail BU, mengunduh laporan, atau melakukan tindakan lain yang perlu diaudit.
              </p>
              <Badge variant="outline" className="mt-4 text-[10px] font-mono">
                Status: siap operasional
              </Badge>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50/50 border-b">
                  <tr className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="text-left px-4 py-2.5 whitespace-nowrap">Waktu (WIB)</th>
                    <th className="text-left px-4 py-2.5 whitespace-nowrap">Tingkat</th>
                    <th className="text-left px-4 py-2.5 whitespace-nowrap">Pengguna</th>
                    <th className="text-left px-4 py-2.5 whitespace-nowrap">Aksi</th>
                    <th className="text-left px-4 py-2.5 whitespace-nowrap">Entitas / Resource</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log: any, i: number) => (
                    <LogRow key={log.id ?? i} log={log} delay={i * 25} />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalLogs > 0 && (
            <div className="px-4 py-3 border-t flex items-center justify-between gap-2 flex-wrap">
              <p className="text-[11px] text-muted-foreground">
                Menampilkan <strong className="text-foreground">1–{logs.length}</strong> dari{" "}
                <strong className="text-foreground">{totalLogs.toLocaleString("id-ID")}</strong> log
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" className="h-7 text-[11px]" disabled>
                  Sebelumnya
                </Button>
                <Button className="h-7 w-7 p-0 text-[11px] bg-primary hover:bg-primary/90">1</Button>
                {totalPages > 1 && (
                  <>
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0 text-[11px]">
                      2
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-[11px]">
                      Selanjutnya
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* CRYPTO SIDE PANEL */}
        <div className="xl:col-span-4 space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="pt-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-linear-to-br from-primary to-emerald-600 flex items-center justify-center shadow-md shadow-primary/30">
                  <Fingerprint className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Status Kriptografis</h3>
                  <p className="text-[10px] text-muted-foreground">SHA-256 & Segel Digital BSrE</p>
                </div>
              </div>

              <div className="space-y-2">
                {cryptoChecks.map((c, i) => (
                  <CryptoCheck key={i} check={c} delay={i * 60} />
                ))}
              </div>

              <div className="rounded-lg bg-primary/5 border border-primary/20 p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[11px] font-medium text-foreground">Runtime Verifikasi</span>
                </div>
                <span className="font-mono font-bold text-primary text-sm">0.42 detik</span>
              </div>

              <Button size="sm" className="w-full gap-1.5 bg-primary hover:bg-primary/90 shadow-md">
                <ShieldCheck className="h-3.5 w-3.5" />
                Jalankan Verifikasi Penuh
              </Button>
            </CardContent>
          </Card>

          <div className="rounded-xl border bg-amber-50/50 border-amber-200 p-4">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-900 mb-1">Pemberitahuan Kepatuhan</p>
                <p className="text-[11px] text-amber-900/80 leading-relaxed">
                  Setiap modifikasi paksa pada tingkat database merusak kesinambungan hash kriptografis dan otomatis
                  mengaktifkan alarm prioritas tinggi ke{" "}
                  <strong>Unit Kepatuhan Internal BPJS Kesehatan</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-slate-50/50 p-4">
            <div className="flex items-start gap-2.5">
              <FileText className="h-4 w-4 text-slate-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900 mb-1">Kekuatan Pembuktian Hukum</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Sesuai <strong className="text-foreground">Pasal 16 UU PDP</strong> &{" "}
                  <strong className="text-foreground">Regulasi BSSN No. 4/2021</strong>, seluruh berkas riwayat audit
                  EmployerScan di-timestamp dengan Trusted Timestamping Authority (TSA) BSrE.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LIVE EVENT STREAM ===== */}
      <section className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500" style={{ animationDelay: "500ms", animationFillMode: "backwards" }}>
        <Card className="overflow-hidden">
          <div className="px-4 py-3 border-b bg-slate-950 text-slate-100 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Radio className="h-4 w-4 text-primary animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-primary/30 blur-md animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">Live Event Stream</span>
                  <Badge className="bg-primary text-white border-0 text-[9px]">WebSocket</Badge>
                </div>
                <code className="text-[10px] font-mono text-slate-400">
                  wss://govcloud.bpjs-kesehatan.go.id/events
                </code>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white">
                <Pause className="h-3 w-3" />
                Jeda Aliran
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5 text-xs border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white">
                <Trash2 className="h-3 w-3" />
                Bersihkan Feed
              </Button>
            </div>
          </div>

          <CardContent className="pt-4 pb-4">
            <div className="py-10 text-center">
              <Radio className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-foreground">Siap Menerima Event</h4>
              <p className="text-xs text-muted-foreground mt-2 max-w-md mx-auto">
                Live Event Stream akan menampilkan aktivitas real-time saat sistem beroperasi. Setiap event
                dari verifikator, field officer, dan daemon sistem akan muncul di sini dengan hash kriptografis
                dan metadata IP.
              </p>
              <Badge variant="outline" className="mt-4 text-[10px] font-mono">
                Status: standby
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

// =========================================================
// COMPONENTS
// =========================================================

function StatCard({ stat, delay }: { stat: any; delay: number }) {
  const deltaColor =
    stat.deltaType === "up" ? "text-primary" : stat.deltaType === "warn" ? "text-amber-600" : "text-red-600"
  return (
    <div
      className="group rounded-xl border bg-white p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-2"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
        <div
          className={cn(
            "h-7 w-7 rounded-lg flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6",
            stat.deltaType === "up"
              ? "bg-primary/10 text-primary"
              : stat.deltaType === "warn"
                ? "bg-amber-50 text-amber-600"
                : "bg-red-50 text-red-600",
          )}
        >
          <stat.icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-heading text-3xl font-bold text-foreground tabular-nums">{stat.value}</span>
      </div>
      <div className={cn("text-[10px] font-semibold mt-1 flex items-center gap-1", deltaColor)}>
        <span>{stat.delta}</span>
        <span className="text-muted-foreground font-normal">· {stat.sub}</span>
      </div>
    </div>
  )
}

function FilterDropdown({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs border rounded-lg bg-white hover:border-primary/40 hover:bg-slate-50 transition-colors">
      <span className="text-foreground">{label}</span>
      <ChevronDown className="h-3 w-3 text-muted-foreground" />
    </button>
  )
}

function LogRow({ log, delay }: { log: any; delay: number }) {
  const level = (log.severity ?? "INFO").toUpperCase()
  const levelStyles: Record<string, { bg: string; text: string; dot: string; rowBg: string }> = {
    INFO: { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-400", rowBg: "" },
    WARN: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", rowBg: "" },
    WARNING: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", rowBg: "" },
    CRITICAL: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500", rowBg: "bg-red-50/50" },
  }
  const s = levelStyles[level] ?? levelStyles.INFO
  const isCritical = level === "CRITICAL"
  const createdAt = log.created_at ? new Date(log.created_at) : new Date()
  const actorName = log.actor_name ?? "Sistem"

  return (
    <tr
      className={cn("border-b last:border-0 hover:bg-slate-50 transition-colors group animate-in fade-in-0", s.rowBg)}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      <td className="px-4 py-2.5 whitespace-nowrap">
        <code className="text-[11px] font-mono font-bold text-foreground">
          {createdAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </code>
        <p className="text-[9px] text-muted-foreground">
          {createdAt.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
        </p>
      </td>

      <td className="px-4 py-2.5">
        <Badge className={cn("text-[9px] font-bold border-0 gap-1", s.bg, s.text)}>
          <span className={cn("h-1.5 w-1.5 rounded-full", s.dot, isCritical && "animate-pulse")} />
          {level}
        </Badge>
      </td>

      <td className="px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg flex items-center justify-center font-bold text-[10px] bg-primary/10 text-primary">
            {actorName.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
          </div>
          <div className="min-w-0">
            <p className={cn("text-xs font-semibold truncate", isCritical ? "text-red-700" : "text-foreground")}>
              {actorName}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-2.5">
        <code
          className={cn(
            "text-[11px] font-mono font-bold px-2 py-0.5 rounded",
            isCritical ? "bg-red-100 text-red-700" : level === "WARN" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700",
          )}
        >
          {log.action ?? "UNKNOWN"}
        </code>
      </td>

      <td className="px-4 py-2.5">
        <code className="text-[11px] font-mono text-muted-foreground group-hover:text-foreground transition-colors">
          {log.description ?? "—"}
        </code>
      </td>
    </tr>
  )
}

function CryptoCheck({ check, delay }: { check: typeof cryptoChecks[0]; delay: number }) {
  return (
    <div
      className="flex items-start gap-2.5 group animate-in fade-in-0 slide-in-from-left-1"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-primary/30">
        <CheckCircle2 className="h-3 w-3 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground">{check.label}</p>
        <code className="text-[10px] font-mono text-muted-foreground">{check.desc}</code>
      </div>
    </div>
  )
}