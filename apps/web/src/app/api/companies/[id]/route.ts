/**
 * GET /api/companies/[id]
 * Return detail single company by UUID
 */

import { z } from 'zod';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiSuccess, apiError } from '@/lib/api/response';

// Validate UUID format
const ParamsSchema = z.object({
  id: z.string().uuid({ message: 'ID harus berupa UUID valid' }),
});

export async function GET(
  request: NextRequest,
  // Next.js 15+: params adalah Promise, harus di-await
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Resolve params Promise
    const resolvedParams = await params;

    // Validate UUID
    const validation = ParamsSchema.safeParse(resolvedParams);
    if (!validation.success) {
      return apiError(
        'ID company tidak valid',
        400,
        'INVALID_ID',
        validation.error.issues
      );
    }

    const { id } = validation.data;
    const supabase = await createClient();

    // Query: single company by ID
    // .single() = expect exactly 1 result
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // PGRST116 = PostgREST "no rows returned" (bukan error beneran)
      if (error.code === 'PGRST116') {
        return apiError('Company tidak ditemukan', 404, 'NOT_FOUND');
      }
      console.error('[API /companies/[id]] Supabase error:', error);
      return apiError('Gagal mengambil data company', 500, 'DATABASE_ERROR');
    }

    return apiSuccess(data);
  } catch (err) {
    console.error('[API /companies/[id]] Unexpected error:', err);
    return apiError('Terjadi kesalahan pada server', 500);
  }
}
