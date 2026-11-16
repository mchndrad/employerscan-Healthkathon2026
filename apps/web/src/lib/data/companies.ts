export type CompanyTier = "rendah" | "sedang" | "tinggi" | "kritis"
export type SkalaUsaha = "MIKRO" | "KECIL" | "MENENGAH" | "BESAR"

export type Segmentasi =
  | "Jasa Logistik & Transportasi"
  | "Pertambangan & Energi"
  | "Manufaktur Tekstil"
  | "Perkebunan Sawit"
  | "Konstruksi Sipil"
  | "Agroindustri"
  | "Jasa Keuangan & Fintech"
  | "Elektronik & Komponen"
  | "Farmasi & Kesehatan"
  | "Koperasi Simpan Pinjam"
  | "Teknologi Informasi"
  | "Perdagangan Umum"

export type Company = {
  id: string
  npwp: string
  name: string
  initials: string
  province: string
  segmentasi: Segmentasi
  skalaUsaha: SkalaUsaha
  tier: CompanyTier
  ecrsScore: number
  totalKaryawan: number
  lastAudit: string
  tunggakan: number
  isAudited: boolean
  nikPenanggungJawab: string
}

const PROVINCES = [
  "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Banten",
  "Sumatera Utara", "Sumatera Selatan", "Kalimantan Timur", "Sulawesi Selatan",
  "Papua", "Bali", "DI Yogyakarta", "Riau", "Lampung",
]

const SEGMENTASI_LIST: Segmentasi[] = [
  "Jasa Logistik & Transportasi",
  "Pertambangan & Energi",
  "Manufaktur Tekstil",
  "Perkebunan Sawit",
  "Konstruksi Sipil",
  "Agroindustri",
  "Jasa Keuangan & Fintech",
  "Elektronik & Komponen",
  "Farmasi & Kesehatan",
  "Koperasi Simpan Pinjam",
  "Teknologi Informasi",
  "Perdagangan Umum",
]

const SKALA_LIST: SkalaUsaha[] = ["MIKRO", "KECIL", "MENENGAH", "BESAR"]

const PREDEFINED_COMPANIES: Array<Partial<Company> & { name: string }> = [
  { name: "PT Nusantara Megah Logistik", segmentasi: "Jasa Logistik & Transportasi", skalaUsaha: "BESAR" },
  { name: "PT Sumber Berkat Tambang", segmentasi: "Pertambangan & Energi", skalaUsaha: "BESAR" },
  { name: "PT Graha Sentosa Tekstil", segmentasi: "Manufaktur Tekstil", skalaUsaha: "MENENGAH" },
  { name: "CV Harapan Makmur Abadi", segmentasi: "Perkebunan Sawit", skalaUsaha: "MENENGAH" },
  { name: "PT Bahtera Cipta Abadi", segmentasi: "Konstruksi Sipil", skalaUsaha: "MENENGAH" },
  { name: "PT Mahkota Sawit Mandiri", segmentasi: "Agroindustri", skalaUsaha: "BESAR" },
  { name: "PT Cipta Solusi Finansial", segmentasi: "Jasa Keuangan & Fintech", skalaUsaha: "KECIL" },
  { name: "PT Surya Prima Elektrik", segmentasi: "Elektronik & Komponen", skalaUsaha: "MENENGAH" },
  { name: "PT Sentosa Farma Indonesia", segmentasi: "Farmasi & Kesehatan", skalaUsaha: "BESAR" },
  { name: "Koperasi Pegawai Mitra Sejahtera", segmentasi: "Koperasi Simpan Pinjam", skalaUsaha: "MIKRO" },
  { name: "PT Teknologi Nusantara Digital", segmentasi: "Teknologi Informasi", skalaUsaha: "MENENGAH" },
  { name: "PT Perdana Perkasa Indonesia", segmentasi: "Perdagangan Umum", skalaUsaha: "BESAR" },
]

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function randomChoice<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seededRandom(seed) * arr.length)]
}

function randomInt(min: number, max: number, seed: number): number {
  return Math.floor(seededRandom(seed) * (max - min + 1)) + min
}

function generateNPWP(seed: number): string {
  const d = (s: number) => Math.floor(seededRandom(s) * 10)
  return `${d(seed)}${d(seed + 1)}.${d(seed + 2)}${d(seed + 3)}${d(seed + 4)}.${d(seed + 5)}${d(seed + 6)}${d(seed + 7)}.${d(seed + 8)}-${d(seed + 9)}${d(seed + 10)}${d(seed + 11)}.${d(seed + 12)}${d(seed + 13)}${d(seed + 14)}`
}

function getInitials(name: string): string {
  const words = name.replace(/^(PT|CV|UD|Koperasi)\s/i, "").split(" ")
  return (words[0]?.[0] ?? "") + (words[1]?.[0] ?? "")
}

function computeTier(ecrs: number): CompanyTier {
  if (ecrs >= 71) return "kritis"
  if (ecrs >= 51) return "tinggi"
  if (ecrs >= 31) return "sedang"
  return "rendah"
}

function randomDate(daysBack: number, seed: number): string {
  const now = new Date("2026-10-26")
  const past = new Date(now.getTime() - randomInt(0, daysBack, seed) * 86400000)
  return past.toISOString().split("T")[0]
}

export const COMPANIES: Company[] = Array.from({ length: 100 }, (_, i) => {
  const seed = i + 1
  const predefined = PREDEFINED_COMPANIES[i % PREDEFINED_COMPANIES.length]
  const name = predefined.name
  const ecrs = i < 3 ? 92 - i * 3 : randomInt(15, 90, seed + 100)
  const tier = computeTier(ecrs)
  const isAudited = seededRandom(seed + 50) > 0.15

  return {
    id: `BU-${(i + 1).toString().padStart(5, "0")}`,
    npwp: generateNPWP(seed),
    name,
    initials: getInitials(name),
    province: randomChoice(PROVINCES, seed + 200),
    segmentasi: predefined.segmentasi ?? randomChoice(SEGMENTASI_LIST, seed + 300),
    skalaUsaha: predefined.skalaUsaha ?? randomChoice(SKALA_LIST, seed + 400),
    tier,
    ecrsScore: ecrs,
    totalKaryawan: randomInt(10, 2500, seed + 500),
    lastAudit: randomDate(180, seed + 600),
    tunggakan: tier === "kritis" ? randomInt(50_000_000, 2_000_000_000, seed + 700) :
               tier === "tinggi" ? randomInt(10_000_000, 500_000_000, seed + 700) :
               tier === "sedang" ? randomInt(1_000_000, 50_000_000, seed + 700) : 0,
    isAudited,
    nikPenanggungJawab: `32${randomInt(10_000_000_000_000, 99_999_999_999_999, seed + 800)}`,
  }
}).sort((a, b) => b.ecrsScore - a.ecrsScore)

export const PROVINCE_LIST = PROVINCES
export const SEGMENTASI_OPTIONS = SEGMENTASI_LIST
export const SKALA_OPTIONS = SKALA_LIST

export function getCompanyById(id: string): Company | undefined {
  return COMPANIES.find((c) => c.id === id)
}