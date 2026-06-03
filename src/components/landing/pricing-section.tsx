"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const plans = [
  {
    title: "Document Generation",
    price: "₹499",
    period: "per document",
    features: [
      "Legally vetted templates",
      "Customizable clauses",
      "Multiple export formats",
      "Lifetime access",
    ],
    popular: false,
  },
  {
    title: "Lawyer Consultation",
    price: "₹500+",
    period: "per hour",
    features: [
      "Verified lawyers",
      "Video/Audio/Chat",
      "Flexible scheduling",
      "Secure & confidential",
    ],
    popular: true,
  },
  {
    title: "AI Legal Chat",
    price: "₹10+",
    period: "prepurchase credits",
    features: [
      "Pay per token",
      "24/7 availability",
      "Instant responses",
      "Context-aware",
    ],
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section className="py-20 sm:py-28 bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-sm text-ivory/30 tracking-wide uppercase mb-4">Pricing</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-ivory leading-tight">
            Transparent.<br />No surprises.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06]">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 sm:p-10 ${plan.popular ? "bg-ink-light" : "bg-ink"}`}
            >
              {plan.popular && (
                <span className="text-xs text-ivory/40 tracking-wide uppercase mb-4 block">Most Popular</span>
              )}
              <h3 className="text-lg font-serif font-medium text-ivory mb-4">{plan.title}</h3>
              <div className="mb-6">
                <span className="text-4xl sm:text-5xl font-serif text-ivory">{plan.price}</span>
                <p className="text-sm text-ivory/30 mt-1">{plan.period}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-ivory/20" />
                    <span className="text-ivory/50">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/login">
                <Button className={`w-full rounded-sm h-10 text-sm font-medium ${
                  plan.popular
                    ? "bg-ivory text-ink hover:bg-ivory/90"
                    : "border border-ivory/20 text-ivory hover:bg-white/[0.04] bg-transparent"
                }`}>
                  Get Started <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
