"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Scale, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const tickerItems = [
  "NDA Generation",
  "Contract Analysis",
  "Due Diligence",
  "Legal Research",
  "Employment Agreements",
  "Service Agreements",
  "Document Review",
  "Compliance Checks",
  "Fund Formation",
  "Deal Management",
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-ink">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink to-ink-light" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          {/* Main heading — serif */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[72px] font-serif font-normal leading-[1.05] tracking-tight text-ivory mb-8">
            Legal Work,<br />
            <span className="text-ivory/50">Perfected.</span>
          </h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg sm:text-xl text-ivory/50 max-w-xl leading-relaxed mb-10"
          >
            AI-powered legal document automation for Indian businesses. Generate documents, consult lawyers, and get instant legal answers.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start gap-3"
          >
            <Link href="/login">
              <Button className="bg-ivory text-ink font-medium rounded-sm hover:bg-ivory/90 px-7 h-11 text-sm gap-2">
                Request Access <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="border-ivory/20 text-ivory/70 hover:bg-white/[0.04] hover:text-ivory rounded-sm px-7 h-11 text-sm">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats row — large numbers */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-20 pt-10 border-t border-white/[0.06]"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: "5,000+", label: "Documents Generated" },
              { value: "100+", label: "Verified Lawyers" },
              { value: "2,000+", label: "Active Users" },
              { value: "98%", label: "Satisfaction Rate" },
            ].map((stat, i) => (
              <div key={stat.label}>
                <div className="text-3xl sm:text-4xl md:text-5xl font-serif text-ivory mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-ivory/40 tracking-wide uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Ticker / Marquee — scrolling use cases */}
      <div className="relative border-t border-white/[0.06] py-4 bg-ink">
        <div className="ticker-wrapper">
          <div className="ticker-content">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-6 px-4">
                <span className="text-sm text-ivory/30 tracking-wide uppercase whitespace-nowrap">{item}</span>
                <span className="w-1 h-1 rounded-full bg-ivory/10 shrink-0" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
