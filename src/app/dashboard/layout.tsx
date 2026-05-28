"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Users,
  CreditCard,
  Settings,
  Scale,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Documents", href: "/dashboard/documents", icon: FileText },
  { name: "AI Chat", href: "/dashboard/chat", icon: MessageSquare },
  { name: "Lawyers", href: "/dashboard/lawyers", icon: Users },
  { name: "Consultations", href: "/dashboard/consultations", icon: CreditCard },
  { name: "Credits", href: "/dashboard/credits", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

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
            <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center text-teal text-sm font-bold">U</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">User Name</p>
              <p className="text-xs text-muted-foreground">25 credits</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="md:hidden p-4 border-b border-border flex items-center gap-2 overflow-x-auto">
          {sidebarItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "shrink-0 gap-1 text-xs",
                  pathname === item.href && "bg-teal/10 text-teal"
                )}
              >
                <item.icon className="h-3 w-3" /> {item.name}
              </Button>
            </Link>
          ))}
        </div>

        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
