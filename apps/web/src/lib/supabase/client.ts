/**
 * SUPABASE CLIENT (Browser-side)
 * Dipakai di Client Components ('use client')
 * Session dibaca dari browser cookies otomatis
 */

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Ambil env variables (NEXT_PUBLIC_ = aman di browser)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Browser client: auto-handle cookies + auto-refresh JWT
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
