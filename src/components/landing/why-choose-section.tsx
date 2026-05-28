"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Zap, DollarSign } from "lucide-react"

const reasons = [
  {
    icon: ShieldCheck,
    title: "Secure & Compliant",
    color: "teal",
    items: [
      "End-to-end encryption",
      "GDPR compliant",
      "Data privacy guaranteed",
      "Secure document storage",
      "Regular security audits",
    ],
  },
  {
    icon: Zap,
    title: "Fast & Efficient",
    color: "amber",
    items: [
      "Generate documents in minutes",
      "Instant AI responses",
      "Quick lawyer matching",
      "Streamlined workflows",
      "Save hours of manual work",
    ],
  },
  {
    icon: DollarSign,
    title: "Affordable Pricing",
    color: "teal",
    items: [
      "Pay per document",
      "No monthly subscriptions",
      "Prepurchase credits",
      "Transparent pricing",
      "No hidden fees",
    ],
  },
]

export function WhyChooseSection() {
  return (
    <section className="py-20 sm:py-28 relative bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose Consult Legal?</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-teal to-amber mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal/5 to-amber/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-teal/20 transition-all duration-300">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 ${reason.color === "teal" ? "bg-teal/10" : "bg-amber/10"}`}>
                  <reason.icon className={`h-7 w-7 ${reason.color === "teal" ? "text-teal" : "text-amber"}`} />
                </div>
                <h3 className="text-xl font-bold mb-4">{reason.title}</h3>
                <ul className="space-y-3">
                  {reason.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3 text-muted-foreground">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${reason.color === "teal" ? "bg-teal" : "bg-amber"}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
