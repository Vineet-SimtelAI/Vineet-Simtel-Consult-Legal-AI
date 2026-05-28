"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Users,
  CreditCard,
  Settings,
  Scale,
  LogOut,
  Zap,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth-store"
import { useState } from "react"

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Documents", href: "/dashboard/documents", icon: FileText },
  { name: "AI Chat", href: "/dashboard/chat", icon: MessageSquare },
  { name: "Lawyers", href: "/dashboard/lawyers", icon: Users },
  { name: "Consultations", href: "/dashboard/consultations", icon: CreditCard },
  { name: "Credits", href: "/dashboard/credits", icon: Zap },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <div className="min-h-screen flex pt-16">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/50">
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-teal" />
            <span className="font-bold text-lg">Consult Legal</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 text-sm",
                  pathname === item.href && "bg-teal/10 text-teal hover:bg-teal/15"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center text-teal text-sm font-bold">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Zap className="h-3 w-3 text-teal" />
                {user?.creditBalance ?? 0} credits
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="md:hidden p-4 border-b border-border flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-teal" />
            <span className="text-sm font-medium">{user?.creditBalance ?? 0} credits</span>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden p-4 border-b border-border space-y-1">
            {sidebarItems.map((item) => (
              <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full justify-start gap-2 text-sm",
                    pathname === item.href && "bg-teal/10 text-teal"
                  )}
                >
                  <item.icon className="h-4 w-4" /> {item.name}
                </Button>
              </Link>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        )}

        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
