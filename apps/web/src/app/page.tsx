/**
 * ============================================================
 * ROOT PAGE — EmployerScan Smart Redirect
 * ============================================================
 * File: apps/web/src/app/page.tsx
 * URL: / (root)
 *
 * BEHAVIOR:
 * - Kalau user authenticated → redirect ke /dashboard
 * - Kalau user guest (belum login) → redirect ke /login
 *
 * ALASAN DIBUAT:
 * Sebelumnya page ini adalah test page BPJS palette untuk Phase 4
 * Step 3 (verifikasi fonts + palette). Sekarang Phase 4 udah selesai,
 * jadi root URL harus functional:
 * - Guest buka localhost:3000 → auto ke /login (seamless UX)
 * - User authenticated → auto ke /dashboard (gak perlu ketik URL)
 *
 * SERVER COMPONENT:
 * Component ini async karena perlu check Supabase auth state.
 * Tidak ada JSX render — murni redirect logic.
 * ============================================================
 */

/**
 * ROOT PAGE — Smart Redirect
 * Fix: instant=false biar bisa async cookies() tanpa prerender error
 */

import { connection } from "next/server"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function RootPage() {
  // Force dynamic rendering (fix Date.now() prerender error)
  await connection()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  redirect("/login")
}