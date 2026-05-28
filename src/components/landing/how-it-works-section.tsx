"use client"

import { motion } from "framer-motion"
import { UserPlus, LayoutGrid, CreditCard, Download } from "lucide-react"

const steps = [
  {
    number: "1",
    icon: UserPlus,
    title: "Sign Up",
    description: "Create your free account with Google OAuth",
    color: "from-teal to-teal-dark",
  },
  {
    number: "2",
    icon: LayoutGrid,
    title: "Choose Service",
    description: "Select document generation, lawyer consultation, or AI chat",
    color: "from-amber to-amber/80",
  },
  {
    number: "3",
    icon: CreditCard,
    title: "Prepurchase Credits",
    description: "Buy credits for AI chat or pay per document/consultation",
    color: "from-teal to-teal-dark",
  },
  {
    number: "4",
    icon: Download,
    title: "Get Results",
    description: "Download documents, chat with lawyers, or ask AI",
    color: "from-amber to-amber/80",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-teal to-amber mx-auto rounded-full" />
        </motion.div>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-24 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-teal/30 via-amber/30 to-teal/30" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step number badge */}
                <div className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <step.icon className="h-7 w-7 text-white" />
                </div>

                {/* Step number */}
                <div className="absolute top-0 right-1/2 translate-x-12 -translate-y-1 w-6 h-6 rounded-full bg-background border-2 border-teal flex items-center justify-center">
                  <span className="text-xs font-bold text-teal">{step.number}</span>
                </div>

                <h4 className="text-lg font-bold mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground max-w-[200px]">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
