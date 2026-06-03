"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Zap, DollarSign } from "lucide-react"

const reasons = [
  {
    icon: ShieldCheck,
    title: "Secure & Compliant",
    items: [
      "End-to-end encryption",
      "GDPR compliant",
      "Data privacy guaranteed",
      "Secure document storage",
    ],
  },
  {
    icon: Zap,
    title: "Fast & Efficient",
    items: [
      "Generate documents in minutes",
      "Instant AI responses",
      "Quick lawyer matching",
      "Streamlined workflows",
    ],
  },
  {
    icon: DollarSign,
    title: "Affordable Pricing",
    items: [
      "Pay per document",
      "No monthly subscriptions",
      "Prepurchase credits",
      "Transparent pricing",
    ],
  },
]

export function WhyChooseSection() {
  return (
    <section className="py-20 sm:py-28 bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-sm text-ivory/30 tracking-wide uppercase mb-4">Why Choose Us</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-ivory leading-tight">
            Built for legal<br />professionals.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06]">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-ink p-8 sm:p-10"
            >
              <reason.icon className="h-6 w-6 text-ivory/40 mb-6" />
              <h3 className="text-xl font-serif font-medium text-ivory mb-6">{reason.title}</h3>
              <ul className="space-y-3">
                {reason.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-3 text-ivory/40 text-sm">
                    <div className="w-1 h-1 rounded-full bg-ivory/20 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
