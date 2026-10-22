/**
 * GET /api/stats/dashboard
 * Return aggregated metrics untuk dashboard homepage
 *
 * Metrics:
 * - total_companies
 * - total_provinsi
 * - risk_breakdown (count per tier)
 * - financial_summary (iuran wajib/dibayar/tunggakan + compliance %)
 * - top_risk_companies (5 BU dengan ECRS tertinggi)
 */

import { createClient } from '@/lib/supabase/server';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET() {
  try {
    const supabase = await createClient();

    // PARALLEL QUERIES - jalankan semua barengan (lebih cepat 4-5x)
    const [
      companiesResult,
      riskBreakdownResult,
      financialResult,
      topRiskResult,
    ] = await Promise.all([
      // Query 1: Total companies + provinsi list
      supabase.from('companies').select('provinsi', { count: 'exact' }),

      // Query 2: Semua ecrs_score untuk compute tier breakdown
      supabase.from('companies').select('ecrs_score'),

      // Query 3: Financial data dari monthly reports
      supabase
        .from('monthly_reports')
        .select('iuran_jkn_wajib, iuran_jkn_dibayar, tunggakan')
        .eq('tahun', 2026),

      // Query 4: Top 5 risk companies
      supabase
        .from('companies')
        .select('id, nama, npwp, provinsi, ecrs_score, sektor_usaha')
        .order('ecrs_score', { ascending: false })
        .limit(5),
    ]);

    // Error check untuk semua queries
    const errors = [
      companiesResult.error,
      riskBreakdownResult.error,
      financialResult.error,
      topRiskResult.error,
    ].filter(Boolean);

    if (errors.length > 0) {
      console.error('[API /stats/dashboard] Errors:', errors);
      return apiError(
        'Gagal mengambil statistik dashboard',
        500,
        'DATABASE_ERROR'
      );
    }

    // AGGREGATE: total companies
    const totalCompanies = companiesResult.count || 0;

    // AGGREGATE: unique provinces (Set dedupe + size)
    const uniqueProvinces = new Set(
      companiesResult.data?.map(c => c.provinsi) || []
    );
    const totalProvinsi = uniqueProvinces.size;

    // AGGREGATE: risk breakdown per tier
    const riskBreakdown = { RENDAH: 0, SEDANG: 0, TINGGI: 0, KRITIS: 0 };
    riskBreakdownResult.data?.forEach(({ ecrs_score }) => {
      if (ecrs_score >= 80) riskBreakdown.KRITIS++;
      else if (ecrs_score >= 60) riskBreakdown.TINGGI++;
      else if (ecrs_score >= 40) riskBreakdown.SEDANG++;
      else riskBreakdown.RENDAH++;
    });

    // AGGREGATE: financial summary (sum iuran & tunggakan)
    const financialSummary = financialResult.data?.reduce(
      (acc, report) => ({
        iuran_wajib: acc.iuran_wajib + (report.iuran_jkn_wajib || 0),
        iuran_dibayar: acc.iuran_dibayar + (report.iuran_jkn_dibayar || 0),
        tunggakan: acc.tunggakan + (report.tunggakan || 0),
      }),
      { iuran_wajib: 0, iuran_dibayar: 0, tunggakan: 0 }
    ) || { iuran_wajib: 0, iuran_dibayar: 0, tunggakan: 0 };

    // Compute compliance rate %
    const complianceRate =
      financialSummary.iuran_wajib > 0
        ? Math.round(
            (financialSummary.iuran_dibayar / financialSummary.iuran_wajib) *
              10000
          ) / 100
        : 0;

    // Build response
    return apiSuccess({
      total_companies: totalCompanies,
      total_provinsi: totalProvinsi,
      risk_breakdown: riskBreakdown,
      financial_summary: {
        ...financialSummary,
        compliance_rate_pct: complianceRate,
      },
      top_risk_companies: topRiskResult.data || [],
    });
  } catch (err) {
    console.error('[API /stats/dashboard] Unexpected error:', err);
    return apiError('Terjadi kesalahan pada server', 500);
  }
}
