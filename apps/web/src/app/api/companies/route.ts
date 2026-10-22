/**
 * GET /api/companies
 * List companies dengan filter, pagination, search
 *
 * Query params:
 * - page, perPage (pagination)
 * - provinsi (filter by provinsi)
 * - tier (RENDAH/SEDANG/TINGGI/KRITIS)
 * - search (nama atau NPWP)
 * - sortBy, sortOrder
 */

import { z } from 'zod';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiSuccess, apiError, paginationMeta } from '@/lib/api/response';

// Zod schema: validasi query params (coerce string -> number)
const QuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  provinsi: z.string().optional(),
  tier: z.enum(['RENDAH', 'SEDANG', 'TINGGI', 'KRITIS']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['ecrs_score', 'nama', 'created_at']).default('ecrs_score'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export async function GET(request: NextRequest) {
  try {
    // Extract query params dari URL
    const { searchParams } = request.nextUrl;
    const rawParams = Object.fromEntries(searchParams.entries());

    // Validate pakai Zod
    const validation = QuerySchema.safeParse(rawParams);
    if (!validation.success) {
      return apiError(
        'Query parameters tidak valid',
        400,
        'VALIDATION_ERROR',
        validation.error.issues
      );
    }

    const { page, perPage, provinsi, tier, search, sortBy, sortOrder } =
      validation.data;

    // Create Supabase client (RLS applied)
    const supabase = await createClient();

    // Build query: select all + request total count
    let query = supabase.from('companies').select('*', { count: 'exact' });

    // Filter: provinsi (exact match)
    if (provinsi) {
      query = query.eq('provinsi', provinsi);
    }

    // Filter: tier (range based on ecrs_score)
    if (tier) {
      const ranges = {
        RENDAH: { min: 0, max: 39 },
        SEDANG: { min: 40, max: 59 },
        TINGGI: { min: 60, max: 79 },
        KRITIS: { min: 80, max: 100 },
      };
      const range = ranges[tier];
      query = query.gte('ecrs_score', range.min).lte('ecrs_score', range.max);
    }

    // Search: nama OR npwp (ilike = case-insensitive LIKE)
    if (search) {
      query = query.or(`nama.ilike.%${search}%,npwp.ilike.%${search}%`);
    }

    // Sort
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Pagination (range = LIMIT + OFFSET)
    const start = (page - 1) * perPage;
    const end = start + perPage - 1;
    query = query.range(start, end);

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      console.error('[API /api/companies] Supabase error:', error);
      return apiError('Gagal mengambil data companies', 500, 'DATABASE_ERROR');
    }

    // Success response dengan pagination meta
    return apiSuccess(data || [], paginationMeta(count || 0, page, perPage));
  } catch (err) {
    console.error('[API /api/companies] Unexpected error:', err);
    return apiError('Terjadi kesalahan pada server', 500, 'INTERNAL_SERVER_ERROR');
  }
}
