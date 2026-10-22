/**
 * GET /api/integrations
 * Return status 4 external integrations (e-Dabu, DJP, WLKP, AHU)
 * Simple endpoint untuk Multi-Agency Hub page
 */

import { createClient } from '@/lib/supabase/server';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch all integrations (max 4 rows)
    // Order by source: alphabetical, consistent order
    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .order('source', { ascending: true });

    if (error) {
      console.error('[API /integrations] Supabase error:', error);
      return apiError(
        'Gagal mengambil data integrations',
        500,
        'DATABASE_ERROR'
      );
    }

    return apiSuccess(data || []);
  } catch (err) {
    console.error('[API /integrations] Unexpected error:', err);
    return apiError('Terjadi kesalahan pada server', 500);
  }
}
