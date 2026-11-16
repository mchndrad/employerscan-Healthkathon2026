/**
 * PERUSAHAAN LISTING PAGE
 * Direktori Badan Usaha — paginated 10.000 BU dari Supabase
 */
import { Plus } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChevronRight,
  Search,
  Filter,
  Download,
  Building2,
  ArrowRight,
  ChevronLeft,
  Users,
  MapPin,
} from "lucide-react"
import {
  getCompanies,
  getFilterOptions,
  getDashboardAggregate,
} from "@/lib/supabase-queries"

export const revalidate = 60

type SearchParams = Promise<{
  page?: string
  tier?: "RENDAH" | "SEDANG" | "TINGGI" | "KRITIS"
  sektor?: string
  provinsi?: string
  search?: string
  sort?: "ecrs_desc" | "ecrs_asc" | "nama_asc" | "karyawan_desc"
}>

const fmtNpwp = (n: string) =>
  !n || n.length < 10 ? n : `${n.slice(0, 11)}...`

const tierColor = (t: string) => {
  switch (t) {
    case "KRITIS":
      return "bg-destructive/15 text-destructive border-destructive/30"
    case "TINGGI":
      return "bg-chart-4/15 text-chart-4 border-chart-4/30"
    case "SEDANG":
      return "bg-chart-3/15 text-chart-3 border-chart-3/30"
    default:
      return "bg-primary/15 text-primary border-primary/30"
  }
}

export default async function PerusahaanPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams
  const page = Number(sp.page ?? 1)
  const sort = sp.sort ?? "ecrs_desc"

  const sortMap = {
    ecrs_desc: { sortBy: "ecrs_score" as const, sortDir: "desc" as const },
    ecrs_asc: { sortBy: "ecrs_score" as const, sortDir: "asc" as const },
    nama_asc: { sortBy: "nama" as const, sortDir: "asc" as const },
    karyawan_desc: {
      sortBy: "jumlah_karyawan_terdaftar" as const,
      sortDir: "desc" as const,
    },
  }

  const [result, filterOptions, stats] = await Promise.all([
    getCompanies({
      page,
      pageSize: 50,
      tier: sp.tier,
      sektor: sp.sektor,
      provinsi: sp.provinsi,
      search: sp.search,
      ...sortMap[sort],
    }),
    getFilterOptions(),
    getDashboardAggregate(),
  ])

  const { companies, total, totalPages } = result

  // Build querystring untuk pagination link
  const buildQS = (overrides: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams()
    const merged = {
      page: String(page),
      tier: sp.tier,
      sektor: sp.sektor,
      provinsi: sp.provinsi,
      search: sp.search,
      sort,
      ...overrides,
    }
    Object.entries(merged).forEach(([k, v]) => {
      if (v !== undefined && v !== "" && v !== null) {
        params.set(k, String(v))
      }
    })
    return `?${params.toString()}`
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">Perusahaan</span>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl text-foreground tracking-tight">
            Direktori Badan Usaha
          </h1>
          <p className="text-sm text-muted-foreground">
            {stats.totalBU.toLocaleString("id-ID")} BU terdaftar · klasifikasi
            berdasarkan skor ECRS v4.2
          </p>
        </div>
        <div className="flex items-center gap-2">
  <Link href="/perusahaan/tambah">
    <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
      <Plus className="h-4 w-4" />
      Tambah BU Baru
    </Button>
  </Link>
  <Button variant="outline" size="sm" className="gap-2">
    <Download className="h-4 w-4" />
    Ekspor Daftar
  </Button>
</div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatPill
          label="Total BU"
          value={stats.totalBU.toLocaleString("id-ID")}
          color="muted"
        />
        <StatPill
          label="Kritis"
          value={stats.kritisCount.toLocaleString("id-ID")}
          color="destructive"
        />
        <StatPill
          label="Tinggi"
          value={stats.tinggiCount.toLocaleString("id-ID")}
          color="chart-4"
        />
        <StatPill
          label="Sedang"
          value={stats.sedangCount.toLocaleString("id-ID")}
          color="chart-3"
        />
        <StatPill
          label="Rendah"
          value={stats.rendahCount.toLocaleString("id-ID")}
          color="primary"
        />
      </div>

      {/* Filter bar */}
      <Card>
        <CardContent className="pt-5">
          <form className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                name="search"
                placeholder="Cari nama BU atau NPWP..."
                defaultValue={sp.search}
                className="pl-9"
              />
            </div>

            <Select name="tier" defaultValue={sp.tier ?? "all"}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tier</SelectItem>
                <SelectItem value="KRITIS">Kritis</SelectItem>
                <SelectItem value="TINGGI">Tinggi</SelectItem>
                <SelectItem value="SEDANG">Sedang</SelectItem>
                <SelectItem value="RENDAH">Rendah</SelectItem>
              </SelectContent>
            </Select>

            <Select name="sektor" defaultValue={sp.sektor ?? "all"}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Sektor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Sektor</SelectItem>
                {filterOptions.sektors.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select name="provinsi" defaultValue={sp.provinsi ?? "all"}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Provinsi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Provinsi</SelectItem>
                {filterOptions.provinsis.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select name="sort" defaultValue={sort}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ecrs_desc">ECRS Tertinggi</SelectItem>
                <SelectItem value="ecrs_asc">ECRS Terendah</SelectItem>
                <SelectItem value="nama_asc">Nama A → Z</SelectItem>
                <SelectItem value="karyawan_desc">Karyawan Terbanyak</SelectItem>
              </SelectContent>
            </Select>

            <div className="md:col-span-6 flex items-center justify-between gap-2 pt-1">
              <p className="text-xs text-muted-foreground">
                Menampilkan {companies.length} dari{" "}
                <strong>{total.toLocaleString("id-ID")}</strong> hasil
              </p>
              <div className="flex gap-2">
                <Link href="/perusahaan">
                  <Button type="button" variant="ghost" size="sm">
                    Reset
                  </Button>
                </Link>
                <Button type="submit" size="sm" className="gap-1.5">
                  <Filter className="h-3.5 w-3.5" />
                  Terapkan Filter
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-5">
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b">
                <tr className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="text-left px-4 py-3">#</th>
                  <th className="text-left px-4 py-3">Nama Badan Usaha</th>
                  <th className="text-left px-4 py-3">NPWP</th>
                  <th className="text-left px-4 py-3">Sektor</th>
                  <th className="text-left px-4 py-3">Provinsi</th>
                  <th className="text-right px-4 py-3">Karyawan</th>
                  <th className="text-center px-4 py-3">Tier</th>
                  <th className="text-right px-4 py-3">ECRS</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {companies.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12">
                      <Building2 className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Tidak ada BU yang sesuai filter
                      </p>
                    </td>
                  </tr>
                ) : (
                  companies.map((bu, i) => {
                    const rowNum = (page - 1) * 50 + i + 1
                    return (
                      <tr
                        key={bu.id}
                        className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">
                          {rowNum}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/perusahaan/${bu.npwp}`}
                            className="font-semibold text-foreground hover:text-primary transition-colors"
                          >
                            {bu.nama}
                          </Link>
                          <p className="text-[10px] text-muted-foreground">
                            {bu.bentuk_badan} · {bu.kota}
                          </p>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          {fmtNpwp(bu.npwp)}
                        </td>
                        <td className="px-4 py-3 text-xs text-foreground">
                          {bu.sektor_usaha}
                        </td>
                        <td className="px-4 py-3 text-xs text-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            {bu.provinsi}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs tabular-nums text-right text-foreground">
                          {bu.jumlah_karyawan_terdaftar.toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold ${tierColor(
                              bu.ecrs_tier,
                            )}`}
                          >
                            {bu.ecrs_tier}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-heading font-bold tabular-nums text-foreground">
                            {Math.round(bu.ecrs_score)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/perusahaan/${bu.npwp}`}>
                            <ArrowRight className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                          </Link>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-muted-foreground">
                Halaman <strong>{page}</strong> dari{" "}
                <strong>{totalPages}</strong>
              </p>
              <div className="flex items-center gap-2">
                {page > 1 && (
                  <Link href={buildQS({ page: page - 1 })}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <ChevronLeft className="h-3 w-3" />
                      Sebelumnya
                    </Button>
                  </Link>
                )}
                {page < totalPages && (
                  <Link href={buildQS({ page: page + 1 })}>
                    <Button variant="outline" size="sm" className="gap-1">
                      Berikutnya
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatPill({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color: "primary" | "destructive" | "chart-3" | "chart-4" | "muted"
}) {
  const colors = {
    primary: "border-primary/30 bg-primary/5",
    destructive: "border-destructive/30 bg-destructive/5",
    "chart-3": "border-chart-3/30 bg-chart-3/5",
    "chart-4": "border-chart-4/30 bg-chart-4/5",
    muted: "border-border bg-muted/40",
  }
  const textColor = {
    primary: "text-primary",
    destructive: "text-destructive",
    "chart-3": "text-chart-3",
    "chart-4": "text-chart-4",
    muted: "text-foreground",
  }
  return (
    <div className={`rounded-lg border p-3 ${colors[color]}`}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p
        className={`font-heading text-2xl font-bold tabular-nums leading-tight mt-1 ${textColor[color]}`}
      >
        {value}
      </p>
    </div>
  )
}