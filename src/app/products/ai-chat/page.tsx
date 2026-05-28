"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Bot, Check, ArrowRight, MessageCircle, Brain, Zap, Clock, BookOpen, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const topics = [
  "Contract Law — NDA terms, employment agreements, vendor contracts",
  "Business Law — Company formation, compliance, regulatory questions",
  "Intellectual Property — Trademarks, copyrights, patents basics",
  "Real Estate — Rental agreements, property law, tenant rights",
  "Labour Law — Employment terms, termination, workplace rights",
  "Tax & Finance — GST, TDS, basic tax compliance questions",
  "Consumer Rights — Refunds, warranties, dispute resolution",
  "General Legal — Any legal question you need guidance on",
]

const creditPackages = [
  { name: "Starter", price: "₹10", tokens: "10,000", rate: "₹0.001/token" },
  { name: "Basic", price: "₹50", tokens: "30,000", rate: "₹0.00167/token" },
  { name: "Standard", price: "₹100", tokens: "75,000", rate: "₹0.00133/token" },
  { name: "Professional", price: "₹500", tokens: "500,000", rate: "₹0.001/token" },
  { name: "Enterprise", price: "₹1,000", tokens: "1,200,000", rate: "₹0.00083/token" },
]

export default function ProductAIChatPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal/10 mb-6">
              <Bot className="h-8 w-8 text-teal" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold mb-4">AI Legal Assistant</h1>
            <p className="text-xl text-muted-foreground">Get instant answers to your legal questions, powered by AI</p>
          </motion.div>
        </div>
      </section>

      {/* Your 24/7 Legal Guide */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">Your 24/7 Legal Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: MessageCircle, title: "Ask Anything", desc: "Type your legal question in plain language. The AI understands context and provides relevant, accurate guidance." },
              { icon: Brain, title: "Context-Aware", desc: "The assistant remembers your conversation history and builds on previous answers for deeper, more relevant responses." },
              { icon: Zap, title: "Instant Responses", desc: "No waiting for appointments. Get answers in seconds, any time of day, on any legal topic." },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <div className="text-center p-6 rounded-2xl border border-border/50 bg-card/50">
                  <item.icon className="h-8 w-8 text-teal mx-auto mb-4" />
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Can Ask */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">What You Can Ask About</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {topics.map((topic, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <Check className="h-4 w-4 text-teal mt-0.5 shrink-0" />
                  <span className="text-sm">{topic}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 p-4 rounded-xl bg-amber/5 border border-amber/20 max-w-3xl mx-auto">
            <p className="text-sm text-amber flex items-start gap-2">
              <Shield className="h-4 w-4 mt-0.5 shrink-0" />
              <span>The AI Legal Assistant provides general legal information and guidance. For advice specific to your situation, we recommend consulting a lawyer through our Lawyer Marketplace.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Credit Packages */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-4">Pricing</h2>
          <p className="text-center text-muted-foreground mb-12">The AI Legal Assistant operates on a prepaid, pay-per-token model.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {creditPackages.map((pkg, i) => (
              <motion.div key={pkg.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className={`text-center ${i === 3 ? "border-teal/40 shadow-md" : "border-border/50"}`}>
                  <CardHeader className="pb-1">
                    <h3 className="font-bold text-sm">{pkg.name}</h3>
                    <p className="text-2xl font-bold text-teal">{pkg.price}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{pkg.tokens} tokens</p>
                    <p className="text-xs text-muted-foreground mt-1">{pkg.rate}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8 space-y-3">
            <p className="text-sm text-muted-foreground">Average message cost: ₹0.30 – ₹1.00 (150–500 tokens per message)</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Check className="h-3 w-3 text-teal" /> Credits never expire</span>
              <span className="flex items-center gap-1"><Check className="h-3 w-3 text-teal" /> Balance in dashboard</span>
              <span className="flex items-center gap-1"><Check className="h-3 w-3 text-teal" /> Refundable in 30 days</span>
            </div>
            <Link href="/login">
              <Button size="lg" className="bg-teal hover:bg-teal-dark text-white gap-2 mt-4">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
