/**
 * ROOT PROXY (Next.js 16+)
 * Dulu bernama middleware.ts, di Next.js 16+ diganti jadi proxy.ts
 * Berjalan untuk SETIAP request yang match matcher config.
 */

// Import helper dari lib/supabase (BUKAN app/supabase!)
import { updateSession } from '@/lib/supabase/middleware';
import type { NextRequest } from 'next/server';

/**
 * Proxy function - auto-dipanggil Next.js untuk setiap request.
 * Delegate ke helper updateSession buat session refresh + route protection.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

/**
 * Matcher: exclude static assets dari proxy
 * (performance - gak perlu auth check buat images/fonts)
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
