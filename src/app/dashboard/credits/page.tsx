"use client"

import { motion } from "framer-motion"
import { Zap, Check, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const packages = [
  { name: "Starter", price: 10, tokens: 10000, rate: 0.002, popular: false },
  { name: "Basic", price: 50, tokens: 30000, rate: 0.00167, popular: false },
  { name: "Standard", price: 100, tokens: 75000, rate: 0.00133, popular: true },
  { name: "Professional", price: 500, tokens: 500000, rate: 0.001, popular: false },
  { name: "Enterprise", price: 1000, tokens: 1200000, rate: 0.00083, popular: false },
]

export default function DashboardCreditsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Credits</h1>
          <p className="text-muted-foreground">Purchase and manage your AI chat credits</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal/10 border border-teal/20">
          <Zap className="h-4 w-4 text-teal" />
          <span className="text-lg font-bold text-teal">25</span>
          <span className="text-sm text-muted-foreground">credits</span>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Credit Packages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {packages.map((pkg, i) => (
            <motion.div key={pkg.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className={`text-center h-full ${pkg.popular ? "border-teal/40 shadow-md" : "border-border/50"} hover:border-teal/30 transition-all`}>
                <CardHeader className="pb-1">
                  {pkg.popular && <span className="text-[10px] text-teal font-bold mb-1">BEST VALUE</span>}
                  <h3 className="font-bold">{pkg.name}</h3>
                  <p className="text-3xl font-bold text-teal">₹{pkg.price}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{pkg.tokens.toLocaleString()} tokens</p>
                  <p className="text-xs text-muted-foreground">₹{pkg.rate}/token</p>
                  <Button
                    className={`w-full ${pkg.popular ? "bg-teal hover:bg-teal-dark text-white" : ""}`}
                    variant={pkg.popular ? "default" : "outline"}
                  >
                    Purchase
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-1"><Check className="h-4 w-4 text-teal" /> Credits never expire</span>
        <span className="flex items-center gap-1"><Check className="h-4 w-4 text-teal" /> Refundable in 30 days</span>
        <span className="flex items-center gap-1"><Check className="h-4 w-4 text-teal" /> Avg. ₹0.30-₹1.00/message</span>
      </div>
    </div>
  )
}
