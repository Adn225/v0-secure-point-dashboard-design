"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  FileText,
  Cpu,
  BarChart3,
  Settings,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  {
    name: "Employees",
    href: "/employees",
    icon: Users,
    children: [{ name: "Horaire et plannification", href: "/settings" }],
  },
  { name: "Access Logs", href: "/access-logs", icon: FileText },
  { name: "Devices", href: "/devices", icon: Cpu },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-16 flex-col border-r border-border bg-sidebar lg:w-64">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Shield className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="hidden text-lg font-semibold text-sidebar-foreground lg:block">
          SecurePoint
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <div key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-sidebar-accent",
                  isActive
                    ? "bg-sidebar-accent text-primary"
                    : "text-muted-foreground hover:text-sidebar-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground"
                  )}
                />
                <span className="hidden lg:block">{item.name}</span>
              </Link>

              {item.children?.length ? (
                <div className="ml-11 mt-1 hidden space-y-1 lg:block">
                  {item.children.map((child) => {
                    const isChildActive = pathname === child.href
                    return (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={cn(
                          "block rounded-md px-2 py-1.5 text-xs transition-all hover:bg-sidebar-accent",
                          isChildActive
                            ? "bg-sidebar-accent text-primary"
                            : "text-muted-foreground hover:text-sidebar-foreground"
                        )}
                      >
                        {child.name}
                      </Link>
                    )
                  })}
                </div>
              ) : null}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <div className="hidden items-center gap-2 text-xs text-muted-foreground lg:flex">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <span>HikCentral v3.2</span>
        </div>
      </div>
    </aside>
  )
}
