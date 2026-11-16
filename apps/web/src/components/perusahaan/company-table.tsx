import Link from "next/link"
import { cn } from "cn"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowRight, Eye, Sparkles } from "lucide-react"
import type { Company } from "@/lib/data/companies"

interface CompanyTableProps {
  companies: Company[]
  page: number
  perPage: number
  total: number
  totalPages: number
  currentParams: Record<string, string | undefined>
}

function tierConfig(tier: Company["tier"]) {
  switch (tier) {
    case "rendah":
      return {
        label: "PATUH",
        text: "text-emerald-600",
        bar: "bg-emerald-500",
        accent: "border-l-emerald-500",
        rowHover: "hover:bg-emerald-50/30",
        avatarGrad: "bg-gradient-to-br from-emerald-400 to-emerald-600",
        avatarShadow: "shadow-emerald-500/20",
        ringGlow: "shadow-[0_0_12px_rgba(16,185,129,0.3)]",
      }
    case "sedang":
      return {
        label: "SEDANG",
        text: "text-amber-600",
        bar: "bg-amber-500",
        accent: "border-l-amber-500",
        rowHover: "hover:bg-amber-50/30",
        avatarGrad: "bg-gradient-to-br from-amber-400 to-amber-600",
        avatarShadow: "shadow-amber-500/20",
        ringGlow: "shadow-[0_0_12px_rgba(245,158,11,0.3)]",
      }
    case "tinggi":
      return {
        label: "TINGGI",
        text: "text-orange-600",
        bar: "bg-orange-500",
        accent: "border-l-orange-500",
        rowHover: "hover:bg-orange-50/30",
        avatarGrad: "bg-gradient-to-br from-orange-400 to-orange-600",
        avatarShadow: "shadow-orange-500/20",
        ringGlow: "shadow-[0_0_12px_rgba(249,115,22,0.3)]",
      }
    case "kritis":
      return {
        label: "KRITIS",
        text: "text-red-600",
        bar: "bg-red-500",
        accent: "border-l-red-500",
        rowHover: "hover:bg-red-50/30",
        avatarGrad: "bg-gradient-to-br from-red-400 to-red-600",
        avatarShadow: "shadow-red-500/20",
        ringGlow: "shadow-[0_0_12px_rgba(239,68,68,0.3)]",
      }
  }
}

function skalaColor(skala: Company["skalaUsaha"]) {
  switch (skala) {
    case "MIKRO":
      return "bg-slate-100 text-slate-700 border-slate-200"
    case "KECIL":
      return "bg-sky-50 text-sky-700 border-sky-200"
    case "MENENGAH":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "BESAR":
      return "bg-indigo-50 text-indigo-700 border-indigo-200"
  }
}

function buildPageUrl(params: Record<string, string | undefined>, page: number) {
  const sp = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v && k !== "page") sp.set(k, v)
  })
  sp.set("page", page.toString())
  return `/perusahaan?${sp.toString()}`
}

export function CompanyTable({ companies, page, perPage, total, totalPages, currentParams }: CompanyTableProps) {
  const start = (page - 1) * perPage + 1
  const end = Math.min(page * perPage, total)

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-linear-to-r from-slate-50 to-slate-50/50">
              <th className="w-10 px-4 py-4 border-b border-slate-200">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 cursor-pointer" />
              </th>
              <th className="w-10 text-left px-2 py-4 text-[9px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200">#</th>
              <th className="text-left px-4 py-4 text-[9px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200">Perusahaan</th>
              <th className="text-left px-4 py-4 text-[9px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200">Sektor</th>
              <th className="text-left px-4 py-4 text-[9px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200">Wilayah</th>
              <th className="text-center px-4 py-4 text-[9px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200">Skala</th>
              <th className="text-right px-4 py-4 text-[9px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200">Pekerja</th>
              <th className="text-center px-4 py-4 text-[9px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 min-w-45">ECRS Score</th>
              <th className="text-center px-4 py-4 text-[9px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 w-28">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-20">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium">Tidak ada data yang sesuai filter</p>
                    <p className="text-xs">Coba ubah filter atau reset pencarian</p>
                  </div>
                </td>
              </tr>
            ) : (
              companies.map((c, idx) => {
                const tier = tierConfig(c.tier)
                const rowNum = ((page - 1) * perPage + idx + 1).toString().padStart(2, "0")
                const scorePct = c.ecrsScore

                return (
                  <tr
                    key={c.id}
                    className={cn(
                      "group border-l-[3px] transition-all duration-200 animate-in fade-in-0 slide-in-from-left-2",
                      tier.accent,
                      tier.rowHover
                    )}
                    style={{
                      animationDelay: `${idx * 40}ms`,
                      animationFillMode: "backwards",
                      animationDuration: "500ms",
                    }}
                  >
                    <td className="px-4 py-4 border-b border-slate-100">
                      <input type="checkbox" className="h-4 w-4 rounded border-slate-300 cursor-pointer" />
                    </td>
                    <td className="px-2 py-4 text-[11px] font-mono text-slate-400 border-b border-slate-100">
                      {rowNum}
                    </td>
                    <td className="px-4 py-4 border-b border-slate-100">
                      <Link href={`/perusahaan/${c.id}`} className="flex items-center gap-3 group/name">
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-lg transition-all group-hover/name:scale-110 group-hover/name:rotate-3",
                          tier.avatarGrad,
                          tier.avatarShadow
                        )}>
                          {c.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate group-hover/name:text-primary transition-colors">
                            {c.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5 tracking-tight">
                            {c.npwp}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-700 border-b border-slate-100">
                      {c.segmentasi}
                    </td>
                    <td className="px-4 py-4 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">🇮🇩</span>
                        <span className="text-xs text-slate-700 whitespace-nowrap font-medium">
                          {c.province}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center border-b border-slate-100">
                      <Badge className={cn("text-[9px] font-bold border px-2 py-0.5", skalaColor(c.skalaUsaha))}>
                        {c.skalaUsaha}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-right border-b border-slate-100">
                      <div className="flex items-baseline justify-end gap-1">
                        <span className="text-sm font-bold text-slate-900 tabular-nums">
                          {c.totalKaryawan.toLocaleString("id-ID")}
                        </span>
                        <span className="text-[9px] text-slate-400">jiwa</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        {/* Radial progress */}
                        <div className="relative h-10 w-10 shrink-0">
                          <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-100" />
                            <circle
                              cx="18" cy="18" r="15"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeDasharray={`${(scorePct / 100) * 94.25} 94.25`}
                              strokeLinecap="round"
                              className={cn("transition-all duration-700", tier.text)}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className={cn("text-[10px] font-bold tabular-nums", tier.text)}>
                              {c.ecrsScore}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 min-w-0">
                          <span className={cn("text-[10px] font-bold uppercase tracking-wider", tier.text)}>
                            {tier.label}
                          </span>
                          <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={cn("h-full rounded-full transition-all duration-1000", tier.bar)}
                              style={{ width: `${scorePct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center border-b border-slate-100">
                      <Link
                        href={`/perusahaan/${c.id}`}
                        className={cn(
                          "inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[11px] font-bold",
                          "bg-slate-900 text-white",
                          "hover:bg-primary hover:shadow-md hover:shadow-primary/30",
                          "transition-all duration-200 group/btn"
                        )}
                      >
                        <Eye className="h-3 w-3" />
                        Deep Dive
                        <ArrowRight className="h-3 w-3 opacity-70 group-hover/btn:translate-x-0.5 group-hover/btn:opacity-100 transition-transform" />
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-linear-to-r from-slate-50/50 to-white">
          <p className="text-xs text-slate-600">
            Menampilkan <strong className="text-slate-900 tabular-nums">{start}</strong>–
            <strong className="text-slate-900 tabular-nums">{end}</strong> dari{" "}
            <strong className="text-slate-900 tabular-nums">{total.toLocaleString("id-ID")}</strong>{" "}
            badan usaha
          </p>

          <div className="flex items-center gap-1">
            {page > 1 ? (
              <Link
                href={buildPageUrl(currentParams, page - 1)}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "h-9 w-9 p-0 bg-white hover:bg-slate-50"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
            ) : (
              <Button variant="outline" size="sm" disabled className="h-9 w-9 p-0 bg-white">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}

            <div className="px-4 py-2 text-xs">
              <strong className="text-slate-900 tabular-nums">{page}</strong>
              <span className="text-slate-400"> / {totalPages}</span>
            </div>

            {page < totalPages ? (
              <Link
                href={buildPageUrl(currentParams, page + 1)}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "h-9 w-9 p-0 bg-white hover:bg-slate-50"
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <Button variant="outline" size="sm" disabled className="h-9 w-9 p-0 bg-white">
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}