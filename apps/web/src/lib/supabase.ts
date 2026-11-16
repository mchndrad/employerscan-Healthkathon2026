import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "❌ Supabase env vars missing. Check apps/web/.env.local file."
  )
}

// =========================================================
// CLIENT-SIDE SUPABASE (uses anon key, respects RLS)
// =========================================================
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
})

// =========================================================
// SERVER-SIDE SUPABASE (uses service role, bypasses RLS)
// Only use in Server Components, Server Actions, API routes
// =========================================================
export function getServerSupabase() {
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!SERVICE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY missing — server-only env var")
  }
  return createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false },
  })
}

// =========================================================
// SCHEMA REAL — Sesuai tabel Supabase
// =========================================================
export type Company = {
  id: string
  npwp: string
  nama: string
  bentuk_badan: string
  alamat: string
  kota: string
  provinsi: string
  kelurahan: string | null
  kecamatan: string | null
  lat: number | null
  long: number | null
  sektor_usaha: string
  tanggal_berdiri: string | null
  pic_name: string | null
  pic_phone: string | null
  pic_email: string | null
  jumlah_karyawan_terdaftar: number
  jumlah_karyawan_aktual: number | null
  ecrs_score: number
  ecrs_tier: "RENDAH" | "SEDANG" | "TINGGI" | "KRITIS"
  ecrs_last_computed_at: string | null
  status: "AKTIF" | "NONAKTIF"
  created_at: string
  updated_at: string
}

export type MonthlyReport = {
  id: string
  company_id: string
  tahun: number
  bulan: number
  jumlah_karyawan_dilaporkan: number
  total_upah_dilaporkan: number
  rata_upah_dilaporkan: number
  iuran_jkn_dibayar: number
  iuran_jkn_wajib: number
  tunggakan: number
  status_bayar: "LUNAS" | "SEBAGIAN" | "BELUM"
  tanggal_lapor: string
  source: "E_DABU" | "DJP" | "KEMNAKER" | "AHU"
  anomaly_flag: boolean
  anomaly_reason: string | null
  created_at: string
}

export type Integration = {
  id: string
  nama: string
  kategori: string
  status: "connected" | "pending" | "disconnected"
  last_sync: string | null
}

// =========================================================
// NEW TYPES — Mirror tabel Supabase
// =========================================================
export type AuditLogEntry = {
  id: string
  created_at: string
  action: string
  description: string | null
  severity: "info" | "warning" | "critical"
  actor_name: string | null
  company_id: string | null
}

export type Audit = {
  id: string
  company_id: string
  tanggal_mulai: string
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
  skor_akhir: number | null
  catatan: string | null
  created_at: string
}

export type UserProfile = {
  id: string
  email: string
  nama: string
  role: "verifikator" | "wasrik" | "admin"
  unit_kerja: string | null
}