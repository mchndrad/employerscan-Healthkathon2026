import Link from "next/link"
import { cn } from "cn"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChevronRight, Download, Share2, Clock, CheckCircle2, Sparkles,
  Shield, FileCheck, AlertTriangle, Printer, Eye, ArrowRight,
  Building2, History, Search, Plus, FileText, Signature,
  Lock, FileSpreadsheet, Mail, Hash, Minus, RotateCw, Maximize2,
  CalendarDays, Settings2, ArrowLeftRight,
} from "lucide-react"

// =========================================================
// MOCK DATA
// =========================================================
const targetCompany = {
  name: "PT Nusantara Megah Logistik Tbk",
  npwp: "01.234.567.8-901.000",
  sektor: "Transportasi & Logistik",
  ecrs: 92,
  tier: "Kritis",
  wilayah: "DKI Jakarta",
}

const templates = [
  {
    id: "standard",
    title: "Standar BPJS v1.0",
    subtitle: "Format resmi Berita Acara & Disparitas",
    pages: "6 hal",
    badge: "DEFAULT WASRIK",
    badgeColor: "primary",
    active: true,
  },
  {
    id: "comprehensive",
    title: "Audit Komprehensif",
    subtitle: "Forensik lengkap 3 lembaga",
    pages: "10 hal",
    badge: "INVESTIGASI LANJUT",
    badgeColor: "slate",
    active: false,
  },
  {
    id: "executive",
    title: "Executive Summary",
    subtitle: "Briefing pimpinan cabang",
    pages: "3 hal",
    badge: "C-LEVEL / KADIV",
    badgeColor: "blue",
    active: false,
  },
  {
    id: "sp2",
    title: "Surat Peringatan Only",
    subtitle: "Draft SP-1 / SP-2 bersanksi",
    pages: "2 hal",
    badge: "YURIDIS FORMAL",
    badgeColor: "amber",
    active: false,
  },
]

const components = [
  { id: "exec", label: "Executive Summary & Skor Risiko", pages: "1 halaman", checked: true },
  { id: "profile", label: "Profil Perusahaan Lengkap & Legalitas AHU", pages: "1 halaman", checked: true },
  { id: "gap", label: "Hasil Analisis Gap (3 sumber: e-Dabu, DJP, WLKP)", pages: "2 halaman", checked: true },
  { id: "shap", label: "SHAP Explainability & Ringkasan Bahasa Alami", pages: "1 halaman", checked: true },
  { id: "rujukan", label: "Rujukan Hukum (UU 24/2011, Perpres 59/2024)", pages: "1 halaman", checked: true },
  { id: "sp1", label: "Draft Surat Peringatan Pertama (SP-1) Resmi", pages: "1 halaman", checked: true },
  { id: "checklist", label: "Checklist Tindak Lanjut & Jadwal Audit Lapangan", pages: "1 halaman", checked: true },
  { id: "digital", label: "Tanda Tangan Digital Tersertifikasi (BSrE / Wasrik)", pages: "Wajib", checked: true },
  { id: "forensic", label: "Lampiran Dokumen Bukti Forensik Payroll", pages: "Optional", checked: false },
]

const recentReports = [
  { company: "PT Nusantara Megah Logistik Tbk", npwp: "01.234.567.8-901.000", template: "Standar BPJS v1.0", pages: 6, generated: "Hari ini, 09:12", status: "Dikirim", recipient: "direksi@nusantara.co.id", ecrs: 92, tier: "Kritis" },
  { company: "PT Harapan Mandiri Konstruksi", npwp: "02.345.678.9-012.000", template: "Audit Komprehensif", pages: 10, generated: "Hari ini, 08:04", status: "Draft", recipient: "—", ecrs: 78, tier: "Berisiko" },
  { company: "CV Bintang Timur Perkasa", npwp: "03.456.789.0-123.000", template: "Surat Peringatan Only", pages: 2, generated: "26 Okt 2026, 17:33", status: "Dikirim", recipient: "legal@bintangtimur.id", ecrs: 65, tier: "Perhatian" },
  { company: "PT Samudra Niaga Internasional", npwp: "04.567.890.1-234.000", template: "Executive Summary", pages: 3, generated: "26 Okt 2026, 14:20", status: "Dikirim", recipient: "pimpinan@samudra.co.id", ecrs: 71, tier: "Perhatian" },
  { company: "PT Karya Abadi Sejahtera", npwp: "05.678.901.2-345.000", template: "Standar BPJS v1.0", pages: 6, generated: "25 Okt 2026, 11:48", status: "Diarsipkan", recipient: "—", ecrs: 54, tier: "Perhatian" },
]

// =========================================================
// MAIN PAGE
// =========================================================
export default function LaporanAuditPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      {/* ============== BREADCRUMB ============== */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-semibold">Laporan Audit</span>
      </div>

      {/* ============== EDITORIAL HEADER ============== */}
      <div className="flex items-start justify-between gap-4 flex-wrap animate-in fade-in-0 slide-in-from-top-2 duration-700">
        <div className="space-y-2 max-w-2xl">
          <h1 className="font-heading text-5xl text-foreground tracking-tight leading-none">
            <span className="italic font-light">Generator</span>
            <span className="font-normal"> Laporan Audit</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Hasilkan laporan PDF siap kirim ke pemberi kerja · <strong className="text-foreground">Target render &lt; 10 detik</strong> · Chain-of-custody kriptografis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/10 text-primary border-primary/20 gap-1.5 text-[10px] font-bold px-2.5 py-1">
            <Sparkles className="h-3 w-3" />
            AI ENGINE ACTIVE
          </Badge>
          <Badge variant="outline" className="gap-1.5 text-[10px] font-bold px-2.5 py-1">
            <FileCheck className="h-3 w-3" />
            MODE SIAP CETAK (A4 OFFICIAL)
          </Badge>
        </div>
      </div>

      {/* ============== TARGET COMPANY STRIP ============== */}
      <Card className="overflow-hidden border-primary/20 bg-linear-to-r from-primary/5 via-white to-white hover:shadow-lg transition-all duration-500 animate-in fade-in-0 slide-in-from-bottom-2" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
        <CardContent className="py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Target Perusahaan Wasrik</p>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="h-10 w-10 rounded-lg bg-linear-to-br from-red-500 to-red-700 flex items-center justify-center shadow-md">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground leading-tight">{targetCompany.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                    <span className="font-mono">NPWP: {targetCompany.npwp}</span>
                    <span>·</span>
                    <span>{targetCompany.sektor}</span>
                    <span>·</span>
                    <span>{targetCompany.wilayah}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">ECRS Score</p>
              <div className="flex items-center gap-2">
                <span className="font-heading text-3xl font-bold text-red-600 leading-none tabular-nums">{targetCompany.ecrs}</span>
                <Badge className="bg-red-50 text-red-700 border-red-200 text-[9px] font-bold">
                  {targetCompany.tier.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="h-10 w-px bg-border" />
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeftRight className="h-3.5 w-3.5" />
              Ganti Perusahaan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ============== 2-COLUMN: CONFIG + PREVIEW ============== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT: CONFIG */}
        <div className="lg:col-span-5 space-y-4 animate-in fade-in-0 slide-in-from-left-2 duration-500" style={{ animationDelay: "200ms", animationFillMode: "backwards" }}>
          {/* 1. Template Picker */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-5 space-y-3">
              <SectionHeader number="1" title="Pilih Template Dokumen" subtitle="BPJS Formats 2026" />
              <div className="grid grid-cols-2 gap-2">
                {templates.map((t) => (
                  <TemplateCard key={t.id} template={t} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 2. Periode */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-5 space-y-3">
              <SectionHeader number="2" title="Periode Pelaporan Audit" />
              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 border-2 border-primary/30 bg-primary/5 rounded-lg hover:bg-primary/10 transition-all group">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span className="flex-1 text-left text-sm font-semibold text-foreground">Periode: Oktober 2026 (Bulan Berjalan)</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </button>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="h-4 w-4 rounded border-2 border-primary bg-primary flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </div>
                <span className="text-xs text-foreground group-hover:text-primary transition-colors">
                  Sortasi tren riwayat 6 bulan terakhir (Mei – Okt 2026)
                </span>
              </label>
            </CardContent>
          </Card>

          {/* 3. Komponen */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <SectionHeader number="3" title="Komponen Laporan" />
                <Button variant="ghost" size="sm" className="text-[11px] h-7 gap-1 text-primary">
                  <CheckCircle2 className="h-3 w-3" />
                  Pilih Semua
                </Button>
              </div>
              <div className="space-y-2">
                {components.map((c, i) => (
                  <ComponentRow key={c.id} component={c} delay={300 + i * 30} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 4. Distribusi */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-5 space-y-3">
              <SectionHeader number="4" title="Distribusi & Penyampaian" />
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="h-4 w-4 rounded-full border-2 border-slate-300 group-hover:border-primary transition-colors shrink-0" />
                  <span className="text-xs text-foreground">Unduh PDF saja (arsip internal wasrik)</span>
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <div className="h-4 w-4 rounded-full border-2 border-primary bg-primary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-foreground font-semibold">Unduh + Kirim ke email resmi Direksi Perusahaan</span>
                    <div className="mt-2 flex items-center gap-2 px-2.5 py-2 bg-slate-50 border rounded-lg">
                      <Mail className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-xs text-foreground font-mono">direksi@nusantaramegah.co.id</span>
                    </div>
                    <div className="mt-2 space-y-1.5">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className="h-3.5 w-3.5 rounded border-2 border-primary bg-primary flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          CC: <code className="text-foreground">wasrik.dkijakarta@bpjs-kesehatan.go.id</code> (Tembusan Resmi)
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className="h-3.5 w-3.5 rounded border-2 border-slate-300 shrink-0" />
                        <span className="text-[11px] text-muted-foreground">Notifikasi WhatsApp Business Resmi BPJS</span>
                      </label>
                    </div>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* GENERATE BUTTON */}
          <div className="space-y-2">
            <Button size="lg" className="w-full gap-2 h-13 bg-primary hover:bg-primary/90 text-base font-bold shadow-xl hover:shadow-2xl hover:shadow-primary/40 transition-all group">
              <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              Generate Laporan PDF
            </Button>
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border rounded-lg">
              <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="text-[11px] text-muted-foreground">
                Perkiraan waktu kompilasi: <strong className="text-foreground">7 – 10 detik</strong> (Parallel GPU Engine)
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed px-1 flex items-start gap-1.5">
              <Lock className="h-3 w-3 shrink-0 mt-0.5" />
              Dilindungi tanda tangan digital & chain-of-custody kriptografis BSrE Badan Siber dan Sandi Negara untuk validitas hukum di pengadilan.
            </p>
          </div>
        </div>

        {/* RIGHT: PREVIEW */}
        <div className="lg:col-span-7 animate-in fade-in-0 slide-in-from-right-2 duration-500" style={{ animationDelay: "250ms", animationFillMode: "backwards" }}>
          <Card className="sticky top-4 overflow-hidden">
            <CardContent className="pt-5 space-y-3">
              {/* Preview Toolbar */}
              <div className="flex items-center justify-between gap-3 flex-wrap pb-3 border-b">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-base font-bold">Preview Laporan</h3>
                  <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <ChevronRight className="h-3.5 w-3.5 rotate-180" />
                    </Button>
                    <span className="text-[11px] font-semibold">Hal 1 / 6</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 border rounded-lg">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Minus className="h-3 w-3" /></Button>
                    <span className="text-[11px] font-semibold px-2">100%</span>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Plus className="h-3 w-3" /></Button>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><RotateCw className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Maximize2 className="h-3 w-3" /></Button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  <span className="text-muted-foreground">Draft v1.4 Validated</span>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  Unduh Draft PDF
                </Button>
              </div>

              {/* PDF Preview Canvas */}
              <div className="rounded-xl border-2 bg-slate-100 p-6 flex items-center justify-center min-h-150">
                <PdfPagePreview />
              </div>

              {/* Next Page Teaser */}
              <div className="flex items-center justify-between gap-3 p-3 border-2 border-dashed border-slate-200 rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-all group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-200 flex items-center justify-center font-bold text-slate-600 shrink-0 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                    Hal<br/>2
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Berikutnya: Ringkasan Eksekutif & Disparitas 3 Lembaga</p>
                    <p className="text-[11px] text-muted-foreground">Mencakup komparasi e-Dabu (1.240 jiwa), DJP SPT (1.510 jiwa), dan WLKP (1.920 jiwa)</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
                  Buka Halaman
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ============== RECENT REPORTS ARCHIVE ============== */}
      <Card className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500" style={{ animationDelay: "500ms", animationFillMode: "backwards" }}>
        <CardContent className="pt-5 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <History className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold">Arsip Laporan Terbit</h3>
                <p className="text-[11px] text-muted-foreground">1,420 laporan selama 30 hari terakhir · Audit trail blockchain Gov-Cloud</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari NPWP atau nama BU..."
                  className="pl-8 pr-3 py-2 text-xs border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-1.5">
                <FileSpreadsheet className="h-3.5 w-3.5" />
                Ekspor
              </Button>
              <Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/90">
                <Plus className="h-3.5 w-3.5" />
                Laporan Baru
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="text-left px-4 py-3">Badan Usaha</th>
                  <th className="text-left px-4 py-3">Template</th>
                  <th className="text-left px-4 py-3">Dibuat</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">ECRS</th>
                  <th className="text-right px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((r, i) => (
                  <ReportRow key={i} report={r} delay={600 + i * 40} />
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-2 text-[11px] text-muted-foreground">
            <span>Menampilkan 5 dari 1,420 laporan</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-7 text-[11px]">Sebelumnya</Button>
              <Button variant="outline" size="sm" className="h-7 text-[11px]">Berikutnya</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// =========================================================
// COMPONENTS
// =========================================================
function SectionHeader({ number, title, subtitle }: { number: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-heading text-sm font-bold text-foreground">{number}. {title}</span>
      {subtitle && <span className="text-[10px] text-muted-foreground">{subtitle}</span>}
    </div>
  )
}

function TemplateCard({ template }: { template: typeof templates[0] }) {
  const colors = {
    primary: "bg-emerald-100 text-emerald-700",
    slate: "bg-slate-100 text-slate-600",
    blue: "bg-blue-100 text-blue-700",
    amber: "bg-amber-100 text-amber-700",
  }
  return (
    <button
      className={cn(
        "text-left p-3 rounded-lg border-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md group",
        template.active
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-slate-200 bg-white hover:border-primary/40"
      )}
    >
      <div className="flex items-start justify-between mb-1.5">
        <h5 className="text-xs font-bold text-foreground leading-tight">{template.title}</h5>
        {template.active && (
          <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-3 w-3 text-white" />
          </div>
        )}
      </div>
      <p className="text-[10px] text-muted-foreground leading-tight mb-2">{template.subtitle}</p>
      <div className="flex items-center justify-between">
        <Badge className={cn("text-[8px] font-bold border-0 px-1.5 py-0", colors[template.badgeColor as keyof typeof colors])}>
          {template.badge}
        </Badge>
        <span className="text-[10px] font-semibold text-muted-foreground">{template.pages}</span>
      </div>
    </button>
  )
}

function ComponentRow({ component, delay = 0 }: { component: typeof components[0]; delay?: number }) {
  return (
    <label
      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer animate-in fade-in-0 slide-in-from-left-1"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      <div className={cn(
        "h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 transition-all",
        component.checked
          ? "border-primary bg-primary"
          : "border-slate-300 bg-white hover:border-primary"
      )}>
        {component.checked && <CheckCircle2 className="h-3 w-3 text-white" />}
      </div>
      <span className="flex-1 text-xs text-foreground">{component.label}</span>
      <span className="text-[10px] text-muted-foreground tabular-nums">{component.pages}</span>
    </label>
  )
}

function PdfPagePreview() {
  return (
    <div className="w-full max-w-md bg-white shadow-xl rounded-sm overflow-hidden" style={{ aspectRatio: "210/297" }}>
      {/* BPJS Header */}
      <div className="px-5 py-3 border-b-2 border-primary flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-foreground leading-none">BPJS KESEHATAN</p>
            <p className="text-[7px] text-muted-foreground">KEDEPUTIAN WILAYAH DKI JAKARTA</p>
            <p className="text-[7px] text-muted-foreground italic">Bidang Pengawasan dan Pemeriksaan (WASRIK)</p>
          </div>
        </div>
        <div className="text-right">
          <div className="h-5 w-16 rounded bg-primary flex items-center justify-center">
            <span className="text-[7px] font-bold text-white italic">EmployerScan</span>
          </div>
        </div>
      </div>

      {/* Rahasia Banner */}
      <div className="px-5 py-1.5 bg-red-50 border-b border-red-200 flex items-center justify-between">
        <span className="text-[8px] font-bold text-red-700 tracking-widest">RAHASIA · DOKUMEN WASRIK TERBATAS</span>
        <span className="text-[7px] text-red-600 font-mono">Kode Unik: 03-WSRK-2026-4842</span>
      </div>

      {/* Title */}
      <div className="px-5 py-6 text-center space-y-2">
        <div className="h-10 w-10 rounded-xl bg-primary mx-auto flex items-center justify-center">
          <FileCheck className="h-5 w-5 text-white" />
        </div>
        <h2 className="font-heading text-base font-bold text-foreground leading-tight">
          LAPORAN AUDIT KEPATUHAN<br />IURAN JKN
        </h2>
        <p className="text-[8px] text-muted-foreground">
          Pemberi Kerja Pekerja Penerima Upah (PPU) Badan Usaha Swasta
        </p>
      </div>

      {/* Table */}
      <div className="px-5 pb-4">
        <table className="w-full text-[8px]">
          <tbody>
            <tr className="border-b">
              <td className="py-1.5 text-muted-foreground">Nama Badan Usaha</td>
              <td className="py-1.5 font-bold text-foreground text-right">PT Nusantara Megah Logistik Tbk</td>
            </tr>
            <tr className="border-b">
              <td className="py-1.5 text-muted-foreground">NPWP Perusahaan</td>
              <td className="py-1.5 font-mono font-bold text-foreground text-right">01.234.567.8-901.000</td>
            </tr>
            <tr className="border-b">
              <td className="py-1.5 text-muted-foreground">Periode Audit</td>
              <td className="py-1.5 font-bold text-foreground text-right">Oktober 2026 (Tahun Anggaran 2026)</td>
            </tr>
            <tr className="border-b">
              <td className="py-1.5 text-muted-foreground">Klasifikasi Risiko</td>
              <td className="py-1.5 text-right">
                <span className="inline-block px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold text-[7px]">
                  ECRS 92 / 100 · KRITIS TINGKAT NASIONAL
                </span>
              </td>
            </tr>
            <tr>
              <td className="py-1.5 text-muted-foreground">Tim Pemeriksa</td>
              <td className="py-1.5 font-bold text-foreground text-right">Kantor Cabang Utama Jakarta Selatan<br/>· Wasrik Wilayah DKI</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Registration + QR */}
      <div className="px-5 py-3 border-t bg-slate-50 flex items-center justify-between">
        <div>
          <p className="text-[7px] font-bold text-muted-foreground mb-0.5">NOMOR REGISTRASI WASRIK</p>
          <p className="text-[8px] font-mono font-bold text-foreground">BPJS-WASRIK/LA/2026/X/0842</p>
          <p className="text-[7px] text-muted-foreground mt-1">Tanggal Terbit: 19 Oktober 2026</p>
        </div>
        <div className="text-right">
          <div className="h-10 w-10 bg-foreground rounded ml-auto grid grid-cols-5 grid-rows-5 gap-px p-0.5">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className={cn("rounded-[1px]", Math.random() > 0.4 ? "bg-white" : "bg-foreground")} />
            ))}
          </div>
          <p className="text-[7px] font-bold text-primary mt-1">TANDA TANGAN ELEKTRONIK</p>
          <p className="text-[6px] text-muted-foreground">BSrE DIGITAL ID</p>
        </div>
      </div>
    </div>
  )
}

function ReportRow({ report, delay = 0 }: { report: typeof recentReports[0]; delay?: number }) {
  const tierColors: Record<string, string> = {
    "Kritis": "bg-red-50 text-red-700 border-red-200",
    "Berisiko": "bg-orange-50 text-orange-700 border-orange-200",
    "Perhatian": "bg-amber-50 text-amber-700 border-amber-200",
  }
  const statusColors: Record<string, string> = {
    "Dikirim": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Draft": "bg-blue-50 text-blue-700 border-blue-200",
    "Diarsipkan": "bg-slate-100 text-slate-600 border-slate-200",
  }
  return (
    <tr
      className="border-b last:border-0 hover:bg-slate-50 transition-colors group animate-in fade-in-0 slide-in-from-bottom-1"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center shrink-0">
            <Building2 className="h-4 w-4 text-slate-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">{report.company}</p>
            <p className="text-[10px] text-muted-foreground font-mono">{report.npwp}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="text-xs font-semibold text-foreground">{report.template}</p>
        <p className="text-[10px] text-muted-foreground">{report.pages} halaman</p>
      </td>
      <td className="px-4 py-3">
        <p className="text-xs text-foreground">{report.generated}</p>
        {report.recipient !== "—" && (
          <p className="text-[10px] text-muted-foreground font-mono truncate max-w-45">→ {report.recipient}</p>
        )}
      </td>
      <td className="px-4 py-3">
        <Badge className={cn("text-[9px] font-bold border", statusColors[report.status])}>
          {report.status}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="font-heading text-base font-bold text-foreground tabular-nums">{report.ecrs}</span>
          <Badge className={cn("text-[8px] font-bold border", tierColors[report.tier])}>
            {report.tier}
          </Badge>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Preview">
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Unduh">
            <Download className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Bagikan">
            <Share2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  )
}