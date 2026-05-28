"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { FileText, MessageSquare, Users, CreditCard, ArrowRight, TrendingUp, Zap, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth-store"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"

interface DashboardStats {
  documents: number
  consultations: number
  chatSessions: number
  creditBalance: number
}

interface RecentDoc {
  id: string
  title: string
  type: string
  status: string
  createdAt: string
}

const quickActions = [
  { icon: FileText, title: "Generate Document", desc: "Create a new legal document", href: "/dashboard/documents", color: "teal" },
  { icon: MessageSquare, title: "AI Legal Chat", desc: "Ask legal questions", href: "/dashboard/chat", color: "amber" },
  { icon: Users, title: "Find a Lawyer", desc: "Browse verified lawyers", href: "/dashboard/lawyers", color: "teal" },
  { icon: CreditCard, title: "Buy Credits", desc: "Purchase AI chat credits", href: "/dashboard/credits", color: "amber" },
]

export default function DashboardPage() {
  const { user, token } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats>({
    documents: 0,
    consultations: 0,
    chatSessions: 0,
    creditBalance: user?.creditBalance || 0,
  })
  const [recentDocs, setRecentDocs] = useState<RecentDoc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch(`${API_BASE}/users/me/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) {
          setStats(data.data.stats)
          setRecentDocs(data.data.recentDocuments || [])
        }
      } catch {
        // Use defaults
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchDashboard()
    } else {
      setLoading(false)
    }
  }, [token])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!</h1>
        <p className="text-muted-foreground">Here&apos;s an overview of your legal activities.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Documents", value: stats.documents, icon: FileText, trend: "+2 this month" },
          { label: "Credits", value: stats.creditBalance, icon: Zap, trend: user?.creditBalance === 25 ? "Free credits" : "Balance" },
          { label: "Consultations", value: stats.consultations, icon: Calendar, trend: stats.consultations === 0 ? "No bookings yet" : "Active" },
          { label: "AI Chats", value: stats.chatSessions, icon: MessageSquare, trend: stats.chatSessions === 0 ? "Start a conversation" : "Sessions" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-5 w-5 text-teal" />
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold">{loading ? "..." : stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.trend}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="group hover:border-teal/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${action.color === "teal" ? "bg-teal/10" : "bg-amber/10"}`}>
                    <action.icon className={`h-5 w-5 ${action.color === "teal" ? "text-teal" : "text-amber"}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{action.title}</h3>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-teal transition-colors" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Documents */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Documents</h2>
          <Link href="/dashboard/documents">
            <Button variant="ghost" size="sm" className="text-teal text-xs gap-1">View All <ArrowRight className="h-3 w-3" /></Button>
          </Link>
        </div>
        <Card className="border-border/50">
          {recentDocs.length > 0 ? (
            recentDocs.map((doc, i) => (
              <div key={doc.id} className={`flex items-center justify-between p-4 ${i > 0 ? "border-t border-border" : ""}`}>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-teal" />
                  <div>
                    <p className="text-sm font-medium">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(doc.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                  doc.status === "COMPLETED" ? "bg-teal/10 text-teal" :
                  doc.status === "GENERATING" ? "bg-amber/10 text-amber" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {doc.status}
                </span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No documents yet. Generate your first legal document!</p>
              <Link href="/dashboard/documents/generate">
                <Button size="sm" className="mt-3 bg-teal hover:bg-teal-dark text-white">Generate Document</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
