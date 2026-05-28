"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  Sun,
  Moon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

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
  const [isDark, setIsDark] = useState(true)
  const toggleThemeRef = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark")
    }
    return true
  })[0]

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark")
    setIsDark(prev => !prev)
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Scale className="h-7 w-7 text-teal transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-teal/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal to-teal-light bg-clip-text text-transparent">
              Consult Legal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <Link href="/">
              <Button variant="ghost" size="sm" className={cn("text-sm", pathname === "/" && "text-teal")}>
                Home
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-sm gap-1">
                  Products <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-72">
                {products.map((product) => (
                  <DropdownMenuItem key={product.name} asChild>
                    <Link href={product.href} className="flex items-start gap-3 p-3 cursor-pointer">
                      <product.icon className="h-5 w-5 text-teal mt-0.5 shrink-0" />
                      <div>
                        <div className="font-medium text-sm">{product.name}</div>
                        <div className="text-xs text-muted-foreground">{product.desc}</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-sm gap-1">
                  Knowledge Base <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-64">
                {knowledgeBase.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link href={item.href} className="flex items-start gap-3 p-3 cursor-pointer">
                      <item.icon className="h-5 w-5 text-teal mt-0.5 shrink-0" />
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.desc}</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-sm gap-1">
                  Platform Policies <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                {platformPolicies.map((policy) => (
                  <DropdownMenuItem key={policy.name} asChild>
                    <Link href={policy.href} className="cursor-pointer flex items-center gap-2">
                      <Shield className="h-4 w-4 text-teal" />
                      {policy.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/contact">
              <Button variant="ghost" size="sm" className={cn("text-sm", pathname === "/contact" && "text-teal")}>
                Contact
              </Button>
            </Link>
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Link href="/login">
              <Button size="sm" className="bg-teal hover:bg-teal-dark text-white font-medium">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(!isMobileOpen)}>
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
            className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              <Link href="/" onClick={() => setIsMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Home</Button>
              </Link>
              <div className="pl-4 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 pt-2">Products</p>
                {products.map((p) => (
                  <Link key={p.name} href={p.href} onClick={() => setIsMobileOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <p.icon className="h-4 w-4 text-teal" />
                      {p.name}
                    </Button>
                  </Link>
                ))}
              </div>
              <div className="pl-4 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 pt-2">Knowledge Base</p>
                {knowledgeBase.map((item) => (
                  <Link key={item.name} href={item.href} onClick={() => setIsMobileOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <item.icon className="h-4 w-4 text-teal" />
                      {item.name}
                    </Button>
                  </Link>
                ))}
              </div>
              <div className="pl-4 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 pt-2">Policies</p>
                {platformPolicies.map((policy) => (
                  <Link key={policy.name} href={policy.href} onClick={() => setIsMobileOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">{policy.name}</Button>
                  </Link>
                ))}
              </div>
              <Link href="/contact" onClick={() => setIsMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Contact</Button>
              </Link>
              <div className="pt-2 border-t border-border">
                <Link href="/login" onClick={() => setIsMobileOpen(false)}>
                  <Button className="w-full bg-teal hover:bg-teal-dark text-white">Get Started</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
