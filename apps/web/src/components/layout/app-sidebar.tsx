"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  BarChart3,
  MapPin,
  Network,
  LineChart,
  Scale,
  Camera,
  History,
  Settings,
  LogOut,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { logoutAction } from "@/app/(auth)/login/actions"
import { FileText } from "lucide-react"

const menuGroups = [
  {
    label: "Utama",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Perusahaan", url: "/perusahaan", icon: Building2 },
      { title: "Laporan Audit", url: "/laporan-audit", icon: FileText },
    ],
  },
  {
    label: "Inteligensi",
    items: [
      { title: "Geo-Intelligence", url: "/geo", icon: MapPin },
      { title: "Multi-Agency Hub", url: "/multi-agency", icon: Network },
      { title: "Benchmark Evidence", url: "/benchmark", icon: LineChart },
      { title: "Fairness Dashboard", url: "/fairness", icon: Scale },
    ],
  },
  {
    label: "Field Ops",
    items: [
      { title: "Field Audit", url: "/field-audit", icon: Camera },
      { title: "Audit Log", url: "/audit-log", icon: History },
    ],
  },
  {
    label: "Admin",
    items: [{ title: "Settings", url: "/settings", icon: Settings }],
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      {/* ============================================= */}
      {/* HEADER: Logo only (no bg, no text)            */}
      {/* ============================================= */}
            <SidebarHeader className="border-b border-border/50 py-4 px-3">
        <Link href="/dashboard" className="flex items-center justify-center group">
          <Image
            src="/logo-employerscan.png"
            alt="EmployerScan"
            width={180}
            height={54}
            style={{ width: "auto", height: "auto" }}
            className="h-14 max-h-14 w-auto object-contain group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:max-h-8 transition-all"
            priority
          />
        </Link>
      </SidebarHeader>

      {/* ============================================= */}
      {/* CONTENT: Menu groups (ALIGNED TOP, no center) */}
      {/* ============================================= */}
      <SidebarContent className="gap-0 py-2">
        {menuGroups.map((group, groupIdx) => (
          <SidebarGroup key={group.label} className="py-1">
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-3 mb-1">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url || pathname.startsWith(item.url + "/")
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.title}
                        render={<Link href={item.url} />}
                        className="group/menu-btn h-9 data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold hover:bg-muted transition-all"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.title}</span>
                        {isActive && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* ============================================= */}
      {/* FOOTER: User info + Logout                    */}
      {/* ============================================= */}
      <SidebarFooter className="border-t border-border/50 p-3">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 group-data-[collapsible=icon]:hidden mb-2">
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center shrink-0 ring-2 ring-primary/20">
            <span className="text-xs font-bold text-primary-foreground">CD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">
              Chandra Darmawan
            </p>
            <p className="text-[10px] text-muted-foreground truncate">
              Verifikator BPJS
            </p>
          </div>
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <form action={logoutAction} className="w-full">
              <SidebarMenuButton
                render={<button type="submit" />}
                tooltip="Logout"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive data-[active=true]:bg-destructive/10 w-full"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Logout</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}