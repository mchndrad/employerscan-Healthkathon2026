// 🏗️ EmployerScan — Dashboard Shared Layout
// File: apps/web/src/app/(dashboard)/layout.tsx
// Phase 4 Step 5C — Wrapper semua halaman dashboard dengan Sidebar + Header

import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppHeader } from "@/components/layout/app-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

// ================================================================
// 🏗️ DASHBOARD LAYOUT — Shared untuk semua page di (dashboard)/
// ================================================================
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // SidebarProvider wajib wrap biar sidebar context (open/collapsed) tersedia
    // defaultOpen=true → sidebar expanded saat first load
    <SidebarProvider defaultOpen>
      
      {/* 📱 Sidebar — kiri, auto-collapse di mobile */}
      <AppSidebar />
      
      {/* 📄 SidebarInset — container konten utama di samping sidebar */}
      <SidebarInset>
        
        {/* 🎨 Top Header — sticky navbar */}
        <AppHeader />
        
        {/* 📝 Main Content Area — p-6 kasih spacing, flex-1 full height */}
        <main className="flex-1 p-6">
          {children}
        </main>
        
      </SidebarInset>
    </SidebarProvider>
  )
}