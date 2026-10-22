/**
 * SUPABASE CLIENT (Server-side)
 * Dipakai di Server Components, Route Handlers, Server Actions
 * Session dibaca dari HTTP cookies via next/headers
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  // Async karena cookies() async di Next.js 15+
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // Baca semua cookies dari request
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Tulis cookies ke response (saat refresh session)
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Normal di Server Components (read-only cookies)
            // Session refresh di-handle oleh proxy.ts
          }
        },
      },
    }
  );
}
