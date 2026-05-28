"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Users, Check, ArrowRight, Search, Shield, Video, Clock, Star, Lock, MapPin, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const features = [
  { icon: Search, title: "Browse & Filter", desc: "Search by expertise, location, language, and pricing" },
  { icon: Video, title: "Book a Consultation", desc: "Choose video, audio, or chat consultation" },
  { icon: Shield, title: "Get Legal Advice", desc: "Meet with your lawyer at the scheduled time" },
]

const whyUs = [
  { icon: Shield, title: "Verified Professionals", desc: "Every lawyer is verified with bar council credentials" },
  { icon: Star, title: "Transparent Profiles", desc: "See qualifications, experience, specialisations, and ratings" },
  { icon: Video, title: "Multiple Consultation Modes", desc: "Video, audio, or chat — your choice" },
  { icon: Check, title: "Document Review", desc: "Get a lawyer to review AI-generated documents" },
  { icon: Clock, title: "Flexible Scheduling", desc: "Book at times that suit you" },
  { icon: Lock, title: "Secure Communication", desc: "All consultations are private and encrypted" },
  { icon: MapPin, title: "Pan-India Coverage", desc: "Lawyers across multiple states and jurisdictions" },
  { icon: DollarSign, title: "Upfront Pricing", desc: "Know exactly what you'll pay before you book" },
]

export default function ProductLawyersPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber/10 mb-6">
              <Users className="h-8 w-8 text-amber" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold mb-4">Lawyer Marketplace</h1>
            <p className="text-xl text-muted-foreground">Connect with verified lawyers for consultations and document reviews</p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">Find the Right Lawyer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feat, i) => (
              <motion.div key={feat.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <div className="text-center p-6 rounded-2xl border border-border/50 bg-card/50">
                  <feat.icon className="h-8 w-8 text-amber mx-auto mb-4" />
                  <h3 className="font-bold mb-2">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Use Our Marketplace */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">Why Use Our Marketplace</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Card className="h-full border-border/50 bg-card/50 hover:border-amber/20 transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-2">
                    <item.icon className="h-6 w-6 text-amber mb-2" />
                    <h3 className="font-semibold">{item.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Pricing</h2>
          <p className="text-muted-foreground mb-8">The Lawyer Marketplace operates on a prepaid, direct-payment model.</p>
          <div className="p-8 rounded-2xl border border-amber/20 bg-card/50 backdrop-blur-sm">
            <p className="text-4xl font-bold text-amber mb-2">Starting at ₹5,000</p>
            <p className="text-muted-foreground mb-6">per consultation</p>
            <ul className="space-y-3 text-left max-w-md mx-auto mb-8">
              {["Pricing is set by individual lawyers", "Different rates for video, audio, or chat", "Payment required at booking time", "Cancellation and refund terms available"].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-amber mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/login">
              <Button size="lg" className="bg-amber hover:bg-amber/90 text-white gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
