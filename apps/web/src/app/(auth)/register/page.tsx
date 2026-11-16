'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  User,
  Mail,
  FileText,
  Lock,
  Eye,
  EyeOff,
  Building2,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'

import { registerAction, type RegisterResult } from './actions'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      size="lg"
      disabled={pending}
      className="group w-full h-11 text-sm font-semibold gap-2 bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:shadow-primary/40"
    >
      {pending ? (
        <span className="animate-pulse">Memproses...</span>
      ) : (
        <>
          Daftar Akun
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </>
      )}
    </Button>
  )
}

export default function RegisterPage() {
  const [state, formAction] = useActionState<RegisterResult | null, FormData>(
    registerAction,
    null
  )
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <main className="h-screen grid lg:grid-cols-2 bg-background overflow-hidden">

      {/* LEFT COLUMN — Form */}
      <section className="flex flex-col justify-between p-6 lg:p-8 overflow-y-auto animate-in fade-in-50 duration-500">

        {/* Top: Logo + KEMITRAAN badge */}
        <div className="space-y-3 animate-in fade-in-50 slide-in-from-top-4 duration-700">
          <Image
            src="/logo-employerscan.png"
            alt="EmployerScan"
            width={400}
            height={120}
            priority
            className="h-12 w-auto object-contain"
          />
          <div className="inline-flex items-center gap-2 rounded-full bg-chart-3/15 border border-chart-3/30 px-3 py-1">
            <Sparkles className="h-3 w-3 text-chart-3" />
            <span className="text-[10px] font-bold tracking-widest text-chart-4">
              KEMITRAAN KEPATUHAN JKN 2026
            </span>
          </div>
        </div>

        {/* Middle: Form */}
        <div className="max-w-md w-full mx-auto space-y-4 py-4 animate-in fade-in-50 slide-in-from-bottom-8 duration-700 delay-150">

          {/* Heading */}
          <div className="space-y-1">
            <h1 className="font-heading text-4xl lg:text-5xl text-foreground tracking-tighter leading-[0.95]">
              Daftar Akun Baru
            </h1>
            <p className="text-muted-foreground text-sm">
              Bergabung dengan platform intelijen kepatuhan BPJS Kesehatan.
            </p>
          </div>

          <form action={formAction} className="space-y-3" noValidate>

            {/* NAMA LENGKAP */}
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-[10px] font-bold uppercase tracking-wider text-foreground">
                Nama Lengkap <span className="text-destructive">*</span>
              </Label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary pointer-events-none" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Chandra Darmawan"
                  className="pl-10 h-10 text-sm focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
              {state?.fieldErrors?.fullName && (
                <p className="text-xs text-destructive">{state.fieldErrors.fullName}</p>
              )}
            </div>

            {/* EMAIL */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-foreground">
                Email Kedinasan <span className="text-destructive">*</span>
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary pointer-events-none" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="pic@perusahaan.co.id"
                  className="pl-10 h-10 text-sm focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
              {state?.fieldErrors?.email && (
                <p className="text-xs text-destructive">{state.fieldErrors.email}</p>
              )}
            </div>

            {/* NPWP + Verifikasi Otomatis badge */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="npwp" className="text-[10px] font-bold uppercase tracking-wider text-foreground">
                  NPWP Perusahaan <span className="text-destructive">*</span>
                </Label>
                <Badge variant="outline" className="gap-1 text-primary border-primary/40 bg-primary/10 font-semibold text-[9px] h-5 px-1.5">
                  <ShieldCheck className="h-2.5 w-2.5" />
                  Verifikasi Otomatis
                </Badge>
              </div>
              <div className="relative group">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary pointer-events-none" />
                <Input
                  id="npwp"
                  name="npwp"
                  type="text"
                  placeholder="01.234.567.8-123.456"
                  className="pl-10 h-10 text-sm focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
              {state?.fieldErrors?.npwp && (
                <p className="text-xs text-destructive">{state.fieldErrors.npwp}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-foreground">
                Kata Sandi <span className="text-destructive">*</span>
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary pointer-events-none" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••••••"
                  className="pl-10 pr-10 h-10 text-sm focus-visible:ring-2 focus-visible:ring-primary/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                <ShieldCheck className="h-2.5 w-2.5 text-primary" />
                Min 8 karakter, 1 huruf besar, 1 angka
              </p>
              {state?.fieldErrors?.password && (
                <p className="text-xs text-destructive">{state.fieldErrors.password}</p>
              )}
            </div>

            {/* KONFIRMASI PASSWORD */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-[10px] font-bold uppercase tracking-wider text-foreground">
                Konfirmasi Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary pointer-events-none" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••••••"
                  className="pl-10 pr-10 h-10 text-sm focus-visible:ring-2 focus-visible:ring-primary/40"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {state?.fieldErrors?.confirmPassword && (
                <p className="text-xs text-destructive">{state.fieldErrors.confirmPassword}</p>
              )}
            </div>

            {/* Agreement */}
            <div className="flex items-start gap-2 pt-0.5">
              <input
                type="checkbox"
                id="agreement"
                name="agreement"
                required
                className="mt-0.5 h-4 w-4 rounded accent-primary"
              />
              <label htmlFor="agreement" className="text-xs text-foreground leading-relaxed cursor-pointer">
                Saya menyetujui{' '}
                <Link href="/terms" className="text-primary font-semibold hover:underline">
                  Syarat & Ketentuan
                </Link>{' '}
                dan{' '}
                <Link href="/privacy" className="text-primary font-semibold hover:underline">
                  Kebijakan Privasi
                </Link>{' '}
                EmployerScan
              </label>
            </div>

            {state?.error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-2.5">
                <p className="text-xs text-destructive font-medium">{state.error}</p>
              </div>
            )}

            <SubmitButton />
          </form>

          {/* Login redirect card */}
          <div className="rounded-xl border border-border bg-card p-3 space-y-2 hover:border-primary/40 hover:shadow-md transition-all">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-0">
                  <p className="text-xs font-bold text-foreground leading-tight">
                    Sudah memiliki akun EmployerScan?
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    Masuk untuk akses platform intelijen kepatuhan.
                  </p>
                </div>
              </div>
              <Link
                href="/login"
                className={`${buttonVariants({ variant: 'outline', size: 'sm' })} transition-all hover:scale-105 hover:border-primary hover:text-primary font-semibold shrink-0 text-xs`}
              >
                Masuk
              </Link>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground pt-1.5 border-t border-border">
              <ShieldCheck className="h-3 w-3 text-primary shrink-0" />
              <span>Data Anda dilindungi enkripsi AES-256 dan sesuai UU PDP 2022.</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex flex-wrap items-center justify-between gap-3 text-[10px] text-muted-foreground pt-2">
          <div className="flex items-center gap-1.5">
            <span>🇮🇩</span>
            <span className="font-medium">© 2026 Tim NGOPI DIPENGKOLAN · Healthkathon</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/help" className="hover:text-foreground">Bantuan</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-foreground">Privasi</Link>
            <span>•</span>
            <span className="flex items-center gap-1 font-semibold text-primary">
              <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
              99.98%
            </span>
          </div>
        </footer>
      </section>

      {/* RIGHT COLUMN — Branding */}
      <section
        className="hidden lg:flex flex-col justify-between p-8 relative overflow-hidden text-white animate-in slide-in-from-right-8 duration-700"
        style={{
          background: `linear-gradient(135deg, 
            #00A651 0%, 
            #00A651 25%, 
            #007E5C 50%, 
            #006B7A 75%, 
            #005BAC 100%
          )`,
        }}
      >

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 85% 15%, rgba(255,255,255,0.2), transparent 60%)' }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 15% 85%, rgba(0,30,60,0.3), transparent 60%)' }}
        />

        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-white/15 blur-3xl pointer-events-none animate-glow-pulse" />
        <div
          className="absolute bottom-20 left-10 h-80 w-80 rounded-full bg-chart-3/20 blur-3xl pointer-events-none animate-glow-pulse"
          style={{ animationDelay: '2s' }}
        />

        {/* TOP: Tagline (compact) */}
        <div className="relative z-10 animate-in fade-in-50 slide-in-from-top-4 duration-700 delay-200">
          <div className="relative">
            <div
              className="absolute -top-8 -left-4 font-heading text-[140px] leading-none text-white/15 select-none pointer-events-none drop-shadow-lg"
              aria-hidden="true"
            >
              &ldquo;
            </div>
            <div className="relative pl-6 pt-4">
              <p className="font-heading italic text-2xl lg:text-3xl text-white drop-shadow-lg leading-tight tracking-tight">
                Bergabung bersama 15.000 Badan Usaha
                <br />
                yang telah memilih transparansi.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-px w-10 bg-chart-3" />
                <p className="text-[10px] font-bold tracking-[0.2em] text-white/90 uppercase drop-shadow">
                  Komunitas Kepatuhan · 2026
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE: Hero + 4 Floating Cards (compact) */}
        <div className="relative flex-1 flex items-center justify-center my-2 z-10">
          <div className="relative w-full max-w-sm animate-in fade-in-50 zoom-in-95 duration-1000 delay-400">

            <div className="absolute inset-0 bg-white/15 rounded-[3rem] blur-3xl scale-110 animate-glow-pulse" />

            <div className="relative animate-float">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-2 ring-white/40 bg-white/5 backdrop-blur-sm">
                <Image
                  src="/register-hero.png"
                  alt="EmployerScan Registration"
                  width={600}
                  height={600}
                  priority
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 animate-shimmer pointer-events-none" />
              </div>
            </div>

            {/* CARD 1: TOP-RIGHT */}
            <div
              className="absolute -top-5 -right-5 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/50 p-3 shadow-2xl hover:scale-110 transition-transform"
              style={{ animation: 'float 5s ease-in-out infinite' }}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <ShieldCheck className="h-3 w-3 drop-shadow" />
                <span className="text-[10px] font-bold tracking-widest drop-shadow">VERIFIKASI INSTAN</span>
              </div>
              <div className="font-heading text-2xl text-white drop-shadow-lg">&lt;30s</div>
              <p className="text-[9px] text-white font-semibold mt-0.5 drop-shadow">NPWP + NIB check</p>
            </div>

            {/* CARD 2: BOTTOM-LEFT */}
            <div
              className="absolute -bottom-5 -left-5 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/50 p-3 shadow-2xl hover:scale-110 transition-transform"
              style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '1.5s' }}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <Building2 className="h-3 w-3 drop-shadow" />
                <span className="text-[10px] font-bold tracking-widest drop-shadow">BADAN USAHA AKTIF</span>
              </div>
              <div className="font-heading text-lg text-white drop-shadow-lg">15.000+ Terdaftar</div>
              <p className="text-[9px] text-white font-semibold mt-0.5 drop-shadow">Platform EmployerScan</p>
            </div>

            {/* CARD 3: TOP-LEFT */}
            <div
              className="absolute top-6 -left-10 rounded-2xl bg-white/25 backdrop-blur-xl border border-white/40 p-2.5 shadow-2xl hover:scale-110 transition-transform"
              style={{ animation: 'float 4.5s ease-in-out infinite', animationDelay: '2s' }}
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-white/25 flex items-center justify-center shrink-0">
                  <Users className="h-3.5 w-3.5 text-white drop-shadow" />
                </div>
                <div>
                  <div className="text-[9px] font-bold tracking-wider drop-shadow">KOMUNITAS</div>
                  <div className="font-heading text-sm text-white drop-shadow-lg">PIC Bersertifikat</div>
                </div>
              </div>
            </div>

            {/* CARD 4: BOTTOM-RIGHT */}
            <div
              className="absolute bottom-6 -right-10 rounded-2xl bg-white/25 backdrop-blur-xl border border-white/40 p-2.5 shadow-2xl hover:scale-110 transition-transform"
              style={{ animation: 'float 5.5s ease-in-out infinite', animationDelay: '0.5s' }}
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-white/25 flex items-center justify-center shrink-0">
                  <Zap className="h-3.5 w-3.5 text-white drop-shadow" />
                </div>
                <div>
                  <div className="text-[9px] font-bold tracking-wider drop-shadow">ONBOARDING</div>
                  <div className="font-heading text-sm text-white drop-shadow-lg">Cepat & Mudah</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: Headline + Stats (compact) */}
        <div className="space-y-3 relative z-10 animate-in fade-in-50 slide-in-from-bottom-8 duration-700 delay-500">
          <div className="space-y-2">
            <h2 className="font-heading text-3xl lg:text-4xl tracking-tight leading-[1.05] text-white drop-shadow-lg">
              Satu Platform. Semua Kepatuhan.
            </h2>
            <p className="text-sm text-white leading-relaxed max-w-xl font-medium drop-shadow">
              Gabung ke ekosistem compliance intelligence BPJS Kesehatan. Lindungi hak kesehatan{' '}
              <strong className="font-bold">282 juta peserta JKN</strong> bersama kami.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/30">
            <div className="group cursor-default">
              <div className="font-heading text-2xl text-white drop-shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:text-chart-3">
                100%
              </div>
              <div className="text-[10px] text-white font-semibold mt-0.5 drop-shadow">Compliance Automated</div>
            </div>
            <div className="group cursor-default">
              <div className="font-heading text-2xl text-white drop-shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:text-chart-3">
                4
              </div>
              <div className="text-[10px] text-white font-semibold mt-0.5 drop-shadow">Agencies Terintegrasi</div>
            </div>
            <div className="group cursor-default">
              <div className="font-heading text-2xl text-white drop-shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:text-chart-3">
                UU PDP
              </div>
              <div className="text-[10px] text-white font-semibold mt-0.5 drop-shadow">Fully Compliant</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}