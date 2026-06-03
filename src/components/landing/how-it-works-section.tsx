"use client"

import { motion } from "framer-motion"
import { UserPlus, LayoutGrid, CreditCard, Download } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Sign Up",
    description: "Create your free account with Google OAuth or phone OTP",
  },
  {
    number: "02",
    icon: LayoutGrid,
    title: "Choose Service",
    description: "Select document generation, lawyer consultation, or AI chat",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Prepurchase Credits",
    description: "Buy credits for AI chat or pay per document/consultation",
  },
  {
    number: "04",
    icon: Download,
    title: "Get Results",
    description: "Download documents, chat with lawyers, or ask AI",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 sm:py-28 bg-ivory-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-sm text-ink/40 tracking-wide uppercase mb-4">How It Works</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-ink leading-tight">
            Simple. Fast.<br />Effective.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ink/10">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-ivory-dark p-8 sm:p-10"
            >
              <span className="text-sm text-ink/20 font-mono mb-6 block">{step.number}</span>
              <step.icon className="h-5 w-5 text-ink/40 mb-4" />
              <h4 className="text-lg font-serif font-medium text-ink mb-2">{step.title}</h4>
              <p className="text-sm text-ink/40 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
