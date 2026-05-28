"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Zap, Check, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth-store"
import { useToast } from "@/hooks/use-toast"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"

const creditPackages = [
  { id: "starter", name: "Starter", price: 199, credits: 100, popular: false },
  { id: "standard", name: "Standard", price: 799, credits: 500, popular: true },
  { id: "professional", name: "Professional", price: 1999, credits: 1500, popular: false },
  { id: "enterprise", name: "Enterprise", price: 5999, credits: 5000, popular: false },
]

export default function DashboardCreditsPage() {
  const { user, token, updateCredits } = useAuthStore()
  const { toast } = useToast()
  const [purchasing, setPurchasing] = useState<string | null>(null)

  const handlePurchase = async (pkgId: string) => {
    setPurchasing(pkgId)

    try {
      // Create Razorpay order via API
      const res = await fetch(`${API_BASE}/credits/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ package: pkgId }),
      })
      const data = await res.json()

      if (data.success && data.data?.orderId) {
        // In production: open Razorpay checkout
        // For now: simulate successful payment
        const pkg = creditPackages.find(p => p.id === pkgId)

        // Verify payment (simulated)
        const verifyRes = await fetch(`${API_BASE}/payments/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            razorpayOrderId: data.data.orderId,
            razorpayPaymentId: `pay_sim_${Date.now()}`,
            razorpaySignature: "sim_signature",
          }),
        })
        const verifyData = await verifyRes.json()

        if (verifyData.success) {
          updateCredits(verifyData.data?.creditBalance || (user?.creditBalance || 0) + (pkg?.credits || 0))
          toast({ title: "Credits purchased!", description: `${pkg?.credits} credits added to your account.` })
        } else {
          toast({ title: "Payment simulated", description: `${pkg?.credits} credits would be added. Configure Razorpay keys for real payments.` })
          updateCredits((user?.creditBalance || 0) + (pkg?.credits || 0))
        }
      } else {
        toast({ title: "Payment setup needed", description: "Configure Razorpay API keys to enable payments.", variant: "destructive" })
      }
    } catch {
      toast({ title: "Backend not connected", description: "Start the NestJS API server to enable payments.", variant: "destructive" })
    } finally {
      setPurchasing(null)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Credits</h1>
          <p className="text-muted-foreground">Purchase and manage your credits</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal/10 border border-teal/20">
          <Zap className="h-4 w-4 text-teal" />
          <span className="text-lg font-bold text-teal">{user?.creditBalance ?? 0}</span>
          <span className="text-sm text-muted-foreground">credits</span>
        </div>
      </div>

      {/* How credits work */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">How Credits Work</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-teal mt-0.5" />
              <div><strong>1 credit</strong> per AI chat message</div>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-teal mt-0.5" />
              <div><strong>10 credits</strong> per basic document</div>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-teal mt-0.5" />
              <div><strong>25 credits</strong> per AI-enhanced document</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-4">Credit Packages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {creditPackages.map((pkg, i) => (
            <motion.div key={pkg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className={`text-center h-full ${pkg.popular ? "border-teal/40 shadow-md" : "border-border/50"} hover:border-teal/30 transition-all`}>
                <CardHeader className="pb-1">
                  {pkg.popular && <span className="text-[10px] text-teal font-bold mb-1">BEST VALUE</span>}
                  <h3 className="font-bold">{pkg.name}</h3>
                  <p className="text-3xl font-bold text-teal">₹{pkg.price}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{pkg.credits} credits</p>
                  <p className="text-xs text-muted-foreground">₹{(pkg.price / pkg.credits).toFixed(2)}/credit</p>
                  <Button
                    className={`w-full ${pkg.popular ? "bg-teal hover:bg-teal-dark text-white" : ""}`}
                    variant={pkg.popular ? "default" : "outline"}
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={purchasing === pkg.id}
                  >
                    {purchasing === pkg.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Purchase"}
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
        <span className="flex items-center gap-1"><Check className="h-4 w-4 text-teal" /> Secure Razorpay payments</span>
      </div>
    </div>
  )
}
