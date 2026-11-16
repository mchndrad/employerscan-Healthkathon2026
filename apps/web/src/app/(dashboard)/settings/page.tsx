"use client"

import Link from "next/link"
import { cn } from "cn"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChevronRight, Search, Download, Upload, Plus, UserPlus,
  User, Users, Shield, ShieldCheck, Lock, Bell, Link2, Building2,
  CheckCircle2, XCircle, ChevronDown, Settings as SettingsIcon,
  Key, Fingerprint, Database, History, Zap, Globe, FileCheck,
  AlertCircle, ArrowRight, Pause, X,
} from "lucide-react"

const tabs = [
  { label: "Profil Saya", icon: User, active: false },
  { label: "Users & Roles", icon: Users, active: true, badge: "47" },
  { label: "Keamanan & 2FA", icon: ShieldCheck, active: false },
  { label: "Integrasi API", icon: Link2, active: false },
  { label: "Notifikasi", icon: Bell, active: false },
  { label: "Organisasi", icon: Building2, active: false },
  { label: "Sistem", icon: SettingsIcon, active: false },
]

const stats = [
  { label: "Total User", value: "47", sub: "Aktif · Terdaftar di Ditjen Wasrik", icon: Users, accent: "primary" },
  { label: "Admin", value: "3", sub: "1 Super Admin · 2 Admin", icon: Shield, accent: "violet" },
  { label: "Wasrik", value: "28", sub: "Pemeriksa · 5 Wilayah Kota DKI", icon: FileCheck, accent: "blue" },
  { label: "Field Officer", value: "16", sub: "Lapangan · Mobile Inspection Unit", icon: Fingerprint, accent: "amber" },
]

const roleColors = {
  SUPER_ADMIN: { bg: "bg-violet-100", text: "text-violet-700", pct: 6 },
  ADMIN: { bg: "bg-blue-100", text: "text-blue-700", pct: 6 },
  WASRIK: { bg: "bg-primary/10", text: "text-primary", pct: 60 },
  FIELD_OFFICER: { bg: "bg-amber-100", text: "text-amber-700", pct: 34 },
  VIEWER: { bg: "bg-slate-100", text: "text-slate-700", pct: 2 },
}

const users = [
  { name: "Pak Ahmad Hidayat", email: "ahmad.hidayat@bpjs-kesehatan.go.id", nip: "19850315201001001", role: "SUPER_ADMIN" as const, selected: false },
  { name: "Pak Budi Santoso", email: "budi.santoso@bpjs-kesehatan.go.id", nip: "19870222012011002", role: "WASRIK" as const, selected: true },
  { name: "Bu Siti Rahayu", email: "siti.rahayu@bpjs-kesehatan.go.id", nip: "19900115201012003", role: "FIELD_OFFICER" as const, selected: false },
  { name: "Pak Dimas Prayoga", email: "dimas.prayoga@bpjs-kesehatan.go.id", nip: "19920308201801004", role: "WASRIK" as const, selected: true },
  { name: "Demo Admin", email: "admin@demo.employerscan.id", nip: "DEMO-ADM-001", role: "SUPER_ADMIN" as const, selected: false, isDemo: true },
  { name: "Demo Wasrik", email: "wasrik@demo.employerscan.id", nip: "DEMO-WSR-002", role: "WASRIK" as const, selected: false, isDemo: true },
  { name: "Demo Field Officer", email: "field@demo.employerscan.id", nip: "DEMO-FLD-003", role: "FIELD_OFFICER" as const, selected: false, isDemo: true },
  { name: "Pak Rizky Pratama", email: "rizky@bpjs-kesehatan.go.id", nip: "19940810201001005", role: "WASRIK" as const, selected: true },
  { name: "Bu Rini Astuti", email: "rini.astuti@bpjs-kesehatan.go.id", nip: "19870412012012001", role: "ADMIN" as const, selected: false },
  { name: "Pak Hendra Wijaya", email: "hendra.wijaya@bpjs-kesehatan.go.id", nip: "19970510201601005", role: "WASRIK" as const, selected: false },
  { name: "Mas Doni Irawan", email: "doni.irawan@bpjs-kesehatan.go.id", nip: "19930104202102002", role: "FIELD_OFFICER" as const, selected: false },
  { name: "Bu Ratna Dewi", email: "ratna.dewi@bpjs-kesehatan.go.id", nip: "19930716201012004", role: "VIEWER" as const, selected: false },
]

const rbac = [
  { allowed: true, label: "Akses Profil & Riwayat Iuran BU", scope: "Read", desc: "Pemeriksaan profil badan usaha, kepesertaan, & riwayat pembayaran." },
  { allowed: true, label: "Terbitkan Laporan Audit Kepatuhan", scope: "Create", desc: "Pembuatan formulir LHA, rekomendasi sanksi, dan nota ketidakpatuhan." },
  { allowed: true, label: "Unduh & Ekspor PDF Resmi", scope: "Export", desc: "Watermarked PDF laporan kepatuhan dengan QR code validasi BSrE." },
  { allowed: true, label: "Geo-Intelligence & Field Monitor", scope: "Read", desc: "Pantau peta sebaran badan usaha bermasalah di 5 kota administratif." },
  { allowed: true, label: "Disposisi Penugasan Lapangan", scope: "Assign", desc: "Menerbitkan SP (Surat Tugas) pemeriksaan on-site ke Field Officer." },
  { allowed: false, label: "Hapus Data Badan Usaha", scope: "Delete", desc: "Dilarang keras. Hanya dapat dampak melalui persetujuan Super Admin." },
  { allowed: false, label: "Manajemen Pengguna & Akun", scope: "User Mgmt", desc: "Tidak diizinkan mengubah status akun atau kredensial petugas lain." },
  { allowed: false, label: "Konfigurasi API & Webhook", scope: "System Config", desc: "Dikelola eksklusif oleh Tim Keamanan Informasi BPJS Pusat." },
]

const modules = [
  { title: "Keamanan & 2FA", badge: "TINGGI", badgeColor: "primary", icon: ShieldCheck, desc: "Parameter autentikasi ketat bagi seluruh pemeriksa.", items: ["Password min. 12 karakter (simbol/angka)", "Session timeout 15 menit inaktif", "Metode TOTP Google Auth & SMS", "Kunci akun otomatis setelah 5× gagal"], action: "Buka Kebijakan" },
  { title: "Integrasi API Hub", badge: "4 ENDPOINT", badgeColor: "blue", icon: Link2, desc: "Sinkronisasi interoperabilitas lintas lembaga negara.", items: ["e-Dabu BPJS · Terhubung", "Ditjen Pajak PPh 21 · Terhubung", "WLKP Kemnaker · Rate 67%", "AHU Kemenkumham · Terhubung"], action: "Kelola Koneksi" },
  { title: "Notifikasi & Alert", badge: "AKTIF", badgeColor: "amber", icon: Bell, desc: "Jalur transmisi peringatan dini investigasi wasrik.", items: ["Email alert fraud > Rp 50 juta", "Push notif mobile petugas inspeksi", "Webhook Slack Wasrik DKI Jakarta", "Daily digest 17:00 WIB"], action: "Konfigurasi Channel" },
  { title: "Organisasi & Retensi", badge: "UU PDP", badgeColor: "violet", icon: Building2, desc: "Kepatuhan UU 27/2022 & manajemen log audit.", items: ["Retensi data 7 tahun (regulasi)", "Backup otomatis harian 02:00 WIB", "Unit: BPJS KC Utama DKI", "Enkripsi AES-256 end-to-end"], action: "Kelola Unit & Backup" },
]

export default function SettingsPage() {
  const selectedCount = users.filter(u => u.selected).length

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">Pengaturan Sistem</span>
      </div>

      {/* ===== EDITORIAL HERO ===== */}
      <section className="relative py-2 animate-in fade-in-0 slide-in-from-top-2 duration-700">
        <div className="absolute -top-10 -left-10 h-80 w-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-primary/10 text-primary border-primary/20 gap-1.5 text-[10px] font-bold">
                <Lock className="h-3 w-3" />
                RBAC AKTIF
              </Badge>
              <Badge variant="outline" className="text-[10px] gap-1">
                <ShieldCheck className="h-3 w-3 text-primary" />
                ISO 27001 Compliant
              </Badge>
            </div>

            <h1 className="font-heading text-5xl lg:text-6xl text-foreground tracking-tight leading-[0.95]">
              <span className="italic font-light text-slate-400">Pengaturan,</span>
              <br />
              <span className="font-normal">terkendali</span>
              <span className="text-primary">.</span>
            </h1>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
              Konfigurasi platform EmployerScan · Tata kelola <strong className="text-foreground">Role-Based Access Control</strong> ·
              BPJS Kesehatan Kantor Wilayah DKI Jakarta.
            </p>

            <div className="flex items-center gap-2 pt-2 flex-wrap">
              <Button size="sm" variant="outline" className="gap-1.5">
                <Upload className="h-3.5 w-3.5" />
                Import CSV
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5">
                <Download className="h-3.5 w-3.5" />
                Export
              </Button>
              <Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all">
                <UserPlus className="h-3.5 w-3.5" />
                Tambah User Baru
              </Button>
            </div>
          </div>

          {/* Last modified card */}
          <div className="lg:col-span-5 flex justify-end">
            <div className="relative group w-full lg:w-80">
              <div className="absolute -inset-3 bg-primary/10 blur-2xl rounded-3xl group-hover:bg-primary/20 transition-all" />
              <div className="relative bg-white rounded-2xl border p-5 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Last Modified</span>
                  <Badge className="bg-primary text-white border-0 text-[9px] gap-1">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    PROTECTED
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center font-bold text-violet-700">
                    AH
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Pak Ahmad Hidayat</p>
                    <p className="text-[10px] text-muted-foreground">Super Admin</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t space-y-2 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Diubah</span>
                    <span className="font-mono font-semibold text-foreground">19 Okt 2026, 10:30 WIB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Approval</span>
                    <code className="font-mono font-semibold text-primary">2-Man Rule</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Audit Hash</span>
                    <code className="font-mono font-semibold text-primary">#a8f3...e9d4</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TABS ===== */}
      <section className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          {tabs.map((tab) => (
            <TabButton key={tab.label} tab={tab} />
          ))}
        </div>
      </section>

      {/* ===== STATS + DONUT ===== */}
      <section className="grid grid-cols-1 md:grid-cols-6 gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-500" style={{ animationDelay: "200ms", animationFillMode: "backwards" }}>
        {stats.map((s, i) => (
          <div key={s.label} className="md:col-span-1">
            <StatCard stat={s} delay={i * 60} />
          </div>
        ))}
        <div className="md:col-span-2">
          <DistribusiRoleCard />
        </div>
      </section>

      {/* ===== FILTER BAR ===== */}
      <section className="rounded-xl border bg-white p-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-500" style={{ animationDelay: "300ms", animationFillMode: "backwards" }}>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari nama pengguna, NIP, email, atau role..."
              className="w-full pl-9 pr-3 py-2 text-xs border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <FilterPill label="Semua Role (5)" />
          <FilterPill label="Semua Status" />
        </div>
      </section>

      {/* ===== BULK ACTION BANNER ===== */}
      {selectedCount > 0 && (
        <section className="rounded-xl border bg-linear-to-r from-blue-600 to-blue-700 p-4 shadow-lg shadow-blue-600/20 animate-in fade-in-0 slide-in-from-top-1 duration-300">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="text-sm font-bold text-white">{selectedCount}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">{selectedCount} akun pengguna dipilih</p>
                <p className="text-[11px] text-blue-100">Terapkan tindakan massal pada data terpilih</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs bg-white hover:bg-slate-50 border-0">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                Aktifkan
              </Button>
              <Button size="sm" className="gap-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-white border-0">
                <Pause className="h-3.5 w-3.5" />
                Suspend
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5 text-xs bg-white hover:bg-slate-50 border-0">
                <Key className="h-3.5 w-3.5" />
                Ubah Role
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5 text-xs bg-white hover:bg-slate-50 border-0">
                <Download className="h-3.5 w-3.5" />
                Ekspor Terpilih
              </Button>
              <button className="h-7 w-7 rounded-md bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ===== USER TABLE + RBAC SIDE PANEL ===== */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-5 animate-in fade-in-0 slide-in-from-bottom-2 duration-500" style={{ animationDelay: "400ms", animationFillMode: "backwards" }}>
        {/* USER TABLE */}
        <Card className="xl:col-span-8 overflow-hidden">
          <div className="px-4 py-3 border-b bg-slate-50/50 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Daftar Pengguna Aktif</h3>
                <p className="text-[10px] text-muted-foreground">BPJS Wilayah DKI · Filter aktif: Semua Wilayah</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50/50 border-b">
                <tr className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="text-left px-4 py-2.5 w-10">
                    <input type="checkbox" className="accent-primary" />
                  </th>
                  <th className="text-left px-4 py-2.5">Pengguna</th>
                  <th className="text-left px-4 py-2.5">NIP</th>
                  <th className="text-left px-4 py-2.5">Role</th>
                  <th className="text-right px-4 py-2.5">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <UserRow key={i} user={u} delay={i * 25} />
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t flex items-center justify-between gap-2 flex-wrap">
            <p className="text-[11px] text-muted-foreground">
              Menampilkan <strong className="text-foreground">1–12</strong> dari <strong className="text-foreground">47</strong> pengguna aktif
            </p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-7 w-7 p-0 text-[11px]">‹</Button>
              <Button className="h-7 w-7 p-0 text-[11px] bg-primary hover:bg-primary/90">1</Button>
              <Button variant="outline" size="sm" className="h-7 w-7 p-0 text-[11px]">2</Button>
              <Button variant="outline" size="sm" className="h-7 w-7 p-0 text-[11px]">3</Button>
              <Button variant="outline" size="sm" className="h-7 w-7 p-0 text-[11px]">4</Button>
              <Button variant="outline" size="sm" className="h-7 w-7 p-0 text-[11px]">›</Button>
            </div>
          </div>
        </Card>

        {/* RBAC MATRIX SIDE PANEL */}
        <Card className="xl:col-span-4 overflow-hidden">
          <CardContent className="pt-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-linear-to-br from-primary to-emerald-600 flex items-center justify-center shadow-md shadow-primary/30">
                <Key className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Matriks Hak Akses</h3>
                <p className="text-[10px] text-muted-foreground">Role-Based Access Control (RBAC)</p>
              </div>
              <Badge variant="outline" className="ml-auto text-[9px] font-mono">WASRIK v4</Badge>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Pilih Role Pengguna</p>
              <button className="w-full flex items-center justify-between gap-2 px-3 py-2 border rounded-lg hover:border-primary/40 transition-colors text-left">
                <span className="text-xs font-semibold text-foreground">WASRIK (Pemeriksa Kepatuhan)</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Hak akses operasional untuk staf pemeriksa, verifikator badan usaha, dan penyidik kepatuhan iuran BPJS.
            </p>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Daftar Wewenang</p>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {rbac.map((r, i) => (
                  <RBACItem key={i} item={r} delay={i * 40} />
                ))}
              </div>
            </div>

            <Button size="sm" className="w-full gap-1.5 bg-primary hover:bg-primary/90 shadow-md">
              <Key className="h-3.5 w-3.5" />
              Ubah Hak Akses Role
            </Button>

            <Link href="/audit-log" className="flex items-center gap-1.5 text-[11px] text-primary hover:underline">
              <History className="h-3 w-3" />
              Lihat riwayat audit log perubahan izin
              <ArrowRight className="h-3 w-3" />
            </Link>

            <div className="rounded-lg bg-amber-50 border border-amber-200 p-2.5 flex items-start gap-2">
              <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-900 leading-relaxed">
                Perubahan hak akses membutuhkan otorisasi <strong>Super Admin</strong> dan verifikasi <strong>2-Man Rule</strong> sesuai standar kepatuhan BSSN RI.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ===== 4 INTEGRATED MODULES ===== */}
      <section className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500" style={{ animationDelay: "500ms", animationFillMode: "backwards" }}>
        <div className="flex items-end justify-between gap-4 mb-5 flex-wrap">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Modul Terintegrasi</p>
            <h2 className="text-lg font-bold text-foreground">Pengaturan Lainnya</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Konfigurasi tata kelola infrastruktur keamanan & interkoneksi data</p>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono">4 Modul Terhubung</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {modules.map((m, i) => (
            <ModuleCard key={m.title} module={m} delay={i * 70} />
          ))}
        </div>
      </section>

      {/* ===== COMPLIANCE FOOTER ===== */}
      <section className="rounded-xl border bg-linear-to-r from-slate-50 via-white to-primary/5 p-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-500" style={{ animationDelay: "600ms", animationFillMode: "backwards" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ComplianceLine icon={Globe} label="Gov-Cloud Sync" value="Semua perubahan tersinkronisasi otomatis" />
          <ComplianceLine icon={Database} label="Cadangan Terakhir" value="Hari ini, 02:00 WIB (AES-256)" />
          <ComplianceLine icon={ShieldCheck} label="Standar Kepatuhan" value="ISO 27001 · UU 27/2022 PDP · BSrE BSSN RI" />
        </div>
      </section>
    </div>
  )
}

// =========================================================
// COMPONENTS
// =========================================================

function TabButton({ tab }: { tab: typeof tabs[0] }) {
  return (
    <button className={cn(
      "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0",
      tab.active
        ? "bg-white text-foreground shadow-sm"
        : "text-muted-foreground hover:text-foreground hover:bg-white/60"
    )}>
      <tab.icon className={cn("h-3.5 w-3.5", tab.active && "text-primary")} />
      {tab.label}
      {tab.badge && (
        <Badge className="bg-primary text-white border-0 text-[9px] ml-1">{tab.badge}</Badge>
      )}
    </button>
  )
}

function StatCard({ stat, delay }: { stat: typeof stats[0]; delay: number }) {
  const colors: Record<string, { bg: string; text: string }> = {
    primary: { bg: "bg-primary/10", text: "text-primary" },
    violet: { bg: "bg-violet-100", text: "text-violet-700" },
    blue: { bg: "bg-blue-100", text: "text-blue-700" },
    amber: { bg: "bg-amber-100", text: "text-amber-700" },
  }
  const c = colors[stat.accent]
  return (
    <div
      className="group rounded-xl border bg-white p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-2 h-full"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
        <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform", c.bg, c.text)}>
          <stat.icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <p className="font-heading text-3xl font-bold text-foreground tabular-nums leading-none">{stat.value}</p>
      <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{stat.sub}</p>
    </div>
  )
}

function DistribusiRoleCard() {
  return (
    <div className="rounded-xl border bg-white p-4 hover:shadow-md transition-all duration-300 h-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Distribusi Role</p>
          <p className="text-[10px] text-muted-foreground">Komposisi hak akses aktif</p>
        </div>
        <span className="text-[11px] font-bold text-muted-foreground">Total <span className="text-foreground tabular-nums">47</span></span>
      </div>

      <div className="flex items-center gap-4">
        {/* Donut SVG */}
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="12" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="12" strokeDasharray="15 251" strokeDashoffset="0" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray="15 251" strokeDashoffset="-15" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="150 251" strokeDashoffset="-30" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="12" strokeDasharray="85 251" strokeDashoffset="-180" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="font-heading text-base font-bold tabular-nums">47</span>
            <span className="text-[8px] text-muted-foreground uppercase tracking-widest">Aktif</span>
          </div>
        </div>

        <div className="flex-1 space-y-1">
          <RoleLegend color="#8b5cf6" label="Super Admin" value="3 (6%)" />
          <RoleLegend color="#3b82f6" label="Admin" value="3 (6%)" />
          <RoleLegend color="#10b981" label="Wasrik" value="28 (60%)" />
          <RoleLegend color="#f59e0b" label="Field Officer" value="16 (34%)" />
        </div>
      </div>
    </div>
  )
}

function RoleLegend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 text-[10px]">
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-sm shrink-0" style={{ backgroundColor: color }} />
        <span className="text-foreground font-medium">{label}</span>
      </div>
      <span className="text-muted-foreground font-mono tabular-nums">{value}</span>
    </div>
  )
}

function FilterPill({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-1.5 px-3 py-2 text-xs border rounded-lg bg-white hover:border-primary/40 hover:bg-slate-50 transition-colors">
      <span className="text-foreground font-medium">{label}</span>
      <ChevronDown className="h-3 w-3 text-muted-foreground" />
    </button>
  )
}

function UserRow({ user, delay }: { user: typeof users[0]; delay: number }) {
  const c = roleColors[user.role]
  return (
    <tr
      className={cn("border-b last:border-0 hover:bg-slate-50/50 transition-colors group animate-in fade-in-0",
        user.selected && "bg-blue-50/40"
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      <td className="px-4 py-2.5">
        <input type="checkbox" className="accent-primary" defaultChecked={user.selected} />
      </td>
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className={cn("h-8 w-8 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0", c.bg, c.text)}>
            {user.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-foreground truncate">{user.name}</p>
              {user.isDemo && <Badge variant="outline" className="text-[8px] font-mono">DEMO</Badge>}
            </div>
            <code className="text-[9px] font-mono text-muted-foreground truncate">{user.email}</code>
          </div>
        </div>
      </td>
      <td className="px-4 py-2.5">
        <code className="text-[10px] font-mono text-muted-foreground">{user.nip}</code>
      </td>
      <td className="px-4 py-2.5">
        <Badge className={cn("text-[9px] font-bold border-0 font-mono", c.bg, c.text)}>
          {user.role}
        </Badge>
      </td>
      <td className="px-4 py-2.5 text-right">
        <button className="text-[11px] text-primary hover:underline font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
          Edit
        </button>
      </td>
    </tr>
  )
}

function RBACItem({ item, delay }: { item: typeof rbac[0]; delay: number }) {
  return (
    <div
      className={cn(
        "rounded-lg border p-2.5 transition-all animate-in fade-in-0 slide-in-from-left-1",
        item.allowed
          ? "bg-primary/5 border-primary/20 hover:border-primary/40"
          : "bg-red-50/50 border-red-200/60 hover:border-red-300"
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      <div className="flex items-start gap-2">
        <div className={cn("h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
          item.allowed ? "bg-primary text-white" : "bg-red-500 text-white"
        )}>
          {item.allowed ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className={cn("text-[11px] font-bold leading-tight",
              item.allowed ? "text-foreground" : "text-red-900"
            )}>{item.label}</p>
            <Badge className={cn("text-[8px] font-mono border-0",
              item.allowed ? "bg-primary/10 text-primary" : "bg-red-100 text-red-700"
            )}>
              {item.scope}
            </Badge>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
        </div>
      </div>
    </div>
  )
}

function ModuleCard({ module, delay }: { module: typeof modules[0]; delay: number }) {
  const badgeColors: Record<string, string> = {
    primary: "bg-primary/10 text-primary border-primary/20",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    amber: "bg-amber-100 text-amber-700 border-amber-200",
    violet: "bg-violet-100 text-violet-700 border-violet-200",
  }
  return (
    <Card
      className="overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group animate-in fade-in-0 slide-in-from-bottom-2"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      <CardContent className="pt-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform">
            <module.icon className="h-5 w-5 text-primary" />
          </div>
          <Badge className={cn("text-[9px] font-bold border", badgeColors[module.badgeColor])}>
            {module.badge}
          </Badge>
        </div>

        <div>
          <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{module.title}</h4>
          <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">{module.desc}</p>
        </div>

        <div className="space-y-1.5 pt-2 border-t">
          {module.items.map((item, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-primary shrink-0 mt-0.5" />
              <p className="text-[10px] text-muted-foreground leading-relaxed">{item}</p>
            </div>
          ))}
        </div>

        <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs group-hover:border-primary/50 group-hover:bg-primary/5 transition-colors">
          {module.action}
          <ArrowRight className="h-3 w-3" />
        </Button>
      </CardContent>
    </Card>
  )
}

function ComplianceLine({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="text-xs font-semibold text-foreground">{value}</p>
      </div>
    </div>
  )
}