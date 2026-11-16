/**
 * HALAMAN TAMBAH BU + ECRS SCORING
 *
 * Flow:
 * 1. Form 4 bagian: Info BU, Alamat, PIC, Tenaga Kerja
 * 2. Tabel 12 bulan iuran
 * 3. Klik "Hitung Preview" → call API, show modal hasil
 * 4. Klik "Simpan ke Database" → save + redirect ke detail
 *
 * Path file: apps/web/src/app/(dashboard)/perusahaan/tambah/page.tsx
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChevronRight,
  Building2,
  MapPin,
  User,
  Users,
  FileText,
  Calculator,
  Save,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  X,
  Loader2,
} from "lucide-react"

const PROVINSI_LIST = [
  "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Kepulauan Riau",
  "Jambi", "Sumatera Selatan", "Bangka Belitung", "Bengkulu", "Lampung",
  "DKI Jakarta", "Banten", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta",
  "Jawa Timur", "Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur",
  "Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan",
  "Kalimantan Timur", "Kalimantan Utara", "Sulawesi Utara", "Sulawesi Tengah",
  "Sulawesi Selatan", "Sulawesi Tenggara", "Gorontalo", "Sulawesi Barat",
  "Maluku", "Maluku Utara", "Papua", "Papua Barat", "Papua Tengah",
  "Papua Pegunungan", "Papua Selatan", "Papua Barat Daya",
]

const SEKTOR_LIST = [
  "Manufaktur Tekstil", "Manufaktur Elektronik", "Manufaktur Makanan",
  "Perdagangan Besar", "Perdagangan Eceran", "Konstruksi", "Pertanian",
  "Perkebunan", "Pertambangan", "Transportasi & Logistik", "Jasa Keuangan",
  "Jasa Kesehatan", "Jasa Pendidikan", "Teknologi Informasi",
  "Properti & Real Estate", "Pariwisata & Akomodasi", "Energi & Utilitas", "Lainnya",
]

const BENTUK_BADAN_LIST = ["PT", "CV", "Firma", "Koperasi", "Yayasan"]

type MonthlyRow = {
  bulan: number
  tahun: number
  iuran_wajib: number
  iuran_dibayar: number
  rata_upah: number
}

type EcrsResult = {
  score: number
  tier: string
  tier_color: string
  shapContributions: Array<{
    feature: string
    label: string
    value: number
    contribution: number
  }>
  rekomendasi: string
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]

const fmtRupiah = (n: number): string => {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(2)} M`
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)} Jt`
  return `Rp ${n.toLocaleString("id-ID")}`
}

export default function TambahPerusahaanPage() {
  const router = useRouter()

  // Form data
  const [form, setForm] = useState({
    npwp: "",
    nama: "",
    bentuk_badan: "PT",
    alamat: "",
    kota: "",
    provinsi: "",
    kelurahan: "",
    kecamatan: "",
    sektor_usaha: "",
    tanggal_berdiri: "",
    pic_name: "",
    pic_phone: "",
    pic_email: "",
    jumlah_karyawan_terdaftar: "",
    jumlah_karyawan_aktual: "",
  })

  // Monthly reports (12 bulan default)
  const currentYear = new Date().getFullYear()
  const [monthly, setMonthly] = useState<MonthlyRow[]>(
    Array.from({ length: 12 }, (_, i) => ({
      bulan: i + 1,
      tahun: currentYear,
      iuran_wajib: 0,
      iuran_dibayar: 0,
      rata_upah: 0,
    })),
  )

  // UI state
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<EcrsResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Update form field
  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  // Update monthly row
  const updateMonthly = (idx: number, key: keyof MonthlyRow, value: number) => {
    setMonthly((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], [key]: value }
      return next
    })
  }

  // Fill all months with same value
  const fillAll = (key: keyof MonthlyRow, value: number) => {
    setMonthly((prev) => prev.map((row) => ({ ...row, [key]: value })))
  }

  // Validate form
  const validate = (): string | null => {
    if (!form.npwp.trim()) return "NPWP wajib diisi"
    if (!form.nama.trim()) return "Nama BU wajib diisi"
    if (!form.provinsi) return "Provinsi wajib dipilih"
    if (!form.sektor_usaha) return "Sektor usaha wajib dipilih"
    if (!form.jumlah_karyawan_terdaftar || Number(form.jumlah_karyawan_terdaftar) <= 0)
      return "Jumlah karyawan terdaftar wajib diisi"
    if (monthly.every((r) => r.iuran_wajib === 0))
      return "Minimal 1 bulan iuran wajib harus diisi"
    return null
  }

  // Preview score
  const handlePreview = async () => {
    const err = validate()
    if (err) {
      setError(err)
      return
    }

    setError(null)
    setLoading(true)

    try {
      const body = buildRequestBody(false)
      const res = await fetch("/api/score-ecrs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = await res.json()

      if (!res.ok) {
        setError(json.error ?? "Gagal menghitung skor")
      } else {
        setResult(json.result)
        setShowModal(true)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error tidak dikenal")
    } finally {
      setLoading(false)
    }
  }

  // Save to database
  const handleSave = async () => {
    const err = validate()
    if (err) {
      setError(err)
      return
    }

    setError(null)
    setLoading(true)

    try {
      const body = buildRequestBody(true)
      const res = await fetch("/api/score-ecrs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = await res.json()

      if (!res.ok) {
        setError(json.error ?? "Gagal menyimpan")
      } else {
        // Redirect ke halaman detail
        router.push(`/perusahaan/${json.npwp}`)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error tidak dikenal")
    } finally {
      setLoading(false)
    }
  }

  const buildRequestBody = (saveToDb: boolean) => ({
    npwp: form.npwp.trim(),
    nama: form.nama.trim(),
    bentuk_badan: form.bentuk_badan,
    alamat: form.alamat.trim(),
    kota: form.kota.trim(),
    provinsi: form.provinsi,
    kelurahan: form.kelurahan.trim() || null,
    kecamatan: form.kecamatan.trim() || null,
    sektor_usaha: form.sektor_usaha,
    tanggal_berdiri: form.tanggal_berdiri || null,
    pic_name: form.pic_name.trim() || null,
    pic_phone: form.pic_phone.trim() || null,
    pic_email: form.pic_email.trim() || null,
    jumlah_karyawan_terdaftar: Number(form.jumlah_karyawan_terdaftar),
    jumlah_karyawan_aktual: form.jumlah_karyawan_aktual
      ? Number(form.jumlah_karyawan_aktual)
      : null,
    monthlyReports: monthly.map((r) => ({
      bulan: r.bulan,
      tahun: r.tahun,
      iuran_wajib: r.iuran_wajib,
      iuran_dibayar: r.iuran_dibayar,
      tunggakan: Math.max(0, r.iuran_wajib - r.iuran_dibayar),
      rata_upah: r.rata_upah,
    })),
    saveToDb,
  })

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/perusahaan" className="hover:text-foreground transition-colors">
          Perusahaan
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">Tambah BU</span>
      </div>

      <Link href="/perusahaan">
        <Button variant="ghost" size="sm" className="gap-1 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar
        </Button>
      </Link>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-heading text-3xl text-foreground tracking-tight">
          Tambah Badan Usaha Baru
        </h1>
        <p className="text-sm text-muted-foreground">
          Isi data BU dan riwayat iuran 12 bulan. Sistem akan otomatis menghitung
          skor ECRS v4.2 menggunakan model XGBoost + SHAP breakdown.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-destructive">
              Terjadi kesalahan
            </p>
            <p className="text-xs text-destructive/80 mt-1">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-destructive hover:bg-destructive/10 p-1 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Info BU */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Informasi Badan Usaha</CardTitle>
                  <CardDescription className="text-xs">
                    Data identitas BU sesuai registrasi
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="NPWP *" required>
                  <Input
                    placeholder="01.234.567.8-123.000"
                    value={form.npwp}
                    onChange={(e) => updateField("npwp", e.target.value)}
                  />
                </Field>
                <Field label="Nama Badan Usaha *" required>
                  <Input
                    placeholder="PT Nama Perusahaan"
                    value={form.nama}
                    onChange={(e) => updateField("nama", e.target.value)}
                  />
                </Field>
                <Field label="Bentuk Badan *">
                  <Select
                    value={form.bentuk_badan}
                    onValueChange={(v) => updateField("bentuk_badan", v ?? "")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BENTUK_BADAN_LIST.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Sektor Usaha *" required>
                  <Select
                    value={form.sektor_usaha}
                    onValueChange={(v) => updateField("sektor_usaha", v ?? "")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih sektor..." />
                    </SelectTrigger>
                    <SelectContent>
                      {SEKTOR_LIST.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Tanggal Berdiri">
                  <Input
                    type="date"
                    value={form.tanggal_berdiri}
                    onChange={(e) => updateField("tanggal_berdiri", e.target.value)}
                  />
                </Field>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Alamat */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Lokasi</CardTitle>
                  <CardDescription className="text-xs">
                    Alamat lengkap BU
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Alamat Lengkap">
                <Input
                  placeholder="Jl. Contoh No. 123"
                  value={form.alamat}
                  onChange={(e) => updateField("alamat", e.target.value)}
                />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Kelurahan">
                  <Input
                    value={form.kelurahan}
                    onChange={(e) => updateField("kelurahan", e.target.value)}
                  />
                </Field>
                <Field label="Kecamatan">
                  <Input
                    value={form.kecamatan}
                    onChange={(e) => updateField("kecamatan", e.target.value)}
                  />
                </Field>
                <Field label="Kota/Kabupaten">
                  <Input
                    value={form.kota}
                    onChange={(e) => updateField("kota", e.target.value)}
                  />
                </Field>
                <Field label="Provinsi *" required>
                  <Select
                    value={form.provinsi}
                    onValueChange={(v) => updateField("provinsi", v ?? "")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih provinsi..." />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINSI_LIST.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: PIC */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Penanggung Jawab (PIC)</CardTitle>
                  <CardDescription className="text-xs">
                    Kontak untuk komunikasi WASRIK
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Nama PIC">
                  <Input
                    value={form.pic_name}
                    onChange={(e) => updateField("pic_name", e.target.value)}
                  />
                </Field>
                <Field label="Telepon">
                  <Input
                    type="tel"
                    placeholder="+62-xxx-xxxx-xxxx"
                    value={form.pic_phone}
                    onChange={(e) => updateField("pic_phone", e.target.value)}
                  />
                </Field>
                <Field label="Email">
                  <Input
                    type="email"
                    placeholder="pic@contoh.co.id"
                    value={form.pic_email}
                    onChange={(e) => updateField("pic_email", e.target.value)}
                  />
                </Field>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Tenaga Kerja */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Tenaga Kerja</CardTitle>
                  <CardDescription className="text-xs">
                    Jumlah karyawan dari BPJS vs Kemnaker
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Jumlah Terdaftar BPJS *" required>
                  <Input
                    type="number"
                    min="1"
                    value={form.jumlah_karyawan_terdaftar}
                    onChange={(e) =>
                      updateField("jumlah_karyawan_terdaftar", e.target.value)
                    }
                  />
                </Field>
                <Field
                  label="Jumlah Aktual (Kemnaker WLKP)"
                  hint="Opsional. Selisih dengan terdaftar jadi indikator PDUK."
                >
                  <Input
                    type="number"
                    min="0"
                    value={form.jumlah_karyawan_aktual}
                    onChange={(e) =>
                      updateField("jumlah_karyawan_aktual", e.target.value)
                    }
                  />
                </Field>
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Riwayat Iuran */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base">Riwayat Iuran 12 Bulan</CardTitle>
                  <CardDescription className="text-xs">
                    Data iuran wajib, dibayar, dan rata-rata upah per bulan
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  {currentYear}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Quick fill helpers */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-xs text-muted-foreground">Isi cepat:</span>
                <QuickFillInput
                  label="Iuran Wajib"
                  onFill={(v) => fillAll("iuran_wajib", v)}
                />
                <QuickFillInput
                  label="Iuran Dibayar"
                  onFill={(v) => fillAll("iuran_dibayar", v)}
                />
                <QuickFillInput
                  label="Rata Upah"
                  onFill={(v) => fillAll("rata_upah", v)}
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <th className="py-2 pr-2">Bulan</th>
                      <th className="py-2 pr-2">Iuran Wajib (Rp)</th>
                      <th className="py-2 pr-2">Iuran Dibayar (Rp)</th>
                      <th className="py-2 pr-2">Rata Upah (Rp)</th>
                      <th className="py-2 pr-2 text-right">Tunggakan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthly.map((row, idx) => {
                      const tunggakan = Math.max(0, row.iuran_wajib - row.iuran_dibayar)
                      return (
                        <tr key={idx} className="border-b last:border-0">
                          <td className="py-2 pr-2 font-semibold text-foreground">
                            {MONTH_NAMES[row.bulan - 1]}
                          </td>
                          <td className="py-2 pr-2">
                            <Input
                              type="number"
                              min="0"
                              value={row.iuran_wajib || ""}
                              onChange={(e) =>
                                updateMonthly(
                                  idx,
                                  "iuran_wajib",
                                  Number(e.target.value) || 0,
                                )
                              }
                              className="h-8 text-xs"
                            />
                          </td>
                          <td className="py-2 pr-2">
                            <Input
                              type="number"
                              min="0"
                              value={row.iuran_dibayar || ""}
                              onChange={(e) =>
                                updateMonthly(
                                  idx,
                                  "iuran_dibayar",
                                  Number(e.target.value) || 0,
                                )
                              }
                              className="h-8 text-xs"
                            />
                          </td>
                          <td className="py-2 pr-2">
                            <Input
                              type="number"
                              min="0"
                              value={row.rata_upah || ""}
                              onChange={(e) =>
                                updateMonthly(
                                  idx,
                                  "rata_upah",
                                  Number(e.target.value) || 0,
                                )
                              }
                              className="h-8 text-xs"
                            />
                          </td>
                          <td className="py-2 pr-2 text-right">
                            {tunggakan > 0 ? (
                              <span className="font-mono font-bold text-destructive">
                                {fmtRupiah(tunggakan)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Action Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Aksi
              </CardTitle>
              <CardDescription className="text-xs">
                Hitung skor ECRS atau simpan langsung ke database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handlePreview}
                disabled={loading}
                variant="outline"
                className="w-full gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Calculator className="h-4 w-4" />
                )}
                Hitung Preview Skor ECRS
              </Button>

              <Button
                onClick={handleSave}
                disabled={loading}
                className="w-full gap-2 bg-primary hover:bg-primary/90"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Simpan ke Database
              </Button>

              <div className="rounded-lg bg-muted/50 border border-border p-3 text-[11px] text-muted-foreground space-y-2 mt-4">
                <p className="font-semibold text-foreground">Catatan:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Preview menampilkan skor + SHAP breakdown tanpa menyimpan</li>
                  <li>Simpan akan insert ke tabel companies + monthly_reports + audit_log</li>
                  <li>Latensi perhitungan: &lt; 200ms</li>
                  <li>Model: XGBoost ECRS v4.2 (AUC 0.914)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal: Preview Result */}
      {showModal && result && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-background rounded-xl border max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold">
                  Hasil Preview Skor ECRS
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Model XGBoost ECRS v4.2 + SHAP Explainability
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Score Display */}
              <div
                className="rounded-xl p-6 text-center"
                style={{
                  backgroundColor: `${result.tier_color}15`,
                  border: `2px solid ${result.tier_color}40`,
                }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  ECRS Score
                </p>
                <p
                  className="font-heading text-6xl font-bold tabular-nums mt-2"
                  style={{ color: result.tier_color }}
                >
                  {result.score}
                </p>
                <Badge
                  className="mt-3 text-xs font-bold border-0"
                  style={{
                    backgroundColor: result.tier_color,
                    color: "white",
                  }}
                >
                  TIER {result.tier}
                </Badge>
              </div>

              {/* Rekomendasi */}
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                <p className="text-xs font-bold text-primary mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Rekomendasi Tindakan
                </p>
                <p className="text-xs text-foreground leading-relaxed">
                  {result.rekomendasi}
                </p>
              </div>

              {/* SHAP Breakdown */}
              <div>
                <h3 className="text-sm font-bold mb-3">
                  Top 10 Faktor Pendorong Skor (SHAP Values)
                </h3>
                <div className="space-y-2">
                  {result.shapContributions.map((feat, i) => {
                    const maxContrib = Math.max(
                      ...result.shapContributions.map((f) => f.contribution),
                    )
                    const width = (feat.contribution / maxContrib) * 100
                    return (
                      <div key={feat.feature} className="group">
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs font-bold text-muted-foreground tabular-nums w-6">
                              #{i + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-foreground truncate">
                                {feat.label}
                              </p>
                              <p className="text-[10px] text-muted-foreground font-mono">
                                nilai: {feat.value.toFixed(3)}
                              </p>
                            </div>
                          </div>
                          <span className="font-mono text-sm font-bold tabular-nums text-destructive shrink-0">
                            +{feat.contribution.toFixed(2)}
                          </span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-destructive transition-all duration-500"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowModal(false)}
                >
                  Tutup
                </Button>
                <Button
                  className="flex-1 gap-2 bg-primary hover:bg-primary/90"
                  onClick={() => {
                    setShowModal(false)
                    handleSave()
                  }}
                >
                  <Save className="h-4 w-4" />
                  Simpan ke Database
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// =========================================================
// SUB COMPONENTS
// =========================================================

function Field({
  label,
  children,
  required,
  hint,
}: {
  label: string
  children: React.ReactNode
  required?: boolean
  hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  )
}

function QuickFillInput({
  label,
  onFill,
}: {
  label: string
  onFill: (value: number) => void
}) {
  const [val, setVal] = useState("")
  return (
    <div className="flex items-center gap-1">
      <Input
        type="number"
        min="0"
        placeholder={label}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="h-7 text-xs w-32"
      />
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-7 text-[10px]"
        onClick={() => {
          const n = Number(val)
          if (!isNaN(n) && n >= 0) onFill(n)
        }}
      >
        Isi
      </Button>
    </div>
  )
}