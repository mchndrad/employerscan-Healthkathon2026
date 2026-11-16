/**
 * Shared types untuk EmployerScan monorepo (web + mobile + ml-engine).
 */

// ================================================================
// RISK TIER — Klasifikasi tier risiko BU
// ================================================================
export type RiskTier = 'RENDAH' | 'SEDANG' | 'TINGGI' | 'KRITIS'

export const RISK_TIER_COLORS: Record<RiskTier, string> = {
  RENDAH: '#00A651',   // BPJS Green
  SEDANG: '#FFC107',   // Yellow
  TINGGI: '#F97316',   // Orange
  KRITIS: '#DC2626',   // Red
}

export const RISK_TIER_LABELS: Record<RiskTier, string> = {
  RENDAH: 'Rendah',
  SEDANG: 'Sedang',
  TINGGI: 'Tinggi',
  KRITIS: 'Kritis',
}

// ================================================================
// SEGMENTASI PESERTA (dari BPJS Data Sample variabel PSTV08)
// ================================================================
export type Segmentasi = 'BP' | 'PBI_APBN' | 'PBI_APBD' | 'PBPU' | 'PPU'

// ================================================================
// FRAUD MODUS — 6 modus Pemberi Kerja (dari Participant Guide BPJS)
// ================================================================
export type FraudModus =
  | 'PDUK'                    // Pendaftaran Pekerja Sebagian
  | 'UNDER_REPORTING_UPAH'    // Pelaporan upah lebih rendah
  | 'PENGGELAPAN_IURAN'       // Potong tapi tidak setor
  | 'MISKLASIFIKASI_STATUS'   // Ubah PPU → PBPU
  | 'MANIPULASI_MUTASI'       // Tunda data mutasi
  | 'KOLUSI_FASKES'           // Surat sakit fiktif

// ================================================================
// COMPANY — Struktur Badan Usaha
// ================================================================
export interface Company {
  id: string
  nama_perusahaan: string
  npwp: string
  provinsi: string
  kabupaten_kota: string
  segmentasi: Segmentasi
  jumlah_karyawan: number
  risk_tier: RiskTier
  risk_score: number        // 0-100
  created_at: string
  updated_at: string
}

// ================================================================
// MONTHLY REPORT — Laporan bulanan BU
// ================================================================
export interface MonthlyReport {
  id: string
  company_id: string
  periode: string                 // Format: YYYY-MM
  jumlah_karyawan_dilaporkan: number
  total_upah_dilaporkan: number
  iuran_dibayar: number
  modus_terdeteksi?: FraudModus[]
  created_at: string
}

// ================================================================
// INTEGRATION — Status sync multi-agency
// ================================================================
export type Agency = 'E_DABU' | 'DJP' | 'WLKP' | 'AHU'

export interface Integration {
  id: string
  company_id: string
  agency: Agency
  last_synced_at: string | null
  status: 'HEALTHY' | 'WARNING' | 'ERROR'
}