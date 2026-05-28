"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FileText, MessageSquare, Users, CreditCard, ArrowRight, TrendingUp, Zap } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const quickActions = [
  { icon: FileText, title: "Generate Document", desc: "Create a new legal document", href: "/dashboard/documents", color: "teal" },
  { icon: MessageSquare, title: "AI Legal Chat", desc: "Ask legal questions", href: "/dashboard/chat", color: "amber" },
  { icon: Users, title: "Find a Lawyer", desc: "Browse verified lawyers", href: "/dashboard/lawyers", color: "teal" },
  { icon: CreditCard, title: "Buy Credits", desc: "Purchase AI chat credits", href: "/dashboard/credits", color: "amber" },
]

const recentDocs = [
  { name: "Non-Disclosure Agreement", date: "Mar 15, 2026", status: "Completed" },
  { name: "Employment Agreement", date: "Mar 12, 2026", status: "Completed" },
  { name: "Service Agreement", date: "Mar 10, 2026", status: "Draft" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground">Here&apos;s an overview of your legal activities.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Documents", value: "3", icon: FileText, trend: "+2 this month" },
          { label: "Credits", value: "25", icon: Zap, trend: "Free credits" },
          { label: "Consultations", value: "0", icon: Users, trend: "No bookings yet" },
          { label: "AI Chats", value: "0", icon: MessageSquare, trend: "Start a conversation" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-5 w-5 text-teal" />
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
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
          {recentDocs.map((doc, i) => (
            <div key={i} className={`flex items-center justify-between p-4 ${i > 0 ? "border-t border-border" : ""}`}>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-teal" />
                <div>
                  <p className="text-sm font-medium">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.date}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${doc.status === "Completed" ? "bg-teal/10 text-teal" : "bg-amber/10 text-amber"}`}>
                {doc.status}
              </span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
