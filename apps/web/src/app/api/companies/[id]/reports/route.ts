/**
 * GET /api/companies/[id]/reports
 * Return monthly reports untuk 1 company (12 bulan)
 *
 * Query params:
 * - tahun: number (default 2026)
 */

import { z } from 'zod';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiSuccess, apiError, paginationMeta } from '@/lib/api/response';

// UUID validation untuk params.id
const ParamsSchema = z.object({
  id: z.string().uuid(),
});

// Tahun validation (default 2026, our data year)
const QuerySchema = z.object({
  tahun: z.coerce.number().int().min(2020).max(2030).default(2026),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Validate params (id dari URL)
    const resolvedParams = await params;
    const paramsValidation = ParamsSchema.safeParse(resolvedParams);
    if (!paramsValidation.success) {
      return apiError('ID company tidak valid', 400, 'INVALID_ID');
    }

    // Validate query (tahun)
    const { searchParams } = request.nextUrl;
    const queryValidation = QuerySchema.safeParse(
      Object.fromEntries(searchParams.entries())
    );
    if (!queryValidation.success) {
      return apiError(
        'Query parameters tidak valid',
        400,
        'VALIDATION_ERROR',
        queryValidation.error.issues
      );
    }

    const { id } = paramsValidation.data;
    const { tahun } = queryValidation.data;
    const supabase = await createClient();

    // Query: reports untuk company + tahun tertentu
    // Order by bulan ASC (Jan -> Dec)
    const { data, error, count } = await supabase
      .from('monthly_reports')
      .select('*', { count: 'exact' })
      .eq('company_id', id)
      .eq('tahun', tahun)
      .order('bulan', { ascending: true });

    if (error) {
      console.error('[API /reports] Supabase error:', error);
      return apiError('Gagal mengambil data reports', 500, 'DATABASE_ERROR');
    }

    // Return dengan meta (walau max 12 bulan, consistent response shape)
    return apiSuccess(data || [], paginationMeta(count || 0, 1, 100));
  } catch (err) {
    console.error('[API /reports] Unexpected error:', err);
    return apiError('Terjadi kesalahan pada server', 500);
  }
}
