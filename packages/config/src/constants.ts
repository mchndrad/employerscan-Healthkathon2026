/**
 * Shared constants untuk EmployerScan.
 */

// Batas tier risiko (score 0-100)
export const RISK_THRESHOLDS = {
  RENDAH: { min: 0, max: 30 },
  SEDANG: { min: 31, max: 50 },
  TINGGI: { min: 51, max: 70 },
  KRITIS: { min: 71, max: 100 },
} as const

// Capacity assumption untuk precision@k calculation
export const AUDIT_CAPACITY = {
  verifiers: 100,
  cases_per_verifier_per_day: 10,
  working_days_per_month: 20,
  // Total capacity per month
  total_k: 100 * 10 * 20, // = 20,000
} as const

// Benchmark fraud rates untuk evaluation
export const BENCHMARK_FRAUD_RATES = [0.01, 0.05, 0.1] as const

// Agency sync intervals
export const SYNC_INTERVALS = {
  E_DABU: '1h',
  DJP: '24h',
  WLKP: '12h',
  AHU: '24h',
} as const

// BPJS brand colors (match CSS variables)
export const BPJS_COLORS = {
  primary: '#00A651',      // BPJS Green
  secondary: '#005BAC',    // BPJS Blue
  warning: '#FFC107',      // Yellow
  danger: '#DC2626',       // Red
} as const