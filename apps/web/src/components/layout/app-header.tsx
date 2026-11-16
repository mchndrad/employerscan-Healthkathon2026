// 🎨 EmployerScan — Top Navigation Header
// File: apps/web/src/components/layout/app-header.tsx
// Phase 4 Step 5B — Header dengan SidebarTrigger + Title + Notifications + User menu

"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Bell, Search } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// ================================================================
// 📍 PAGE TITLE MAPPING — URL → readable title
// ================================================================
// Mapping ini bikin header auto-display judul halaman berdasarkan URL
// Nanti bisa diupgrade ke breadcrumb dinamis di Phase 5
const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/perusahaan": "Daftar Perusahaan",
  "/deep-dive": "Deep Dive Analysis",
  "/geo-intelligence": "Geo-Intelligence",
  "/multi-agency": "Multi-Agency Hub",
  "/benchmark": "Benchmark Evidence",
  "/fairness": "Fairness Dashboard",
  "/field-audit": "Field Audit",
  "/audit-log": "Audit Log",
  "/settings": "Pengaturan",
}

// Helper function: ambil title dari pathname
// Default fallback: "EmployerScan"
function getPageTitle(pathname: string | null): string {
  if (!pathname) return "EmployerScan"
  
  // Cek exact match dulu
  if (pageTitles[pathname]) return pageTitles[pathname]
  
  // Cek partial match (e.g. /perusahaan/123 → "Daftar Perusahaan")
  const matchedKey = Object.keys(pageTitles).find((key) =>
    pathname.startsWith(key + "/")
  )
  
  return matchedKey ? pageTitles[matchedKey] : "EmployerScan"
}

// ================================================================
// 🎨 APP HEADER COMPONENT
// ================================================================
export function AppHeader() {
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)
  
  // State dummy untuk notifikasi count — nanti di-replace dengan real data
  const [notificationCount] = React.useState(3)

  return (
    // Header sticky di atas, dengan border-bottom + background
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4">
      
      {/* ================================================= */}
      {/* LEFT SECTION — Sidebar trigger + Title            */}
      {/* ================================================= */}
      <div className="flex items-center gap-3">
        {/* 
          SidebarTrigger — tombol hamburger untuk toggle sidebar
          Shadcn component yang auto-handle open/close state
        */}
        <SidebarTrigger className="-ml-1" />
        
        {/* Separator vertikal antara trigger dan title */}
        <Separator orientation="vertical" className="h-4" />
        
        {/* Page title — pakai font-heading = Instrument Serif */}
        <h1 className="font-heading text-lg text-foreground">
          {pageTitle}
        </h1>
      </div>

      {/* ================================================= */}
      {/* RIGHT SECTION — Search + Notifications + User    */}
      {/* ================================================= */}
      <div className="ml-auto flex items-center gap-2">
        
        {/* Search button — nanti di-upgrade ke search bar di Phase 5 */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Notification bell dengan badge count */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          
          {/* Badge count — muncul kalau ada notifikasi */}
          {notificationCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full px-1 text-xs font-semibold tabular-nums"
            >
              {notificationCount}
            </Badge>
          )}
        </Button>

        {/* Separator vertikal sebelum user avatar */}
        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* User avatar — nanti di Phase 5 di-wrap dengan DropdownMenu */}
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full p-0"
          aria-label="User menu"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatar-placeholder.png" alt="Chandra" />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs">
              CD
            </AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </header>
  )
}