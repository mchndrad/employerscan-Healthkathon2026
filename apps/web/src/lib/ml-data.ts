import { readFileSync } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "public", "data")

// =========================================================
// TYPES
// =========================================================
export type ModelMetrics = {
  name: string
  type: string
  is_ours: boolean
  auc: number
  precision: number
  recall: number
  f1: number
  mcc: number
  avg_precision: number
  training_time: string
}

export type Benchmarks = {
  generated_at: string
  dataset: {
    total_bu: number
    train_size: number
    val_size: number
    test_size: number
    feature_count: number
    class_balance: { compliant: number; non_compliant: number }
    period: string
    sources: string[]
    dataset_hash_sha256: string
  }
  models: ModelMetrics[]
  confusion_matrix: { tp: number; fp: number; fn: number; tn: number }
  roc_curve: Array<{ fpr: number; tpr: number }>
}

export type FeatureImportance = {
  generated_at: string
  total_features: number
  top_features: Array<{
    rank: number
    feature: string
    importance_pct: number
    mean_abs_shap: number
  }>
}

export type GroupStats = {
  n: number
  pred_rate: number
  actual_rate: number
  dp_delta_pct: number
  tpr: number
  fpr: number
  precision: number
}

export type FairnessMetrics = {
  generated_at: string
  overall_score: number
  grade: "A" | "B" | "C"
  metrics: {
    demographic_parity_max_pct: number
    equalized_odds_max_pct: number
    predictive_parity_max_pct: number
    ece: number
  }
  thresholds: Record<string, number>
  by_sektor: Record<string, GroupStats>
  by_provinsi: Record<string, GroupStats>
  by_ukuran: Record<string, GroupStats>
  by_wilayah: Record<string, GroupStats>
}

export type ShapEntry = {
  npwp: string
  nama: string
  ecrs_actual: number
  ecrs_predicted_prob: number
  top_contributing_features: Array<{
    feature: string
    value: number
    shap_contribution: number
  }>
}

// =========================================================
// LOADERS (Server Components only - uses fs)
// =========================================================
export function loadBenchmarks(): Benchmarks {
  return JSON.parse(readFileSync(path.join(DATA_DIR, "benchmarks.json"), "utf-8"))
}

export function loadFeatureImportance(): FeatureImportance {
  return JSON.parse(readFileSync(path.join(DATA_DIR, "feature_importance.json"), "utf-8"))
}

export function loadFairnessMetrics(): FairnessMetrics {
  return JSON.parse(readFileSync(path.join(DATA_DIR, "fairness_metrics.json"), "utf-8"))
}

export function loadShapByNpwp(npwp: string): ShapEntry | null {
  const data: ShapEntry[] = JSON.parse(
    readFileSync(path.join(DATA_DIR, "shap_values.json"), "utf-8")
  )
  return data.find((e) => e.npwp === npwp) || null
}

// =========================================================
// HELPERS — Feature name humanization
// =========================================================
const FEATURE_LABELS: Record<string, { label: string; source: string }> = {
  jml_bulan_tunggak: { label: "Jumlah Bulan Tunggak (12 bln)", source: "e-Dabu" },
  ratio_karyawan_td_vs_aktual: { label: "Rasio Karyawan Terdaftar/Aktual", source: "Kemnaker" },
  selisih_upah_vs_ump: { label: "Selisih Upah vs UMP Provinsi", source: "DJP" },
  ratio_bayar_total: { label: "Rasio Pembayaran Total", source: "e-Dabu" },
  umur_bu_tahun: { label: "Umur Badan Usaha", source: "AHU" },
  std_rata_upah: { label: "Volatilitas Upah Bulanan", source: "DJP" },
  jumlah_karyawan_terdaftar: { label: "Jumlah Karyawan Terdaftar", source: "e-Dabu" },
  jumlah_karyawan_aktual: { label: "Jumlah Karyawan Aktual", source: "Kemnaker" },
  total_tunggakan_12bulan: { label: "Total Tunggakan 12 Bulan", source: "e-Dabu" },
  tren_tunggakan_slope: { label: "Tren Tunggakan (Regresi)", source: "Internal" },
  ratio_upah_vs_ump: { label: "Rasio Upah vs UMP", source: "DJP" },
  max_tunggakan: { label: "Tunggakan Maksimum Satu Bulan", source: "e-Dabu" },
  avg_rata_upah: { label: "Rata-rata Upah Bulanan", source: "DJP" },
  avg_iuran_wajib: { label: "Rata-rata Iuran Wajib", source: "e-Dabu" },
  jml_anomaly_12bulan: { label: "Jumlah Anomali 12 Bulan", source: "Internal" },
  log_jumlah_karyawan: { label: "Log Jumlah Karyawan", source: "e-Dabu" },
  is_jawa: { label: "Flag Wilayah Jawa", source: "Internal" },
  is_dki: { label: "Flag DKI Jakarta", source: "Internal" },
  ump_provinsi: { label: "UMP Provinsi", source: "Internal" },
}

export function humanizeFeature(feat: string): { label: string; source: string } {
  if (FEATURE_LABELS[feat]) return FEATURE_LABELS[feat]
  if (feat.startsWith("sek_")) return { label: `Sektor: ${feat.slice(4).replace(/_/g, " ")}`, source: "Internal" }
  if (feat.startsWith("bb_")) return { label: `Bentuk: ${feat.slice(3)}`, source: "AHU" }
  return { label: feat.replace(/_/g, " "), source: "Internal" }
}