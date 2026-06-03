"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Scale,
  Menu,
  X,
  ChevronDown,
  FileText,
  Users,
  Bot,
  BookOpen,
  Shield,
  LogOut,
  Zap,
  User,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth-store"

const products = [
  { name: "Legal Documents Workflow", href: "/products/documents", icon: FileText, desc: "Generate legal documents in minutes" },
  { name: "Lawyer Marketplace", href: "/products/lawyers", icon: Users, desc: "Connect with verified lawyers" },
  { name: "AI Legal Assistant", href: "/products/ai-chat", icon: Bot, desc: "Instant AI-powered legal answers" },
]

const knowledgeBase = [
  { name: "Documents", href: "/documents", icon: FileText, desc: "Browse legal document templates" },
  { name: "Resources", href: "/resources", icon: BookOpen, desc: "Expert legal guides and articles" },
]

const platformPolicies = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms & Conditions", href: "/terms" },
  { name: "Payment Policy", href: "/payment" },
  { name: "Refunds Policy", href: "/refunds" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-ink/90 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Scale className="h-6 w-6 text-ivory transition-opacity group-hover:opacity-70" />
            <span className="text-lg font-medium text-ivory tracking-tight">
              Consult Legal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <Link href="/">
              <Button variant="ghost" size="sm" className={cn("text-sm text-ivory/70 hover:text-ivory hover:bg-white/[0.04] rounded-none", pathname === "/" && "text-ivory")}>
                Home
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-sm gap-1 text-ivory/70 hover:text-ivory hover:bg-white/[0.04] rounded-none">
                  Products <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-72 bg-ink-light border-white/[0.06]">
                {products.map((product) => (
                  <DropdownMenuItem key={product.name} asChild>
                    <Link href={product.href} className="flex items-start gap-3 p-3 cursor-pointer hover:bg-white/[0.04] focus:bg-white/[0.04]">
                      <product.icon className="h-5 w-5 text-ivory/60 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-medium text-sm text-ivory">{product.name}</div>
                        <div className="text-xs text-ivory/40">{product.desc}</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-sm gap-1 text-ivory/70 hover:text-ivory hover:bg-white/[0.04] rounded-none">
                  Knowledge Base <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-64 bg-ink-light border-white/[0.06]">
                {knowledgeBase.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link href={item.href} className="flex items-start gap-3 p-3 cursor-pointer hover:bg-white/[0.04] focus:bg-white/[0.04]">
                      <item.icon className="h-5 w-5 text-ivory/60 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-medium text-sm text-ivory">{item.name}</div>
                        <div className="text-xs text-ivory/40">{item.desc}</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-sm gap-1 text-ivory/70 hover:text-ivory hover:bg-white/[0.04] rounded-none">
                  Policies <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="bg-ink-light border-white/[0.06]">
                {platformPolicies.map((policy) => (
                  <DropdownMenuItem key={policy.name} asChild>
                    <Link href={policy.href} className="cursor-pointer flex items-center gap-2 text-ivory/70 hover:bg-white/[0.04] focus:bg-white/[0.04]">
                      <Shield className="h-4 w-4 text-ivory/40" />
                      {policy.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/contact">
              <Button variant="ghost" size="sm" className={cn("text-sm text-ivory/70 hover:text-ivory hover:bg-white/[0.04] rounded-none", pathname === "/contact" && "text-ivory")}>
                Contact
              </Button>
            </Link>
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <Link href="/dashboard/credits">
                  <Button variant="ghost" size="sm" className="gap-1 text-ivory/70 hover:text-ivory hover:bg-white/[0.04] rounded-none">
                    <Zap className="h-3.5 w-3.5" />
                    {user.creditBalance}
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 text-ivory/70 hover:text-ivory hover:bg-white/[0.04] rounded-none">
                      <div className="w-5 h-5 rounded-full bg-ivory/10 flex items-center justify-center text-ivory text-[10px] font-medium">
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <span className="max-w-[80px] truncate">{user.name?.split(" ")[0] || "User"}</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-ink-light border-white/[0.06]">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer flex items-center gap-2 text-ivory/70 hover:bg-white/[0.04]">
                        <User className="h-4 w-4" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings" className="cursor-pointer flex items-center gap-2 text-ivory/70 hover:bg-white/[0.04]">
                        <Settings className="h-4 w-4" /> Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/[0.06]" />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-400 focus:text-red-400 hover:bg-white/[0.04] focus:bg-white/[0.04]">
                      <LogOut className="h-4 w-4 mr-2" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm" className="bg-ivory text-ink font-medium rounded-sm hover:bg-ivory/90 text-sm px-5 h-8">
                  Get Started
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-ivory hover:bg-white/[0.04] rounded-none">
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-ink/95 backdrop-blur-xl border-b border-white/[0.06]"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              <Link href="/" onClick={() => setIsMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-ivory/70 hover:text-ivory hover:bg-white/[0.04] rounded-none">Home</Button>
              </Link>
              {products.map((p) => (
                <Link key={p.name} href={p.href} onClick={() => setIsMobileOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-ivory/70 hover:text-ivory hover:bg-white/[0.04] rounded-none pl-6">
                    <p.icon className="h-4 w-4 text-ivory/40" />
                    {p.name}
                  </Button>
                </Link>
              ))}
              {knowledgeBase.map((item) => (
                <Link key={item.name} href={item.href} onClick={() => setIsMobileOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-ivory/70 hover:text-ivory hover:bg-white/[0.04] rounded-none pl-6">
                    <item.icon className="h-4 w-4 text-ivory/40" />
                    {item.name}
                  </Button>
                </Link>
              ))}
              <Link href="/contact" onClick={() => setIsMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-ivory/70 hover:text-ivory hover:bg-white/[0.04] rounded-none">Contact</Button>
              </Link>
              <div className="pt-3 border-t border-white/[0.06]">
                {isAuthenticated && user ? (
                  <div className="space-y-1">
                    <Link href="/dashboard" onClick={() => setIsMobileOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-2 text-ivory/70 hover:text-ivory hover:bg-white/[0.04] rounded-none">
                        <User className="h-4 w-4" /> Dashboard ({user.creditBalance} credits)
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full justify-start gap-2 text-red-400 hover:bg-white/[0.04] rounded-none" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" /> Sign Out
                    </Button>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setIsMobileOpen(false)}>
                    <Button className="w-full bg-ivory text-ink font-medium rounded-sm hover:bg-ivory/90">Get Started</Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
