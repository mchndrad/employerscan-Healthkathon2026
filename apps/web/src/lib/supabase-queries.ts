import { getServerSupabase, type Company, type MonthlyReport } from "./supabase"
import { loadShapByNpwp, type ShapEntry } from "./ml-data"

// =========================================================
// DASHBOARD AGGREGATE — Via RPC (1 call, efisien)
// =========================================================
export type DashboardAggregate = {
  totalBU: number
  comply: number
  warning: number
  nonComply: number
  avgEcrs: number
  totalKaryawan: number
  kritisCount: number
  tinggiCount: number
  sedangCount: number
  rendahCount: number
  totalTunggakan: number
  totalIuranWajib: number
  totalIuranDibayar: number
  nonComplyKasus: number
  complyPct: number
  warningPct: number
  nonComplyPct: number
  recoveryRate: number
}

export async function getDashboardAggregate(): Promise<DashboardAggregate> {
  const sb = getServerSupabase()
  const { data, error } = await sb.rpc("get_dashboard_aggregate")

  if (error || !data || data.length === 0) {
    throw new Error(`getDashboardAggregate: ${error?.message ?? "no data"}`)
  }

  const r = data[0] as Record<string, number>
  const total = Number(r.total_bu)
  const wajib = Number(r.total_iuran_wajib)
  const dibayar = Number(r.total_iuran_dibayar)

  return {
    totalBU: total,
    comply: Number(r.comply_count),
    warning: Number(r.warning_count),
    nonComply: Number(r.non_comply_count),
    avgEcrs: Number(r.avg_ecrs),
    totalKaryawan: Number(r.total_karyawan),
    kritisCount: Number(r.kritis_count),
    tinggiCount: Number(r.tinggi_count),
    sedangCount: Number(r.sedang_count),
    rendahCount: Number(r.rendah_count),
    totalTunggakan: Number(r.total_tunggakan),
    totalIuranWajib: wajib,
    totalIuranDibayar: dibayar,
    nonComplyKasus: Number(r.non_comply_kasus),
    complyPct: total > 0 ? (Number(r.comply_count) / total) * 100 : 0,
    warningPct: total > 0 ? (Number(r.warning_count) / total) * 100 : 0,
    nonComplyPct: total > 0 ? (Number(r.non_comply_count) / total) * 100 : 0,
    recoveryRate: wajib > 0 ? (dibayar / wajib) * 100 : 0,
  }
}

// =========================================================
// MONTHLY TREND — Untuk sparkline KPI cards
// =========================================================
export type MonthlyTrendPoint = {
  tahun: number
  bulan: number
  totalTunggakan: number
  totalDibayar: number
  totalWajib: number
  recoveryRate: number
}

export async function getMonthlyTrend(): Promise<MonthlyTrendPoint[]> {
  const sb = getServerSupabase()
  const { data, error } = await sb.rpc("get_monthly_trend")

  if (error || !data) return []

  return (data as Array<Record<string, number>>).map((r) => ({
    tahun: Number(r.tahun),
    bulan: Number(r.bulan),
    totalTunggakan: Number(r.total_tunggakan),
    totalDibayar: Number(r.total_dibayar),
    totalWajib: Number(r.total_wajib),
    recoveryRate: Number(r.recovery_rate),
  }))
}

// =========================================================
// TOP RISK COMPANIES — Untuk dashboard sidebar
// =========================================================
export type TopRiskCompany = {
  npwp: string
  nama: string
  ecrs_score: number
  ecrs_tier: "RENDAH" | "SEDANG" | "TINGGI" | "KRITIS"
}

export async function getTopRiskCompanies(limit = 10): Promise<TopRiskCompany[]> {
  const sb = getServerSupabase()
  const { data, error } = await sb
    .from("companies")
    .select("npwp, nama, ecrs_score, ecrs_tier")
    .order("ecrs_score", { ascending: false })
    .limit(limit)

  if (error || !data) return []
  return data as TopRiskCompany[]
}

// =========================================================
// RECENT AUDIT LOG — Activity feed
// =========================================================
export async function getRecentAuditLog(limit = 10) {
  const sb = getServerSupabase()
  const { data, error } = await sb
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error || !data) return []
  return data
}

// =========================================================
// PERUSAHAAN — Daftar + filter + pagination
// =========================================================
export type CompanyListParams = {
  page?: number
  pageSize?: number
  tier?: "RENDAH" | "SEDANG" | "TINGGI" | "KRITIS"
  sektor?: string
  provinsi?: string
  search?: string
  sortBy?: "ecrs_score" | "nama" | "jumlah_karyawan_terdaftar"
  sortDir?: "asc" | "desc"
}

export type CompanyListResult = {
  companies: Company[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export async function getCompanies(
  params: CompanyListParams = {},
): Promise<CompanyListResult> {
  const sb = getServerSupabase()
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 50
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  const sortBy = params.sortBy ?? "ecrs_score"
  const sortDir = params.sortDir ?? "desc"

  let query = sb
    .from("companies")
    .select("*", { count: "exact" })
    .range(from, to)
    .order(sortBy, { ascending: sortDir === "asc" })

  if (params.tier) query = query.eq("ecrs_tier", params.tier)
  if (params.sektor) query = query.eq("sektor_usaha", params.sektor)
  if (params.provinsi) query = query.eq("provinsi", params.provinsi)
  if (params.search) {
    const term = params.search.trim()
    query = query.or(`nama.ilike.%${term}%,npwp.ilike.%${term}%`)
  }

  const { data, count, error } = await query
  if (error) throw new Error(`getCompanies: ${error.message}`)

  return {
    companies: (data ?? []) as Company[],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  }
}

// =========================================================
// PERUSAHAAN DETAIL — Single BU + monthly reports + SHAP
// =========================================================
export type CompanyDetail = {
  company: Company
  monthlyReports: MonthlyReport[]
  shap: ShapEntry | null
}

export async function getCompanyDetail(
  npwp: string,
): Promise<CompanyDetail | null> {
  const sb = getServerSupabase()

  const { data: company, error } = await sb
    .from("companies")
    .select("*")
    .eq("npwp", npwp)
    .single()

  if (error || !company) return null

  const { data: reports } = await sb
    .from("monthly_reports")
    .select("*")
    .eq("company_id", company.id)
    .order("tahun", { ascending: true })
    .order("bulan", { ascending: true })

  const shap = loadShapByNpwp(npwp)

  return {
    company: company as Company,
    monthlyReports: (reports ?? []) as MonthlyReport[],
    shap,
  }
}

// =========================================================
// GEO AGGREGATE — Via RPC (FULL 10K rows)
// =========================================================
export type ProvinsiAggregate = {
  provinsi: string
  totalBU: number
  rendah: number
  sedang: number
  tinggi: number
  kritis: number
  avgEcrs: number
  totalKaryawan: number
}

export async function getGeoAggregate(): Promise<ProvinsiAggregate[]> {
  const sb = getServerSupabase()
  const { data, error } = await sb.rpc("get_geo_aggregate_rpc")
  if (error || !data) return []

  return (data as Array<Record<string, number | string>>).map((r) => ({
    provinsi: String(r.provinsi),
    totalBU: Number(r.total_bu),
    rendah: Number(r.rendah_count),
    sedang: Number(r.sedang_count),
    tinggi: Number(r.tinggi_count),
    kritis: Number(r.kritis_count),
    avgEcrs: Number(r.avg_ecrs),
    totalKaryawan: Number(r.total_karyawan),
  }))
}

// =========================================================
// SEKTOR AGGREGATE — Via RPC
// =========================================================
export type SektorAggregate = {
  sektor: string
  totalBU: number
  avgEcrs: number
  nonComplyRate: number
}

export async function getSektorAggregate(): Promise<SektorAggregate[]> {
  const sb = getServerSupabase()
  const { data, error } = await sb.rpc("get_sektor_aggregate_rpc")
  if (error || !data) return []

  return (data as Array<Record<string, number | string>>).map((r) => ({
    sektor: String(r.sektor),
    totalBU: Number(r.total_bu),
    avgEcrs: Number(r.avg_ecrs),
    nonComplyRate: Number(r.non_comply_rate),
  }))
}

// =========================================================
// FILTER OPTIONS — Via RPC
// =========================================================
export async function getFilterOptions(): Promise<{
  sektors: string[]
  provinsis: string[]
}> {
  const sb = getServerSupabase()
  const { data, error } = await sb.rpc("get_filter_options_rpc")
  if (error || !data || data.length === 0) {
    return { sektors: [], provinsis: [] }
  }
  const row = data[0] as { sektors: string[]; provinsis: string[] }
  return {
    sektors: row.sektors ?? [],
    provinsis: row.provinsis ?? [],
  }
}

// =========================================================
// TOP RISK BY PROVINCE — Untuk sidebar provinsi
// =========================================================
export async function getTopRiskCompaniesByProvince(
  provinsi: string,
  limit = 3,
) {
  const sb = getServerSupabase()
  const { data } = await sb
    .from("companies")
    .select("npwp, nama, ecrs_score, kota, ecrs_tier")
    .eq("provinsi", provinsi)
    .order("ecrs_score", { ascending: false })
    .limit(limit)
  return data ?? []
}

// =========================================================
// BREAKDOWN KOTA/KABUPATEN per provinsi
// =========================================================
export async function getKotaBreakdownByProvince(provinsi: string) {
  const sb = getServerSupabase()
  const { data } = await sb
    .from("companies")
    .select("kota, ecrs_score")
    .eq("provinsi", provinsi)
    .limit(5000)

  const map = new Map<string, { count: number; ecrsSum: number }>()
  data?.forEach((r) => {
    if (!map.has(r.kota)) map.set(r.kota, { count: 0, ecrsSum: 0 })
    const agg = map.get(r.kota)!
    agg.count++
    agg.ecrsSum += r.ecrs_score ?? 0
  })

  return Array.from(map.entries())
    .map(([kota, agg]) => ({
      wilayah: kota,
      bu: agg.count,
      ecrs: agg.count > 0 ? Math.round(agg.ecrsSum / agg.count) : 0,
    }))
    .sort((a, b) => b.bu - a.bu)
    .slice(0, 5)
}

// =========================================================
// INTEGRATIONS — Multi-Agency Hub
// =========================================================
export type IntegrationRow = {
  id: string
  source: string
  display_name: string
  endpoint_url: string
  status: string
  last_sync_at: string | null
  last_sync_count: number | null
  rate_limit_current: number | null
  rate_limit_max: number | null
  error_message: string | null
  config: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export async function getIntegrations(): Promise<IntegrationRow[]> {
  const sb = getServerSupabase()
  const { data, error } = await sb
    .from("integrations")
    .select("*")
    .order("source", { ascending: true })
  if (error || !data) return []
  return data as IntegrationRow[]
}

// =========================================================
// AUDIT LOG — Paginated
// =========================================================
export async function getAuditLogPaginated(page = 1, pageSize = 15) {
  const sb = getServerSupabase()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, count, error } = await sb
    .from("audit_log")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false })

  if (error) {
    return { entries: [], total: 0, page, pageSize, totalPages: 0 }
  }

  return {
    entries: data ?? [],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  }
}

// =========================================================
// AUDITS — Count
// =========================================================
export async function getAuditsCount(): Promise<number> {
  const sb = getServerSupabase()
  const { count } = await sb
    .from("audits")
    .select("*", { count: "exact", head: true })
  return count ?? 0
}