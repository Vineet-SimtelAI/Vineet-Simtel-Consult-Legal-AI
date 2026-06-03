"use client"

import { useEffect, useState } from "react"
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
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth-store"

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
  const { user, isAuthenticated, login, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const store = useAuthStore.getState()
    if (store.isAuthenticated && store.token) {
      document.cookie = `cl_token=${store.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
      setChecked(true)
    } else if (!store.isAuthenticated) {
      router.replace("/login?callbackUrl=" + encodeURIComponent(pathname))
    } else {
      setChecked(true)
    }
  }, [pathname, router])

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 bg-ink">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-ivory/30" />
          <p className="text-sm text-ivory/30">Loading...</p>
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <div className="min-h-screen flex pt-16 bg-ink">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-white/[0.06] bg-ink">
        <div className="p-5 border-b border-white/[0.06]">
          <Link href="/" className="flex items-center gap-2.5">
            <Scale className="h-5 w-5 text-ivory/60" />
            <span className="font-medium text-ivory tracking-tight">Consult Legal</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {sidebarItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-sm rounded-none text-ivory/40 hover:text-ivory hover:bg-white/[0.04]",
                  pathname === item.href && "text-ivory bg-white/[0.04]"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-7 h-7 rounded-full bg-ivory/10 flex items-center justify-center text-ivory/50 text-xs font-medium">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ivory/70 truncate">{user?.name || "User"}</p>
              <p className="text-xs text-ivory/30 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {user?.creditBalance ?? 0} credits
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-ivory/30 hover:text-red-400 hover:bg-white/[0.04] rounded-none"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-ink">
        {/* Mobile header */}
        <div className="md:hidden p-4 border-b border-white/[0.06] flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-ivory/50 hover:bg-white/[0.04] rounded-none">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex items-center gap-2 text-ivory/40">
            <Zap className="h-3.5 w-3.5" />
            <span className="text-sm">{user?.creditBalance ?? 0} credits</span>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden p-3 border-b border-white/[0.06] space-y-0.5">
            {sidebarItems.map((item) => (
              <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start gap-2 text-sm rounded-none text-ivory/40 hover:text-ivory hover:bg-white/[0.04]",
                    pathname === item.href && "text-ivory bg-white/[0.04]"
                  )}
                >
                  <item.icon className="h-4 w-4" /> {item.name}
                </Button>
              </Link>
            ))}
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-red-400 hover:bg-white/[0.04] rounded-none" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        )}

        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
