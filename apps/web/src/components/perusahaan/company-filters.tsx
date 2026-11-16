"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Filter, Calendar, MapPin, Briefcase, AlertTriangle, LayoutGrid, List } from "lucide-react"
import { PROVINCE_LIST, SEGMENTASI_OPTIONS, SKALA_OPTIONS } from "@/lib/data/companies"

const TIER_OPTIONS = [
  { value: "rendah", label: "Patuh (0-30)" },
  { value: "sedang", label: "Sedang (31-50)" },
  { value: "tinggi", label: "Tinggi (51-70)" },
  { value: "kritis", label: "Kritis (71-100)" },
]

export function CompanyFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchValue, setSearchValue] = useState(searchParams.get("q") ?? "")

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete("page")
    startTransition(() => router.push(`/perusahaan?${params.toString()}`))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilter("q", searchValue)
  }

  const resetAll = () => {
    setSearchValue("")
    startTransition(() => router.push("/perusahaan"))
  }

  const hasActiveFilters = Array.from(searchParams.keys()).some(k => k !== "page")

  return (
    <div className="bg-card border rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative flex-1 min-w-70">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari NPWP, nama perusahaan, atau NIK penanggung jawab..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9 h-10"
          />
        </form>

        {/* Wilayah */}
        <FilterSelect
          icon={<MapPin className="h-3.5 w-3.5" />}
          label="Wilayah"
          value={searchParams.get("province") ?? ""}
          options={PROVINCE_LIST.map((p) => ({ value: p, label: p }))}
          placeholder="Semua"
          onChange={(v) => updateFilter("province", v)}
        />

        {/* Sektor */}
        <FilterSelect
          icon={<Briefcase className="h-3.5 w-3.5" />}
          label="Sektor"
          value={searchParams.get("segmentasi") ?? ""}
          options={SEGMENTASI_OPTIONS.map((s) => ({ value: s, label: s }))}
          placeholder="Semua"
          onChange={(v) => updateFilter("segmentasi", v)}
        />

        {/* Skala */}
        <FilterSelect
          icon={<LayoutGrid className="h-3.5 w-3.5" />}
          label="Skala"
          value={searchParams.get("skala") ?? ""}
          options={SKALA_OPTIONS.map((s) => ({ value: s, label: s }))}
          placeholder="Semua"
          onChange={(v) => updateFilter("skala", v)}
        />

        {/* ECRS */}
        <FilterSelect
          icon={<AlertTriangle className="h-3.5 w-3.5" />}
          label="ECRS"
          value={searchParams.get("tier") ?? ""}
          options={TIER_OPTIONS}
          placeholder="0-100"
          onChange={(v) => updateFilter("tier", v)}
        />

        {/* Period (visual only) */}
        <div className="flex items-center gap-1.5 h-10 px-3 rounded-md border bg-background text-sm cursor-pointer hover:bg-muted/50">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-medium">Okt 2026</span>
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetAll} className="text-xs h-10 gap-1 text-primary">
            <X className="h-3 w-3" />
            Reset Filter
          </Button>
        )}
      </div>

      {isPending && (
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <div className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          Memuat data...
        </div>
      )}
    </div>
  )
}

function FilterSelect({
  icon,
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  icon: React.ReactNode
  label: string
  value: string
  options: { value: string; label: string }[]
  placeholder: string
  onChange: (value: string) => void
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 pl-8 pr-8 rounded-md border border-input bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer appearance-none"
      >
        <option value="">{label}: {placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
        {icon}
      </span>
    </div>
  )
}