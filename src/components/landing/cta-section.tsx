"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-20 sm:py-28 bg-ink relative overflow-hidden">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-ivory leading-tight">
            Ready to get started?
          </h2>
          <p className="text-lg text-ivory/40 max-w-lg mx-auto">
            Join hundreds of businesses automating their legal workflows.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/login">
              <Button className="bg-ivory text-ink font-medium rounded-sm hover:bg-ivory/90 px-7 h-11 text-sm gap-2">
                Create Free Account <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <p className="text-sm text-ivory/25">
            25 FREE credits — No credit card required
          </p>
        </motion.div>

        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-8">
          {[
            "5,000+ NDAs Generated",
            "100+ Verified Lawyers",
            "98% Satisfaction Rate",
            "ISO 27001 Compliant",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-ivory/20" />
              <span className="text-sm text-ivory/30">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
