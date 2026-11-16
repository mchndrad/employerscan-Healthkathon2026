/**
 * ============================================================
 * REGISTER SERVER ACTION
 * ============================================================
 * Flow: 
 * 1. Validate input dengan Zod
 * 2. Call Supabase signUp
 * 3. Kalau success → redirect ke /login dengan message
 * 4. Kalau error → return error object
 * ============================================================
 */

'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

// Schema validasi register (lebih strict dari login)
const RegisterSchema = z
  .object({
    fullName: z
      .string()
      .min(1, { message: 'Nama lengkap wajib diisi' })
      .min(3, { message: 'Nama minimal 3 karakter' }),
    email: z
      .string()
      .min(1, { message: 'Email wajib diisi' })
      .email({ message: 'Format email tidak valid' }),
    npwp: z
      .string()
      .min(1, { message: 'NPWP wajib diisi' })
      .min(15, { message: 'NPWP harus 15-16 digit' }),
    password: z
      .string()
      .min(8, { message: 'Password minimal 8 karakter' })
      .regex(/[A-Z]/, { message: 'Password harus ada huruf besar' })
      .regex(/[0-9]/, { message: 'Password harus ada angka' }),
    confirmPassword: z.string().min(1, { message: 'Konfirmasi password wajib' }),
  })
  // Custom check: password dan confirmPassword harus sama
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password dan konfirmasi tidak cocok',
    path: ['confirmPassword'],
  })

export type RegisterResult = {
  success: boolean
  error?: string
  fieldErrors?: {
    fullName?: string
    email?: string
    npwp?: string
    password?: string
    confirmPassword?: string
  }
}

export async function registerAction(
  prevState: RegisterResult | null,
  formData: FormData
): Promise<RegisterResult> {
  // Extract fields dari FormData
  const rawData = {
    fullName: formData.get('fullName') as string,
    email: formData.get('email') as string,
    npwp: formData.get('npwp') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  // Validate dengan Zod
  const validation = RegisterSchema.safeParse(rawData)

  if (!validation.success) {
    const fieldErrors: RegisterResult['fieldErrors'] = {}
    validation.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof NonNullable<RegisterResult['fieldErrors']>
      fieldErrors[field] = issue.message
    })
    return { success: false, fieldErrors }
  }

  // Create Supabase client + call signUp
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: validation.data.email,
    password: validation.data.password,
    options: {
      data: {
        full_name: validation.data.fullName,
        npwp: validation.data.npwp,
        role: 'verifikator', // Default role untuk register
      },
    },
  })

  if (error) {
    return {
      success: false,
      error: error.message.includes('already')
        ? 'Email sudah terdaftar. Silakan login.'
        : 'Gagal mendaftar. Coba lagi nanti.',
    }
  }

  // Success → redirect ke login dengan query param
  redirect('/login?registered=true')
}