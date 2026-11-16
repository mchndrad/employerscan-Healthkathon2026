"use client"

import Link from "next/link"
import { cn } from "cn"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChevronRight, Camera, MapPin, Radio, Fingerprint, QrCode,
  Clock, Shield, UserCheck, FileCheck, Hash, Lock, Timer, Zap,
  AlertCircle, Battery, Signal, Users, Download, Plus,
  CheckCircle2, AlertTriangle, Eye, ArrowRight, PlayCircle,
  Activity, Filter, Image as ImageIcon, Satellite, Sparkles,
} from "lucide-react"

const operations = [
  { id: "WRK-2026-0842", bu: "PT Nusantara Megah Logistik", officer: "Pak Ahmad", officerCode: "AHM-07", progress: 80, status: "AUDIT BERLANGSUNG", statusColor: "primary", location: "Jl. Sudirman Kav. 52, Jakarta Pusat", ecrs: 92, tier: "KRITIS", checklist: "8 / 10", photos: 4, duration: "01h 25m" },
  { id: "WRK-2026-0843", bu: "PT Sumber Berkat Tambang", officer: "Bu Siti", officerCode: "SIT-11", progress: 25, status: "STOP · REVIEW WASRIK", statusColor: "amber", location: "Rasuna Said Kav. C-11, Jakarta Selatan", ecrs: 89, tier: "KRITIS", checklist: "2 / 10", photos: 2, duration: "25m" },
]

const photos = [
  { officer: "Pak Ahmad", bu: "PT Nusantara Megah", time: "09:30:12", title: "Buku Payroll Fisik Oktober", hash: "a8f3...e9d4" },
  { officer: "Pak Ahmad", bu: "PT Nusantara Megah", time: "09:35:40", title: "Rekap Mesin Fingerprint", hash: "7c92...4bea" },
  { officer: "Bu Siti", bu: "PT Sumber Berkat", time: "08:16:32", title: "Pintu Gerbang Perusahaan", hash: "e3b0...a4e6" },
  { officer: "Bu Siti", bu: "PT Sumber Berkat", time: "08:22:58", title: "Wawancara Pemohon JKN", hash: "9f12...bb41" },
  { officer: "Pak Budi", bu: "PT Graha Sentosa", time: "07:48:22", title: "Tanda Terima SP-1 Original", hash: "c84a...1f09" },
  { officer: "Mas Doni", bu: "PT Indojaya Perkasa", time: "10:05:10", title: "Sanksi Pajak Peketus", hash: "b721...03ee" },
]

const chainOfCustody = [
  { time: "09:15 WIB", action: "Penugasan dibuat oleh Pak Budi", role: "Wasrik DKI", desc: "Nomor Surat Tugas ST/104/WAS-DKI/X/2026 — target cek selisih 140 peserta & upah pokok", icon: FileCheck },
  { time: "09:15 WIB", action: "Diterima & Dikonfirmasi Pak Ahmad", role: "Field Officer", desc: "Konfirmasi penerimaan via Mobile App Wasrik dengan sinkronisasi offline checklist aktif", icon: UserCheck },
  { time: "09:30 WIB", action: "Field Officer tiba di lokasi", role: "Perimeter geofence 20m", desc: "GPS Lock −6.2254°, 106.8091° (SCBD Sudirman) — geofence security token divalidasi server", icon: MapPin },
  { time: "09:30 WIB", action: "Audit investigasi fisik dimulai", role: "Pembukaan BAP", desc: "Resmi bersama HR Manager PT Nusantara Megah Logistik dengan tanda tangan digital", icon: PlayCircle },
  { time: "10:20 WIB", action: "Checklist 6–10 selesai", role: "+ 2 foto bukti tambahan", desc: "Data payroll fisik 2025–2026 diverifikasi silang against master data BPJS e-Dabu", icon: CheckCircle2 },
  { time: "10:55 WIB", action: "Audit submitted untuk Wasrik Wilayah", role: "AES-256 enkripsi", desc: "Packet BAP terenkripsi dan di-upload ke server Wasrik Kantor Wilayah DKI Jakarta", icon: Shield },
]

const officers = [
  { name: "Pak Ahmad", code: "AHM-07", zone: "Jakarta Pusat", status: "AUDIT AKTIF", statusColor: "primary", gps: 94, battery: 68, lastSync: "2m" },
  { name: "Bu Siti", code: "SIT-11", zone: "Jakarta Selatan", status: "EN ROUTE", statusColor: "blue", gps: 100, battery: 92, lastSync: "15s" },
  { name: "Mas Doni", code: "DON-04", zone: "Jakarta Utara", status: "AUDIT AKTIF", statusColor: "primary", gps: 72, battery: 54, lastSync: "1m" },
  { name: "Pak Budi Santoso", code: "BUD-01", zone: "KC Review", status: "STANDBY", statusColor: "slate", gps: 95, battery: 100, lastSync: "5m" },
  { name: "Pak Hendra", code: "HEN-09", zone: "Pulogadung", status: "ON FIELD", statusColor: "primary", gps: 100, battery: 71, lastSync: "30s" },
  { name: "Bu Lestari", code: "LES-18", zone: "Jakarta Barat", status: "AUDIT AKTIF", statusColor: "primary", gps: 88, battery: 42, lastSync: "4m" },
  { name: "Bu Rini", code: "RIN-15", zone: "Off Duty", status: "ISTIRAHAT", statusColor: "slate", gps: 100, battery: 100, lastSync: "2h" },
  { name: "Pak Dimas", code: "DMS-22", zone: "Depok", status: "ISTIRAHAT", statusColor: "slate", gps: 100, battery: 100, lastSync: "3h" },
]

export default function FieldAuditPage() {
  return (
    <>
      <style jsx global>{`
        @keyframes radar {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        @keyframes scanline {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes dash {
          to { stroke-dashoffset: -24; }
        }
        @keyframes trailMove {
          0% { transform: translateY(-50%) translateX(0); opacity: 0.5; }
          100% { transform: translateY(-50%) translateX(-10px); opacity: 0; }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .animate-radar { animation: radar 8s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-scanline { animation: scanline 4s linear infinite; }
        .animate-dash { stroke-dasharray: 8; animation: dash 2s linear infinite; }
        .animate-shimmer { animation: shimmer 2s linear infinite; background-size: 200% 100%; }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>

      <div className="space-y-10 animate-in fade-in-0 duration-500">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">Field Audit</span>
        </div>

        {/* ================================================= */}
        {/* HERO — Clean editorial */}
        {/* ================================================= */}
        <section className="relative animate-in fade-in-0 slide-in-from-top-2 duration-700">
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  Live Ops · 24 operations in field
                </span>
                <span className="text-[10px] text-muted-foreground">· Updated 2 min ago</span>
              </div>

              <h1 className="font-heading text-6xl lg:text-7xl text-foreground tracking-tight leading-[0.95]">
                <span className="italic font-light text-slate-400">Field Audit,</span>
                <br />
                <span className="font-normal">in </span>
                <span className="font-bold text-primary">frame</span>
                <span className="text-primary">.</span>
              </h1>

              <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
                Pantauan audit lapangan real-time ·{" "}
                <strong className="text-foreground">12 field officer aktif</strong> ·
                Chain-of-custody kriptografis SHA-256 · Setiap bukti ter-watermark GPS dan ter-sertifikasi BSrE.
              </p>

              <div className="flex items-center gap-2 pt-2 flex-wrap">
                <Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all">
                  <Plus className="h-3.5 w-3.5" />
                  Buat Penugasan Baru
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  Ekspor Laporan
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Satellite className="h-3.5 w-3.5" />
                  Mobile App Status
                </Button>
              </div>
            </div>

            {/* Live timer card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative group">
                <div className="absolute -inset-2 bg-primary/10 blur-xl rounded-3xl group-hover:bg-primary/20 transition-all" />
                <div className="relative bg-white rounded-2xl border p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 w-full lg:w-80">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Operations Timer</span>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-[9px] font-mono font-bold text-primary">LIVE</span>
                    </div>
                  </div>

                  <div className="font-mono flex items-baseline gap-2">
                    <span className="font-heading text-6xl font-bold text-foreground tabular-nums leading-none">00:25</span>
                    <span className="text-xl text-muted-foreground tabular-nums animate-pulse">:14</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 font-mono">T+ since first dispatch · 342 photos ter-sync</p>

                  <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t">
                    <TimerStat value="24" label="In Field" accent="primary" />
                    <TimerStat value="18" label="Selesai" accent="slate" />
                    <TimerStat value="7" label="Review" accent="amber" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================= */}
        {/* OVERVIEW BOARD */}
        {/* ================================================= */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-700" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
          <MetricTile label="Dalam Progress" value="24" sub="8 prioritas tinggi" icon={PlayCircle} accent="blue" delay={100} />
          <MetricTile label="Selesai Hari Ini" value="18" sub="+22% vs kemarin" icon={CheckCircle2} accent="primary" delay={175} />
          <MetricTile label="Pending Review" value="7" sub="3 SLA < 1 jam" icon={AlertCircle} accent="amber" delay={250} live />
          <MetricTile label="Total Foto Bukti" value="342" sub="semua ter-watermark" icon={Camera} accent="violet" delay={325} />
          <MetricTile label="Officer Aktif" value="12" sub="online via MDM" icon={Users} accent="primary" delay={400} live />
        </section>

        {/* ================================================= */}
        {/* LIVE MAP + ACTIVE OPS */}
        {/* ================================================= */}
        <section className="animate-in fade-in-0 slide-in-from-bottom-3 duration-700" style={{ animationDelay: "500ms", animationFillMode: "backwards" }}>
          <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">Live Positioning</p>
              <h2 className="font-heading text-3xl font-normal">
                Pantauan <span className="italic font-light text-slate-500">lokasi</span>.
              </h2>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-primary/10 text-primary border-primary/20 gap-1 text-[10px]">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                LIVE GPS (12)
              </Badge>
              <Badge variant="outline" className="text-[10px] font-mono gap-1">
                <Zap className="h-3 w-3" />
                4G/LTE · 42ms
              </Badge>
              <Badge variant="outline" className="text-[10px] font-mono gap-1">
                <Shield className="h-3 w-3 text-primary" />
                100% Knox Verified
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* DARK LIVE MAP */}
            <div className="lg:col-span-3">
              <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 h-120 shadow-xl hover:shadow-2xl transition-shadow duration-500">
                {/* Base dark gradient */}
                <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950/40" />

                {/* Grid overlay */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.08) 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                  }}
                />

                {/* Radar sweep */}
                <div className="absolute inset-0 overflow-hidden">
                  <div
                    className="absolute inset-0 origin-center animate-radar"
                    style={{
                      background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(16, 185, 129, 0.15) 30deg, transparent 60deg)`,
                    }}
                  />
                </div>

                {/* City zone glows */}
                <div className="absolute top-1/4 left-1/3 h-40 w-40 rounded-full bg-primary/10 blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-1/3 right-1/4 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/2 right-1/3 h-24 w-24 rounded-full bg-amber-500/10 blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />

                {/* Connection lines */}
                <svg className="absolute inset-0 pointer-events-none w-full h-full">
                  <defs>
                    <linearGradient id="connLine" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(16, 185, 129, 0)" />
                      <stop offset="50%" stopColor="rgba(16, 185, 129, 0.3)" />
                      <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
                    </linearGradient>
                  </defs>
                  <line x1="45%" y1="38%" x2="28%" y2="25%" stroke="url(#connLine)" strokeWidth="1" strokeDasharray="4 4" className="animate-dash" />
                  <line x1="45%" y1="38%" x2="70%" y2="42%" stroke="url(#connLine)" strokeWidth="1" strokeDasharray="4 4" className="animate-dash" style={{ animationDelay: "1s" }} />
                  <line x1="45%" y1="38%" x2="18%" y2="55%" stroke="url(#connLine)" strokeWidth="1" strokeDasharray="4 4" className="animate-dash" style={{ animationDelay: "2s" }} />
                </svg>

                {/* Zone label */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-primary/40 backdrop-blur-md shadow-xl">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary font-mono">
                    ZONA · JABODETABEK CORE
                  </span>
                </div>

                {/* Live indicator top-right */}
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-700 backdrop-blur-md">
                  <Satellite className="h-3 w-3 text-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-slate-300">
                    12 ACTIVE · ±3.2m
                  </span>
                </div>

                {/* City labels */}
                <div className="absolute top-28 left-28 text-[10px] font-bold text-slate-500/60 uppercase tracking-widest">Teluk Jakarta</div>
                <div className="absolute top-45 left-55 text-[10px] font-bold text-slate-500/60 uppercase tracking-widest">Jakarta Pusat</div>
                <div className="absolute top-28 left-80 text-[10px] font-bold text-slate-500/60 uppercase tracking-widest">Jakarta Timur</div>
                <div className="absolute top-80 left-70 text-[10px] font-bold text-slate-500/60 uppercase tracking-widest">Jakarta Selatan</div>
                <div className="absolute top-70 left-20 text-[10px] font-bold text-slate-500/60 uppercase tracking-widest">Jakarta Barat</div>

                {/* Officer markers */}
                <OfficerMarker name="Pak Ahmad" code="AHM-07" status="AUDIT" x="45%" y="38%" variant="live" />
                <OfficerMarker name="Bu Siti" code="SIT-11" status="STOP" x="52%" y="58%" variant="warn" />
                <OfficerMarker name="Mas Doni" code="DON-04" status="AUDIT" x="28%" y="25%" variant="live" />
                <OfficerMarker name="Pak Hendra" code="HEN-09" status="ON FIELD" x="70%" y="42%" variant="live" />
                <OfficerMarker name="Bu Lestari" code="LES-18" status="AUDIT" x="18%" y="55%" variant="live" />
                <OfficerMarker name="Bu Rini" code="RIN-15" status="EN ROUTE" x="60%" y="30%" variant="route" />

                {/* Scan line */}
                <div className="absolute inset-x-0 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent animate-scanline pointer-events-none shadow-lg shadow-primary/50" />

                {/* Legend */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3 text-[10px] font-mono bg-slate-950/80 border border-slate-700 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg">
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                      </span>
                      <span className="text-slate-200 font-medium">Live Audit (8)</span>
                    </div>
                    <span className="text-slate-600">·</span>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                      <span className="text-slate-200 font-medium">Perjalanan (4)</span>
                    </div>
                    <span className="text-slate-600">·</span>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-slate-200 font-medium">Review (3)</span>
                    </div>
                  </div>
                  <Badge className="bg-slate-950/80 border border-primary/30 text-primary text-[10px] font-mono backdrop-blur-md shadow-lg gap-1">
                    <Zap className="h-3 w-3 animate-pulse" />
                    4G/LTE · 42ms
                  </Badge>
                </div>

                {/* Corner brackets sci-fi */}
                <div className="absolute top-16 left-2 w-6 h-6 border-l-2 border-t-2 border-primary/60" />
                <div className="absolute top-16 right-2 w-6 h-6 border-r-2 border-t-2 border-primary/60" />
                <div className="absolute bottom-14 left-2 w-6 h-6 border-l-2 border-b-2 border-primary/60" />
                <div className="absolute bottom-14 right-2 w-6 h-6 border-r-2 border-b-2 border-primary/60" />
              </div>

              {/* Tech strip */}
              <div className="grid grid-cols-3 gap-3 mt-3">
                <TechCell icon={MapPin} label="Geofencing" value="Radius Max 50m" />
                <TechCell icon={Zap} label="Latensi" value="42 ms (4G/LTE)" />
                <TechCell icon={Shield} label="Device" value="100% Knox Verified" />
              </div>
            </div>

            {/* Active ops sidebar */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Active Operations</p>
                  <h3 className="font-heading text-xl font-normal mt-0.5">
                    Aktivitas <span className="italic font-light text-slate-500">lapangan</span>
                  </h3>
                </div>
                <Badge variant="outline" className="text-[10px]">31 Terjadwal</Badge>
              </div>

              {operations.map((op, i) => (
                <OperationCard key={op.id} op={op} delay={600 + i * 100} />
              ))}

              <Button variant="outline" size="sm" className="w-full gap-1.5">
                Muat Lebih Banyak (24 tersedia)
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </section>

        {/* ================================================= */}
        {/* EVIDENCE GALLERY */}
        {/* ================================================= */}
        <section className="animate-in fade-in-0 slide-in-from-bottom-3 duration-700" style={{ animationDelay: "900ms", animationFillMode: "backwards" }}>
          <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">Evidence Vault</p>
              <h2 className="font-heading text-3xl font-normal">
                Setiap foto, <span className="italic font-light text-slate-500">terverifikasi</span>.
              </h2>
              <p className="text-xs text-muted-foreground mt-1 max-w-md">
                GPS-watermarked · Time-stamped · AES-256 encrypted · BSrE signed
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Filter className="h-3.5 w-3.5" />
                Semua Foto (342)
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                Anomali (38)
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {photos.map((p, i) => (
              <GalleryPhoto key={i} photo={p} delay={1000 + i * 60} />
            ))}
          </div>

          {/* EXIF strip */}
          <Card className="mt-4 overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="py-3 flex items-center gap-4 flex-wrap">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 animate-float">
                <QrCode className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-0.5">Digital Watermark · EXIF Reader</p>
                <p className="text-xs text-foreground font-mono truncate">
                  Lat <span className="text-primary">−6.2254°</span> · Long <span className="text-primary">106.8091°</span>{" "}
                  · SCBD Sudirman · 19 Okt 2026, 10:34:12 WIB
                </p>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                  Samsung Galaxy XCover 6 Pro (MDM) · SHA-256: <code className="text-primary">e8b94172c47b8ac...</code>
                </p>
              </div>
              <Badge className="bg-primary text-white border-0 gap-1 shrink-0">
                <CheckCircle2 className="h-3 w-3" />
                BSrE Verified
              </Badge>
            </CardContent>
          </Card>
        </section>

        {/* ================================================= */}
        {/* CHAIN OF CUSTODY */}
        {/* ================================================= */}
        <section className="animate-in fade-in-0 slide-in-from-bottom-3 duration-700" style={{ animationDelay: "1300ms", animationFillMode: "backwards" }}>
          <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">The Investigation</p>
              <h2 className="font-heading text-3xl font-normal">
                Jejak audit <span className="italic font-light text-slate-500">PT Nusantara Megah</span>.
              </h2>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono gap-1.5">
              <Hash className="h-3 w-3 text-primary" />
              Audit ID #WRK-2026-IKP-0842
            </Badge>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="pt-6 pb-0">
              <div className="relative">
                <div className="absolute left-9 top-2 bottom-24 w-px bg-linear-to-b from-primary via-primary/40 to-slate-200" />
                <div className="space-y-6">
                  {chainOfCustody.map((c, i) => (
                    <CustodyStep key={i} step={c} num={i + 1} delay={1400 + i * 80} />
                  ))}
                </div>
              </div>
            </CardContent>

            <div className="border-t bg-linear-to-r from-primary/5 via-white to-primary/5 px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <Timer className="h-5 w-5 text-primary" />
                  </div>
                  <div className="absolute -inset-1 rounded-xl bg-primary/20 blur-md animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">Tahap Aktif · Review Wasrik Wilayah</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Petugas Wasrik Wilayah dapat memvalidasi / menolak / sanksi administratif
                  </p>
                </div>
              </div>
              <Badge className="bg-amber-50 border border-amber-200 text-amber-700 gap-1.5 text-[10px] font-mono">
                <Clock className="h-3 w-3 animate-pulse" />
                SLA: 1 jam 25 menit tersisa
              </Badge>
            </div>
          </Card>
        </section>

        {/* ================================================= */}
        {/* OFFICER ROSTER */}
        {/* ================================================= */}
        <section className="animate-in fade-in-0 slide-in-from-bottom-3 duration-700" style={{ animationDelay: "2000ms", animationFillMode: "backwards" }}>
          <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">Field Officers</p>
              <h2 className="font-heading text-3xl font-normal">
                Status <span className="italic font-light text-slate-500">personel</span>.
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                8 ON DUTY
              </Badge>
              <Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/90">
                <Radio className="h-3.5 w-3.5" />
                Broadcast
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {officers.map((o, i) => (
              <OfficerCard key={o.code} officer={o} delay={2100 + i * 60} />
            ))}
          </div>
        </section>

        {/* ================================================= */}
        {/* FINAL CERTIFICATION */}
        {/* ================================================= */}
        <section className="animate-in fade-in-0 slide-in-from-bottom-3 duration-700" style={{ animationDelay: "2700ms", animationFillMode: "backwards" }}>
          <Card className="relative overflow-hidden hover:shadow-xl transition-shadow duration-500">
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-200/20 blur-3xl pointer-events-none" />

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 p-8 lg:p-12">
              <div className="lg:col-span-8 space-y-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  Field Operations Charter · Pasal 5
                </p>

                <h2 className="font-heading text-4xl lg:text-5xl text-foreground leading-tight tracking-tight">
                  <span className="italic font-light text-slate-400">Bukti lapangan</span>
                  <br />
                  adalah kebenaran yang
                  <br />
                  <span className="font-bold text-primary">tidak bisa dibantah</span>
                  <span className="text-primary">.</span>
                </h2>

                <div className="h-px w-16 bg-foreground/20" />

                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  <p>
                    Setiap foto ter-watermark GPS, setiap tanda tangan ter-sertifikasi{" "}
                    <strong className="text-foreground">BSrE</strong>, setiap langkah ter-hash{" "}
                    <strong className="text-foreground">SHA-256</strong>. Audit lapangan bukan akhir —
                    ini pintu masuk ke proses hukum yang dapat dipertanggungjawabkan.
                  </p>
                  <p>
                    Field officer kami bukan sekadar petugas lapangan — mereka adalah{" "}
                    <em className="text-foreground">saksi digital</em> yang setiap tindakannya menjadi
                    bukti forensik, admissible dalam pengadilan tata usaha negara.
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap pt-3">
                  <Button className="gap-2 bg-primary hover:bg-primary/90 shadow-md hover:shadow-xl hover:shadow-primary/20 transition-all">
                    <Lock className="h-4 w-4" />
                    Verifikasi Chain Signature
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <FileCheck className="h-4 w-4" />
                    Field Ops Charter
                  </Button>
                </div>
              </div>

              {/* Certification seal */}
              <div className="lg:col-span-4 flex items-center justify-center">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/30 transition-all animate-pulse-slow" />
                  <div className="relative h-56 w-56 rounded-full border-2 border-primary/40 bg-white flex items-center justify-center shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-700">
                    <div className="h-48 w-48 rounded-full border border-dashed border-primary/30 flex items-center justify-center">
                      <div className="text-center space-y-1">
                        <Shield className="h-10 w-10 text-primary mx-auto mb-2 animate-float" />
                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-foreground">Chain Verified</p>
                        <div className="h-px w-12 bg-primary/40 mx-auto" />
                        <p className="font-heading text-2xl font-bold text-primary italic">SHA-256</p>
                        <p className="text-[9px] text-muted-foreground font-mono">#WRK-2026-0842</p>
                        <div className="h-px w-12 bg-primary/40 mx-auto" />
                        <p className="text-[9px] font-bold uppercase tracking-widest text-foreground">BSrE Signed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative border-t px-8 lg:px-12 py-4 flex items-center justify-between gap-4 flex-wrap bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="font-heading italic text-xl text-foreground">EmployerScan Field Ops</div>
                <div className="h-6 w-px bg-border" />
                <p className="text-[10px] text-muted-foreground font-mono">WASRIK DKI Jakarta · 27 Okt 2026 · 16:28 WIB</p>
              </div>
              <div className="flex items-center gap-2">
                <TrustStat value="342" label="Foto Forensik" />
                <div className="h-6 w-px bg-border" />
                <TrustStat value="BSrE" label="Sertifikasi" />
                <div className="h-6 w-px bg-border" />
                <TrustStat value="100%" label="Admissible" />
              </div>
            </div>
          </Card>
        </section>
      </div>
    </>
  )
}

// =========================================================
// COMPONENTS
// =========================================================

function TimerStat({ value, label, accent }: { value: string; label: string; accent: "primary" | "slate" | "amber" }) {
  const colors = { primary: "text-primary", slate: "text-foreground", amber: "text-amber-600" }
  return (
    <div className="text-center group">
      <p className={cn("font-heading text-xl font-bold tabular-nums leading-none group-hover:scale-110 transition-transform", colors[accent])}>{value}</p>
      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{label}</p>
    </div>
  )
}

function MetricTile({ label, value, sub, icon: Icon, accent, live, delay }: { label: string; value: string; sub: string; icon: any; accent: string; live?: boolean; delay: number }) {
  const colors: Record<string, { ring: string; icon: string; text: string }> = {
    primary: { ring: "border-l-emerald-500", icon: "bg-emerald-50 text-emerald-600", text: "text-emerald-600" },
    blue: { ring: "border-l-blue-500", icon: "bg-blue-50 text-blue-600", text: "text-blue-600" },
    amber: { ring: "border-l-amber-500", icon: "bg-amber-50 text-amber-600", text: "text-amber-600" },
    violet: { ring: "border-l-violet-500", icon: "bg-violet-50 text-violet-600", text: "text-violet-600" },
  }
  const c = colors[accent]
  return (
    <div
      className={cn("group relative rounded-2xl border border-l-4 bg-white p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-3", c.ring)}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform", c.icon)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <p className="font-heading text-3xl font-bold text-foreground tabular-nums leading-none">{value}</p>
        {live && <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", c.text.replace("text-", "bg-"))} />}
      </div>
      <p className="text-[10px] text-muted-foreground mt-1.5">{sub}</p>
    </div>
  )
}

function OfficerMarker({ name, code, status, x, y, variant }: { name: string; code: string; status: string; x: string; y: string; variant: "live" | "warn" | "route" }) {
  const colors = {
    live: { bg: "bg-primary", border: "border-primary", glow: "shadow-primary/60", pulse: "bg-primary/40", text: "text-primary" },
    warn: { bg: "bg-amber-500", border: "border-amber-500", glow: "shadow-amber-500/60", pulse: "bg-amber-400/40", text: "text-amber-400" },
    route: { bg: "bg-blue-500", border: "border-blue-500", glow: "shadow-blue-500/60", pulse: "bg-blue-400/40", text: "text-blue-400" },
  }
  const c = colors[variant]

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20" style={{ left: x, top: y }}>
      {/* Expanding pulse rings staggered */}
      <div className={cn("absolute inset-0 -m-6 rounded-full border animate-ping", c.border)} style={{ animationDuration: "2s" }} />
      <div className={cn("absolute inset-0 -m-4 rounded-full border animate-ping opacity-60", c.border)} style={{ animationDuration: "2s", animationDelay: "0.5s" }} />
      <div className={cn("absolute inset-0 -m-2 rounded-full animate-ping", c.pulse)} style={{ animationDuration: "2s", animationDelay: "1s" }} />

      {/* Glow halo */}
      <div className={cn("absolute inset-0 -m-3 rounded-full blur-md animate-pulse", c.pulse)} />

      {/* Movement trail dots */}
      <div className={cn("absolute top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full", c.bg)} style={{ left: "-16px", opacity: 0.5, animation: "trailMove 2s ease-out infinite" }} />
      <div className={cn("absolute top-1/2 -translate-y-1/2 h-1 w-1 rounded-full", c.bg)} style={{ left: "-24px", opacity: 0.3, animation: "trailMove 2s ease-out infinite", animationDelay: "0.3s" }} />
      <div className={cn("absolute top-1/2 -translate-y-1/2 h-0.5 w-0.5 rounded-full", c.bg)} style={{ left: "-32px", opacity: 0.15, animation: "trailMove 2s ease-out infinite", animationDelay: "0.6s" }} />

      {/* Center marker */}
      <div className={cn("relative h-6 w-6 rounded-full border-3 border-white shadow-xl flex items-center justify-center group-hover:scale-125 transition-transform duration-300", c.bg, c.glow)}>
        <div className="h-2 w-2 rounded-full bg-white" />
      </div>

      {/* Signal beam up (live only) */}
      {variant === "live" && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-px h-3 bg-linear-to-t from-primary to-transparent animate-pulse" />
      )}

      {/* Tooltip */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-30 group-hover:translate-y-1">
        <div className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className={cn("h-2 w-2 rounded-full animate-pulse", c.bg)} />
            <p className="text-[11px] font-bold text-white">{name}</p>
          </div>
          <p className={cn("text-[9px] font-mono mt-0.5", c.text)}>{code} · {status}</p>
          <div className="flex items-center gap-2 mt-1 pt-1 border-t border-slate-800">
            <Signal className="h-2.5 w-2.5 text-primary" />
            <span className="text-[9px] font-mono text-slate-400">Signal 94% · GPS Lock</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function TechCell({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-white p-3 flex items-center gap-3 hover:border-primary/40 hover:shadow-sm transition-all group">
      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="text-xs font-bold text-foreground truncate">{value}</p>
      </div>
    </div>
  )
}

function OperationCard({ op, delay }: { op: typeof operations[0]; delay: number }) {
  const isPrimary = op.statusColor === "primary"
  return (
    <Card
      className={cn("overflow-hidden hover:shadow-lg transition-all duration-500 animate-in fade-in-0 slide-in-from-right-2 group",
        isPrimary ? "border-primary/30 hover:border-primary/50" : "border-amber-300/50 hover:border-amber-400"
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Badge className={cn("text-[9px] font-bold gap-1 border",
            isPrimary ? "bg-primary/10 text-primary border-primary/20" : "bg-amber-50 text-amber-700 border-amber-200"
          )}>
            <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", isPrimary ? "bg-primary" : "bg-amber-500")} />
            {op.status}
          </Badge>
          <span className="text-[10px] text-muted-foreground font-mono">{op.duration}</span>
        </div>

        <h4 className="text-sm font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{op.bu}</h4>

        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>Field Officer:</span>
          <span className="text-foreground font-bold">{op.officer}</span>
          <Badge variant="outline" className="text-[8px] font-mono">{op.officerCode}</Badge>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{op.location}</span>
        </div>

        <div>
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-muted-foreground">Checklist {op.checklist}</span>
            <span className="text-muted-foreground">{op.photos} foto · ECRS <span className="text-red-600 font-bold">{op.ecrs}</span></span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-1000 animate-shimmer",
                isPrimary
                  ? "bg-linear-to-r from-primary via-emerald-300 to-primary"
                  : "bg-linear-to-r from-amber-500 via-amber-300 to-amber-500"
              )}
              style={{ width: `${op.progress}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className={cn("flex-1 text-[11px] h-8 gap-1 text-white", isPrimary ? "bg-primary hover:bg-primary/90" : "bg-amber-500 hover:bg-amber-600")}>
            <Eye className="h-3 w-3" />
            Lihat Detail
          </Button>
          <Button variant="outline" size="sm" className="text-[11px] h-8 gap-1">
            <Radio className="h-3 w-3" />
            Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function GalleryPhoto({ photo, delay }: { photo: typeof photos[0]; delay: number }) {
  return (
    <div
      className="group relative rounded-xl border bg-white overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-2"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      <div className="relative aspect-square bg-linear-to-br from-slate-100 via-slate-50 to-primary/5 overflow-hidden">
        <ImageIcon className="absolute inset-0 m-auto h-10 w-10 text-slate-300 group-hover:scale-125 group-hover:text-primary/30 transition-all duration-500" />

        {/* GPS watermark */}
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-sm">
          <MapPin className="h-2.5 w-2.5 text-primary animate-pulse" />
          <span className="text-[9px] font-mono font-bold text-white">{photo.time}</span>
        </div>

        {/* BSrE badge */}
        <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center shadow-md animate-float">
          <Shield className="h-3 w-3 text-white" />
        </div>

        {/* Officer label */}
        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-sm">
          <span className="text-[9px] font-bold text-foreground">{photo.officer}</span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button size="sm" className="gap-1 bg-white hover:bg-slate-100 text-foreground text-[10px] h-7">
            <Eye className="h-3 w-3" />
            Full View
          </Button>
        </div>
      </div>

      <div className="p-2.5">
        <p className="text-[11px] font-bold text-foreground truncate leading-tight">{photo.title}</p>
        <p className="text-[9px] text-muted-foreground mt-0.5 truncate">{photo.bu}</p>
        <div className="flex items-center gap-1 mt-1.5">
          <Hash className="h-2.5 w-2.5 text-primary" />
          <code className="text-[9px] font-mono text-primary">{photo.hash}</code>
        </div>
      </div>
    </div>
  )
}

function CustodyStep({ step, num, delay }: { step: typeof chainOfCustody[0]; num: number; delay: number }) {
  return (
    <div
      className="relative flex items-start gap-4 group animate-in fade-in-0 slide-in-from-left-2"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      <div className="relative shrink-0 z-10">
        <div className="h-11 w-11 rounded-full bg-white border-2 border-primary/30 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-primary group-hover:scale-110 transition-all">
          <step.icon className="h-5 w-5 text-primary" />
        </div>
        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-foreground text-white flex items-center justify-center text-[9px] font-mono font-bold shadow-sm">
          {num}
        </div>
      </div>
      <div className="flex-1 min-w-0 pb-2">
        <div className="flex items-baseline gap-3 mb-1 flex-wrap">
          <span className="font-heading text-base italic font-light text-foreground">{step.time}</span>
          <div className="h-px flex-1 bg-slate-200" />
          <Badge variant="outline" className="text-[9px]">{step.role}</Badge>
        </div>
        <h4 className="text-base font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{step.action}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed mt-1 max-w-2xl">{step.desc}</p>
      </div>
    </div>
  )
}

function OfficerCard({ officer, delay }: { officer: typeof officers[0]; delay: number }) {
  const statusColors: Record<string, { bg: string; border: string; text: string; dot: string; ring: string }> = {
    primary: { bg: "bg-primary/10", border: "border-primary/20", text: "text-primary", dot: "bg-primary", ring: "ring-primary/30" },
    blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", dot: "bg-blue-500", ring: "ring-blue-300" },
    slate: { bg: "bg-slate-100", border: "border-slate-200", text: "text-slate-600", dot: "bg-slate-400", ring: "ring-slate-300" },
  }
  const c = statusColors[officer.statusColor]
  return (
    <Card
      className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-2 group"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={cn("h-11 w-11 rounded-full flex items-center justify-center border-2 ring-4", c.bg, c.border, c.ring)}>
              <span className="font-heading text-sm font-bold text-foreground">
                {officer.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
              </span>
            </div>
            {officer.statusColor === "primary" && (
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-primary border-2 border-white animate-pulse" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">{officer.name}</p>
            <code className="text-[9px] font-mono text-muted-foreground">{officer.code}</code>
          </div>
        </div>

        <Badge className={cn("w-full justify-center text-[9px] font-bold border", c.bg, c.border, c.text)}>
          <span className={cn("h-1.5 w-1.5 rounded-full mr-1.5", c.dot, officer.statusColor === "primary" && "animate-pulse")} />
          {officer.status}
        </Badge>

        <div className="space-y-1.5 pt-1 border-t">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground flex items-center gap-1"><MapPin className="h-2.5 w-2.5" />{officer.zone}</span>
            <span className="text-muted-foreground font-mono">{officer.lastSync}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1 text-[9px]">
              <Signal className="h-2.5 w-2.5 text-primary" />
              <span className="text-muted-foreground">GPS</span>
              <span className="font-bold text-foreground tabular-nums">{officer.gps}%</span>
            </div>
            <div className="flex items-center gap-1 text-[9px]">
              <Battery className={cn("h-2.5 w-2.5", officer.battery > 50 ? "text-primary" : "text-amber-500")} />
              <span className="text-muted-foreground">Batt</span>
              <span className={cn("font-bold tabular-nums", officer.battery > 50 ? "text-foreground" : "text-amber-600")}>{officer.battery}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TrustStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-heading text-lg font-bold text-primary tabular-nums leading-none">{value}</p>
      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">{label}</p>
    </div>
  )
}