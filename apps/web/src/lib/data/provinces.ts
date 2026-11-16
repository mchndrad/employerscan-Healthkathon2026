export type ProvinceData = {
  name: string
  ecrs: number
  totalBU: number
  kasusKritis: number
  tier: "rendah" | "sedang" | "tinggi" | "kritis"
}

export const PROVINCE_DATA: Record<string, ProvinceData> = {
  // KRITIS (red)
  "DKI JAKARTA": { name: "DKI Jakarta", ecrs: 85, totalBU: 480, kasusKritis: 68, tier: "kritis" },
  "JAWA BARAT": { name: "Jawa Barat", ecrs: 78, totalBU: 420, kasusKritis: 52, tier: "kritis" },
  "JAWA TIMUR": { name: "Jawa Timur", ecrs: 76, totalBU: 312, kasusKritis: 48, tier: "kritis" },

  // TINGGI (orange)
  BANTEN: { name: "Banten", ecrs: 65, totalBU: 285, kasusKritis: 32, tier: "tinggi" },
  "SUMATERA UTARA": { name: "Sumatera Utara", ecrs: 62, totalBU: 258, kasusKritis: 28, tier: "tinggi" },
  "KALIMANTAN TIMUR": { name: "Kalimantan Timur", ecrs: 68, totalBU: 165, kasusKritis: 24, tier: "tinggi" },
  "SULAWESI SELATAN": { name: "Sulawesi Selatan", ecrs: 60, totalBU: 185, kasusKritis: 22, tier: "tinggi" },
  "SUMATERA SELATAN": { name: "Sumatera Selatan", ecrs: 58, totalBU: 180, kasusKritis: 18, tier: "tinggi" },
  RIAU: { name: "Riau", ecrs: 56, totalBU: 165, kasusKritis: 20, tier: "tinggi" },
  PAPUA: { name: "Papua", ecrs: 55, totalBU: 48, kasusKritis: 14, tier: "tinggi" },
  "PAPUA BARAT": { name: "Papua Barat", ecrs: 58, totalBU: 32, kasusKritis: 12, tier: "tinggi" },

  // SEDANG (amber)
  "JAWA TENGAH": { name: "Jawa Tengah", ecrs: 48, totalBU: 380, kasusKritis: 20, tier: "sedang" },
  LAMPUNG: { name: "Lampung", ecrs: 44, totalBU: 138, kasusKritis: 10, tier: "sedang" },
  "SUMATERA BARAT": { name: "Sumatera Barat", ecrs: 42, totalBU: 125, kasusKritis: 8, tier: "sedang" },
  "KEPULAUAN RIAU": { name: "Kepulauan Riau", ecrs: 45, totalBU: 98, kasusKritis: 9, tier: "sedang" },
  JAMBI: { name: "Jambi", ecrs: 40, totalBU: 85, kasusKritis: 7, tier: "sedang" },
  "KALIMANTAN BARAT": { name: "Kalimantan Barat", ecrs: 44, totalBU: 118, kasusKritis: 10, tier: "sedang" },
  "KALIMANTAN SELATAN": { name: "Kalimantan Selatan", ecrs: 46, totalBU: 102, kasusKritis: 9, tier: "sedang" },
  "SULAWESI TENGAH": { name: "Sulawesi Tengah", ecrs: 42, totalBU: 95, kasusKritis: 7, tier: "sedang" },
  "SULAWESI UTARA": { name: "Sulawesi Utara", ecrs: 38, totalBU: 82, kasusKritis: 5, tier: "sedang" },
  "SULAWESI TENGGARA": { name: "Sulawesi Tenggara", ecrs: 40, totalBU: 78, kasusKritis: 6, tier: "sedang" },
  BALI: { name: "Bali", ecrs: 40, totalBU: 142, kasusKritis: 8, tier: "sedang" },
  "NUSA TENGGARA BARAT": { name: "NTB", ecrs: 38, totalBU: 95, kasusKritis: 6, tier: "sedang" },
  "DI YOGYAKARTA": { name: "DI Yogyakarta", ecrs: 36, totalBU: 95, kasusKritis: 5, tier: "sedang" },

  // RENDAH (green)
  "KALIMANTAN TENGAH": { name: "Kalimantan Tengah", ecrs: 28, totalBU: 85, kasusKritis: 3, tier: "rendah" },
  "KALIMANTAN UTARA": { name: "Kalimantan Utara", ecrs: 26, totalBU: 42, kasusKritis: 2, tier: "rendah" },
  "SULAWESI BARAT": { name: "Sulawesi Barat", ecrs: 25, totalBU: 38, kasusKritis: 2, tier: "rendah" },
  GORONTALO: { name: "Gorontalo", ecrs: 24, totalBU: 42, kasusKritis: 2, tier: "rendah" },
  BENGKULU: { name: "Bengkulu", ecrs: 22, totalBU: 48, kasusKritis: 1, tier: "rendah" },
  ACEH: { name: "Aceh", ecrs: 20, totalBU: 72, kasusKritis: 1, tier: "rendah" },
  "KEPULAUAN BANGKA BELITUNG": { name: "Bangka Belitung", ecrs: 28, totalBU: 52, kasusKritis: 2, tier: "rendah" },
  MALUKU: { name: "Maluku", ecrs: 26, totalBU: 52, kasusKritis: 2, tier: "rendah" },
  "MALUKU UTARA": { name: "Maluku Utara", ecrs: 22, totalBU: 38, kasusKritis: 1, tier: "rendah" },
  "NUSA TENGGARA TIMUR": { name: "NTT", ecrs: 24, totalBU: 68, kasusKritis: 2, tier: "rendah" },
}

export function getProvinceData(name: string): ProvinceData | null {
  const upper = name.toUpperCase().trim()
  return PROVINCE_DATA[upper] ?? null
}

export function getTierColor(tier: ProvinceData["tier"]): string {
  switch (tier) {
    case "rendah":
      return "#10b981"
    case "sedang":
      return "#f59e0b"
    case "tinggi":
      return "#f97316"
    case "kritis":
      return "#ef4444"
  }
}

// =========================================================
// NEW: Classify tier dari skor ECRS
// =========================================================
export function tierFromEcrs(avgEcrs: number): ProvinceData["tier"] {
  if (avgEcrs >= 85) return "kritis"
  if (avgEcrs >= 70) return "tinggi"
  if (avgEcrs >= 50) return "sedang"
  return "rendah"
}