"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FileText, Users, Bot, ArrowRight, Check } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const services = [
  {
    icon: FileText,
    title: "Document Generation",
    description: "Generate professional legal documents tailored to your needs, compliant with Indian law.",
    features: [
      "NDAs & Agreements — Comprehensive documents compliant with Indian law",
      "Quick Generation — Create documents in minutes, not hours",
      "Customizable Clauses — Tailor every aspect to your requirements",
      "Multiple Formats — Export to PDF, DOCX, Google Docs",
    ],
    href: "/products/documents",
  },
  {
    icon: Users,
    title: "Lawyer Consultation",
    description: "Connect with experienced lawyers for expert legal advice across India.",
    features: [
      "Find Specialists — Browse lawyers by expertise and location",
      "Verified Profiles — All lawyers vetted and verified",
      "Direct Consultation — Book video/audio/chat consultations",
      "Transparent Pricing — Clear pricing from ₹500/hour",
    ],
    href: "/products/lawyers",
  },
  {
    icon: Bot,
    title: "AI Legal Chat",
    description: "Get instant answers to your legal questions powered by advanced AI, available 24/7.",
    features: [
      "24/7 Availability — Ask legal questions anytime",
      "Instant Responses — Get answers in seconds",
      "Context-Aware — Maintains conversation history",
      "Cost-Effective — Pay per token with prepurchased credits",
    ],
    href: "/products/ai-chat",
  },
]

export function ServicesSection() {
  return (
    <section className="py-20 sm:py-28 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-sm text-ink/40 tracking-wide uppercase mb-4">Our Services</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-ink leading-tight">
            Everything your legal<br />team needs.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-ink/10">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-ivory p-8 sm:p-10 group"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-sm bg-ink mb-6">
                <service.icon className="h-5 w-5 text-ivory" />
              </div>
              <h3 className="text-xl font-serif font-medium text-ink mb-3">{service.title}</h3>
              <p className="text-sm text-ink/50 mb-6 leading-relaxed">{service.description}</p>
              <ul className="space-y-3 mb-8">
                {service.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 mt-0.5 shrink-0 text-ink/30" />
                    <span className="text-ink/60">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href={service.href}>
                <Button variant="ghost" className="group/btn gap-2 text-ink font-medium hover:bg-ink/[0.04] rounded-none p-0 h-auto">
                  Learn More <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
