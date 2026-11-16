// 🔤 EmployerScan — Root Layout dengan Editorial Fonts + Global Providers
// File: apps/web/src/app/layout.tsx
// Phase 4 Step 4 — Added TooltipProvider + Sonner Toaster

import type { Metadata } from "next"
import { Instrument_Serif, Inter, Geist_Mono } from "next/font/google"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

// ================================================================
// 🔤 FONT SETUP — Editorial Premium Stack
// ================================================================

// Instrument Serif — Display serif untuk headings (editorial, premium)
const instrumentSerif = Instrument_Serif({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
})

// Inter — Body text (clean, readable)
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
})

// Geist Mono — Monospace untuk code
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

// ================================================================
// 📄 METADATA
// ================================================================
export const metadata: Metadata = {
  title: "EmployerScan — BPJS Compliance Intelligence",
  description: "Platform intelijen kepatuhan BPJS untuk Pemberi Kerja — Healthkathon 2026",
  keywords: ["BPJS", "Compliance", "Fraud Detection", "Healthkathon 2026", "AI"],
  authors: [{ name: "Team NGOPI DIPENGKOLAN" }],
}

// ================================================================
// 🏗️ ROOT LAYOUT — Dengan global providers
// ================================================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${instrumentSerif.variable} ${inter.variable} ${geistMono.variable} antialiased`}
      >
        {/* 
          🎯 TooltipProvider — WAJIB wrap biar semua <Tooltip> di child components jalan
          delayDuration=0 bikin tooltip langsung muncul tanpa hover delay (optional UX tweak)
        */}
        <TooltipProvider>
          {children}
        </TooltipProvider>

        {/* 
          🍞 Toaster — Mount global biar toast() bisa dipanggil dari komponen manapun
          Contoh pemakaian nanti: toast.success("BU berhasil di-flag")
          Position top-right = standar notification placement
        */}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}