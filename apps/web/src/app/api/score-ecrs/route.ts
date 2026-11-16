/**
 * API Route: POST /api/score-ecrs
 *
 * Terima data BU + monthly reports → compute ECRS score + SHAP
 * Optional: save ke Supabase jika `saveToDb: true`
 *
 * Path file: apps/web/src/app/api/score-ecrs/route.ts
 */

import { NextRequest, NextResponse } from "next/server"
import { computeEcrs, type BUScoreInput } from "@/lib/ecrs-scorer"
import { getServerSupabase } from "@/lib/supabase"

export const runtime = "nodejs"

type RequestBody = {
  // Data BU
  npwp: string
  nama: string
  bentuk_badan: string
  alamat: string
  kota: string
  provinsi: string
  kelurahan?: string | null
  kecamatan?: string | null
  sektor_usaha: string
  tanggal_berdiri?: string | null // ISO date
  pic_name?: string | null
  pic_phone?: string | null
  pic_email?: string | null
  jumlah_karyawan_terdaftar: number
  jumlah_karyawan_aktual?: number | null

  // Data iuran bulanan
  monthlyReports: Array<{
    bulan: number
    tahun: number
    iuran_wajib: number
    iuran_dibayar: number
    tunggakan: number
    rata_upah: number
  }>

  // Flags
  saveToDb?: boolean // Jika true, insert ke tabel companies + monthly_reports
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json()

    // Validasi minimal
    if (!body.npwp || !body.nama || !body.provinsi) {
      return NextResponse.json(
        { error: "NPWP, nama, dan provinsi wajib diisi" },
        { status: 400 },
      )
    }

    if (!body.monthlyReports || body.monthlyReports.length === 0) {
      return NextResponse.json(
        { error: "Data iuran bulanan minimal 1 bulan" },
        { status: 400 },
      )
    }

    // Compute ECRS
    const tahunBerdiri = body.tanggal_berdiri
      ? new Date(body.tanggal_berdiri).getFullYear()
      : null

    const scoreInput: BUScoreInput = {
      provinsi: body.provinsi,
      tahun_berdiri: tahunBerdiri,
      jumlah_karyawan_terdaftar: body.jumlah_karyawan_terdaftar,
      jumlah_karyawan_aktual: body.jumlah_karyawan_aktual ?? null,
      monthlyReports: body.monthlyReports.map((r) => ({
        bulan: r.bulan,
        tahun: r.tahun,
        iuran_wajib: r.iuran_wajib,
        iuran_dibayar: r.iuran_dibayar,
        tunggakan: r.tunggakan,
        rata_upah: r.rata_upah,
      })),
    }

    const result = computeEcrs(scoreInput)

    // Jika saveToDb, insert ke Supabase
    if (body.saveToDb) {
      const sb = getServerSupabase()

      // Cek NPWP sudah ada
      const { data: existing } = await sb
        .from("companies")
        .select("id, npwp")
        .eq("npwp", body.npwp)
        .maybeSingle()

      if (existing) {
        return NextResponse.json(
          {
            error: `BU dengan NPWP ${body.npwp} sudah terdaftar di sistem.`,
            existingNpwp: body.npwp,
          },
          { status: 409 },
        )
      }

      // Insert company
      const { data: company, error: companyError } = await sb
        .from("companies")
        .insert({
          npwp: body.npwp,
          nama: body.nama,
          bentuk_badan: body.bentuk_badan,
          alamat: body.alamat,
          kota: body.kota,
          provinsi: body.provinsi,
          kelurahan: body.kelurahan ?? null,
          kecamatan: body.kecamatan ?? null,
          sektor_usaha: body.sektor_usaha,
          tanggal_berdiri: body.tanggal_berdiri ?? null,
          pic_name: body.pic_name ?? null,
          pic_phone: body.pic_phone ?? null,
          pic_email: body.pic_email ?? null,
          jumlah_karyawan_terdaftar: body.jumlah_karyawan_terdaftar,
          jumlah_karyawan_aktual: body.jumlah_karyawan_aktual ?? null,
          ecrs_score: result.score,
          ecrs_tier: result.tier,
          ecrs_last_computed_at: new Date().toISOString(),
          status: "AKTIF",
        })
        .select("id, npwp")
        .single()

      if (companyError || !company) {
        return NextResponse.json(
          {
            error: `Gagal insert company: ${companyError?.message ?? "unknown"}`,
          },
          { status: 500 },
        )
      }

      // Insert monthly reports
      const monthlyRows = body.monthlyReports.map((r) => ({
        company_id: company.id,
        bulan: r.bulan,
        tahun: r.tahun,
        iuran_jkn_wajib: r.iuran_wajib,
        iuran_jkn_dibayar: r.iuran_dibayar,
        tunggakan: r.tunggakan,
        rata_upah_dilaporkan: r.rata_upah,
        total_upah_dilaporkan: r.rata_upah * body.jumlah_karyawan_terdaftar,
        jumlah_karyawan_dilaporkan: body.jumlah_karyawan_terdaftar,
        status_bayar:
          r.tunggakan === 0
            ? "LUNAS"
            : r.iuran_dibayar > 0
              ? "SEBAGIAN"
              : "BELUM",
        tanggal_lapor: new Date(r.tahun, r.bulan - 1, 15).toISOString(),
        source: "MANUAL_INPUT",
        anomaly_flag: false,
      }))

      const { error: reportsError } = await sb
        .from("monthly_reports")
        .insert(monthlyRows)

      if (reportsError) {
        return NextResponse.json(
          {
            error: `Gagal insert monthly reports: ${reportsError.message}`,
            companyNpwp: company.npwp,
          },
          { status: 500 },
        )
      }

      // Log audit entry
      await sb.from("audit_log").insert({
        actor_name: "Verifikator Chandra",
        actor_role: "VERIFIKATOR",
        action: "CREATE_COMPANY",
        description: `Menambahkan BU baru: ${body.nama} (NPWP: ${body.npwp}). ECRS Score: ${result.score} (${result.tier}).`,
        severity: result.tier === "KRITIS" ? "CRITICAL" : "INFO",
        company_id: company.id,
      })

      return NextResponse.json({
        success: true,
        saved: true,
        companyId: company.id,
        npwp: company.npwp,
        result,
      })
    }

    // Preview mode (tidak save)
    return NextResponse.json({
      success: true,
      saved: false,
      result,
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error"
    console.error("[score-ecrs]", err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}