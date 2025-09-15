"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  FileText,
  ImageIcon,
  ExternalLink,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building,
  Briefcase,
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Produk",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Kategori",
    href: "/admin/categories",
    icon: ShoppingCart,
  },
  {
    name: "Pesan Masuk",
    href: "/admin/messages",
    icon: MessageSquare,
  },
  {
    name: "Blog",
    href: "/admin/blog",
    icon: FileText,
  },
  {
    name: "Galeri",
    href: "/admin/gallery",
    icon: ImageIcon,
  },
  {
    name: "Toko Online",
    href: "/admin/online-shops",
    icon: ExternalLink,
  },
  {
    name: "Lowongan Kerja",
    href: "/admin/jobs",
    icon: Briefcase,
  },
  {
    name: "Info Perusahaan",
    href: "/admin/company-info",
    icon: Building,
  },
  {
    name: "Pengaturan",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={cn("bg-card border-r transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">UB</span>
              </div>
              <span className="font-bold text-lg">Admin Panel</span>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center",
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                {!collapsed && item.name}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <Link
            href="/"
            className={cn(
              "flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
              collapsed && "justify-center",
            )}
            title={collapsed ? "Lihat Website" : undefined}
          >
            <ExternalLink className={cn("h-4 w-4", !collapsed && "mr-3")} />
            {!collapsed && "Lihat Website"}
          </Link>
        </div>
      </div>
    </div>
  )
}
