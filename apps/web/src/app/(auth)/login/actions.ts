/**
 * ============================================================
 * LOGIN SERVER ACTIONS
 * ============================================================
 * Server actions untuk authentication (login, register, logout).
 * File ini EXECUTE di server, bukan browser.
 *
 * KEUNTUNGAN SERVER ACTIONS:
 * 1. Credentials gak lewat browser JS bundle (lebih secure)
 * 2. Direct database access tanpa API endpoint
 * 3. Automatic form handling (progressive enhancement)
 * 4. Type-safe end-to-end
 * ============================================================
 */

// 'use server' = directive wajib untuk server actions
// Semua function di file ini akan jadi RPC endpoint auto
// (dipanggil dari client, execute di server)
'use server';

// Import redirect dari Next.js untuk redirect user setelah login
import { redirect } from 'next/navigation';

// Import Zod untuk validasi form input
import { z } from 'zod';

// Import Supabase server client
import { createClient } from '@/lib/supabase/server';

/**
 * Schema validasi untuk login form.
 *
 * Zod schema = blueprint shape data yang valid.
 * Benefit:
 *   - Validasi runtime (bukan compile-time doang kayak TypeScript)
 *   - Error message otomatis
 *   - TypeScript type auto-generated
 *
 * Note: Di Zod 4, syntax sedikit berubah:
 *   - z.string().email() → z.email() (lebih concise)
 *   - Masih support z.string().email() untuk compat
 */
const LoginSchema = z.object({
  // Email harus string valid email format
  // .email() = built-in email validator
  email: z
    .string()
    .min(1, { message: 'Email wajib diisi' })
    .email({ message: 'Format email tidak valid' }),

  // Password minimal 6 karakter
  // Untuk production, minimal 8 + mix of chars (nanti kita harden)
  password: z
    .string()
    .min(1, { message: 'Password wajib diisi' })
    .min(6, { message: 'Password minimal 6 karakter' }),
});

/**
 * Type helper untuk return value login action.
 * Berguna buat UI untuk conditional rendering (success vs error).
 */
export type LoginResult = {
  // Success flag — true kalau login berhasil
  success: boolean;
  // Error message umum (misal "Invalid credentials")
  error?: string;
  // Field-specific errors (misal { email: 'Format salah' })
  // Dipakai untuk tampilkan error di bawah input field
  fieldErrors?: {
    email?: string;
    password?: string;
  };
};

/**
 * Login action — handle user login dengan email + password.
 *
 * FLOW:
 * 1. Validate input (Zod)
 * 2. Call Supabase auth signInWithPassword
 * 3. Kalau sukses → redirect ke /dashboard
 * 4. Kalau gagal → return error object
 *
 * CARA DIPANGGIL DARI UI:
 *
 *   <form action={loginAction}>
 *     <input name="email" />
 *     <input name="password" type="password" />
 *     <button type="submit">Login</button>
 *   </form>
 *
 *   Form data auto-serialized ke FormData, auto-passed ke function
 *
 * @param prevState - State sebelumnya (dari useFormState hook)
 * @param formData - FormData object dari HTML form
 * @returns LoginResult atau redirect (gak return apa-apa kalau success)
 */
export async function loginAction(
  prevState: LoginResult | null,
  formData: FormData
): Promise<LoginResult> {
  // ====================================================================
  // STEP 1: EXTRACT & VALIDATE INPUT
  // ====================================================================
  // Extract fields dari FormData
  // formData.get() return FormDataEntryValue | null
  // Kita cast ke string karena HTML form input selalu string
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  // Validate pakai Zod schema
  // safeParse = non-throwing version (return { success, data, error })
  // Alternatif: schema.parse() yang throw error (lebih strict)
  const validation = LoginSchema.safeParse(rawData);

  // Kalau validation gagal → return error ke UI
  if (!validation.success) {
    // Zod error issues berisi detail per field
    // Kita transform jadi object { fieldName: errorMessage }
    const fieldErrors: LoginResult['fieldErrors'] = {};

    // Loop issues, map ke fieldErrors
    // Note: Zod 4 pakai .issues (bukan .errors seperti Zod 3)
    validation.error.issues.forEach(issue => {
      // issue.path = array path (misal ['email'])
      // issue.message = error message
      const field = issue.path[0] as keyof NonNullable<LoginResult['fieldErrors']>;
      fieldErrors[field] = issue.message;
    });

    // Return early dengan error
    return {
      success: false,
      fieldErrors,
    };
  }

  // ====================================================================
  // STEP 2: ATTEMPT LOGIN
  // ====================================================================
  // Create Supabase server client
  // Kita pakai server.ts versi (yang baca cookies dari next/headers)
  const supabase = await createClient();

  // Call Supabase auth
  // signInWithPassword return { data: { user, session }, error }
  const { error } = await supabase.auth.signInWithPassword({
    email: validation.data.email,
    password: validation.data.password,
  });

  // ====================================================================
  // STEP 3: HANDLE RESULT
  // ====================================================================
  // Kalau error (invalid credentials, user not found, etc)
  if (error) {
    // Return generic error message (don't leak detail — security best practice)
    // Attacker gak bisa tau apakah email ada atau password salah
    return {
      success: false,
      error: 'Email atau password salah',
    };
  }

  // ====================================================================
  // STEP 4: SUCCESS — REDIRECT TO DASHBOARD
  // ====================================================================
  // Redirect function throws special error yang Next.js catch
  // Setelah ini gak akan return apa-apa (function terminated)
  redirect('/dashboard');
}
/**
 * ============================================================
 * LOGOUT ACTION
 * ============================================================
 * Hapus session user + redirect ke /login
 *
 * CARA DIPANGGIL dari UI:
 *
 *   <form action={logoutAction}>
 *     <button type="submit">Logout</button>
 *   </form>
 *
 * ATAU dari client component:
 *
 *   'use client';
 *   import { logoutAction } from '@/app/(auth)/login/actions';
 *
 *   function LogoutButton() {
 *     return (
 *       <button onClick={() => logoutAction()}>Logout</button>
 *     );
 *   }
 * ============================================================
 */
export async function logoutAction() {
  // Create Supabase server client
  const supabase = await createClient();

  // Call signOut: clear session cookies + invalidate server session
  // Supabase akan:
  //   1. Remove JWT dari cookies
  //   2. Invalidate refresh token di server
  //   3. Prevent reuse session (security)
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('[logoutAction] Error:', error);
    // Log error tapi tetap redirect
    // Alasan: better UX, user tetap keluar meskipun ada error
  }

  // Redirect ke login page
  // Setelah redirect, proxy akan intercept semua protected routes
  redirect('/login');
}
