/**
 * ============================================================
 * LOGIN PAGE
 * ============================================================
 * URL: /login
 * Component Type: Client Component (karena pakai React hooks)
 *
 * FITUR:
 * - Form login dengan email + password
 * - Field-level error validation
 * - Loading state saat submit
 * - Demo accounts hint untuk juri
 *
 * STYLING:
 * - Tailwind CSS 4
 * - BPJS Palette: hijau #00A651 (primary)
 * - Font: Plus Jakarta Sans (nanti kita set up Day 4)
 * ============================================================
 */

// 'use client' = directive wajib untuk Client Components
// Component ini akan ter-bundle & jalan di browser (bukan server)
// Alasan jadi client: pakai React hooks (useFormState, useFormStatus)
'use client';

// Import React hooks untuk form handling
// useActionState = hook untuk integrate Server Action dengan state
//   (React 19+ API, sebelumnya namanya useFormState)
import { useActionState } from 'react';

// Import useFormStatus — hook untuk track submit status (pending/idle)
// Berguna buat disable button saat form sedang submit
import { useFormStatus } from 'react-dom';

// Import Link untuk client-side navigation (prefetch, no page reload)
import Link from 'next/link';

// Import server action yang udah kita buat
import { loginAction, type LoginResult } from './actions';

/**
 * Submit Button Component (dengan loading state).
 *
 * Dipisah jadi component sendiri karena useFormStatus() hanya bisa
 * dipakai di dalam child dari <form>. Kalau di-inline di LoginPage,
 * useFormStatus() gak akan work.
 */
function SubmitButton() {
  // Hook untuk check status form parent (<form>)
  // pending = true saat form sedang submit, false kalau idle
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      // Disable button saat pending (biar user gak double-click)
      disabled={pending}
      // Tailwind classes:
      // w-full      = width 100%
      // bg-[#00A651] = BPJS brand green
      // text-white  = text putih
      // py-3        = padding vertical 0.75rem
      // rounded-lg  = border-radius medium
      // font-semibold = font-weight 600
      // disabled:*  = state saat disabled (opacity rendah, cursor not-allowed)
      // hover:*     = state saat hover (darker green)
      // transition  = smooth animation untuk hover
      className="w-full bg-[#00A651] text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#008A43] transition"
    >
      {/* Conditional rendering: tampilkan 'Loading...' kalau pending */}
      {pending ? 'Memproses...' : 'Login'}
    </button>
  );
}

/**
 * Main Login Page Component.
 *
 * Export default = Next.js auto-render ini saat URL /login diakses.
 */
export default function LoginPage() {
  // useActionState hook — integrate Server Action dengan component state
  //
  // Return array of [state, formAction, isPending]:
  //   state       = result dari server action (LoginResult object)
  //   formAction  = function yang di-pass ke <form action={}>
  //   isPending   = true saat action sedang execute
  //
  // Argument:
  //   1. Server action function (loginAction)
  //   2. Initial state (null untuk first render)
  const [state, formAction] = useActionState<LoginResult | null, FormData>(
    loginAction,
    null
  );

  return (
    // ====================================================================
    // CONTAINER (full-screen centered)
    // ====================================================================
    // min-h-screen = min height 100vh (full viewport height)
    // flex items-center justify-center = center horizontal + vertical
    // bg-gray-50 = background abu-abu muda (clean look)
    // p-4 = padding 1rem di mobile
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* ================================================================
          CARD (form container)
          ================================================================ */}
      {/* 
        max-w-md    = max width medium (448px) — ga terlalu lebar
        w-full      = width 100% dari parent (sampai max-w-md)
        bg-white    = background putih
        p-8         = padding 2rem
        rounded-2xl = border-radius extra-large (modern look)
        shadow-xl   = large shadow (depth)
       */}
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        {/* ============================================================
            HEADER (logo + title)
            ============================================================ */}
        <div className="text-center mb-8">
          {/* Logo placeholder — nanti kita ganti dengan logo asli Day 4 */}
          <div className="w-16 h-16 bg-[#00A651] rounded-2xl mx-auto mb-4 flex items-center justify-center">
            {/* Simple icon: shield emoji */}
            <span className="text-white text-3xl">🛡️</span>
          </div>

          {/* Title */}
          {/* text-2xl   = font-size large (1.5rem) */}
          {/* font-bold  = font-weight 700 */}
          {/* text-gray-900 = text hitam (bukan pure #000, biar lebih readable) */}
          <h1 className="text-2xl font-bold text-gray-900">EmployerScan</h1>

          {/* Subtitle */}
          <p className="text-sm text-gray-500 mt-1">
            Compliance Intelligence Platform
          </p>
        </div>

        {/* ============================================================
            FORM
            ============================================================ */}
        {/*
          action={formAction} = Next.js Server Action handler
          Form auto-serialize ke FormData, auto-pass ke loginAction
          Progressive enhancement: works tanpa JS!
         */}
        <form action={formAction} className="space-y-4">
          {/* ========================================================
              EMAIL FIELD
              ======================================================== */}
          <div>
            {/* Label untuk accessibility (screen reader) */}
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>

            {/* Input email */}
            {/*
              id={}       = untuk htmlFor label matching
              name={}     = key di FormData (ini yang dibaca formData.get('email'))
              type="email" = HTML5 email input (keyboard mobile keluar @ sign)
              required    = client-side validation (walau Zod juga ada)
              placeholder = hint text
              className   = Tailwind styling
            */}
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="admin@demo.employerscan.id"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none transition text-gray-900 bg-white placeholder:text-gray-400"
            />

            {/* Field-level error (dari Zod validation) */}
            {/* Conditional rendering: tampilkan kalau ada error di state */}
            {state?.fieldErrors?.email && (
              // text-red-600 = red (error indicator)
              // text-sm      = small font
              // mt-1         = margin-top kecil
              <p className="text-sm text-red-600 mt-1">
                {state.fieldErrors.email}
              </p>
            )}
          </div>

          {/* ========================================================
              PASSWORD FIELD
              ======================================================== */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none transition text-gray-900 bg-white placeholder:text-gray-400"
            />

            {state?.fieldErrors?.password && (
              <p className="text-sm text-red-600 mt-1">
                {state.fieldErrors.password}
              </p>
            )}
          </div>

          {/* ========================================================
              GENERAL ERROR (misal "Email atau password salah")
              ======================================================== */}
          {state?.error && (
            // bg-red-50     = red background super light
            // border-red-200 = border red muda
            // p-3           = padding
            // rounded-lg    = rounded corners
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <p className="text-sm text-red-600">{state.error}</p>
            </div>
          )}

          {/* ========================================================
              SUBMIT BUTTON
              ======================================================== */}
          {/* Component terpisah karena perlu useFormStatus */}
          <SubmitButton />
        </form>

        {/* ============================================================
            DEMO HINT (untuk juri Healthkathon)
            ============================================================ */}
        {/* bg-blue-50 = soft blue background */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs font-medium text-blue-900 mb-2">
            🎯 Demo Accounts (untuk juri):
          </p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• admin@demo.employerscan.id (Admin)</li>
            <li>• wasrik@demo.employerscan.id (Pengawas)</li>
            <li>• field@demo.employerscan.id (Field Officer)</li>
          </ul>
          <p className="text-xs text-blue-600 mt-2 italic">
            Password: demo123 (semua akun demo)
          </p>
        </div>

        {/* ============================================================
            FOOTER LINK (ke register, nanti)
            ============================================================ */}
        <p className="text-sm text-gray-600 text-center mt-6">
          Belum punya akun?{' '}
          <Link
            href="/register"
            className="text-[#00A651] font-semibold hover:underline"
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}