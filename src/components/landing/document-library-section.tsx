"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FileText, Users, Shield, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const categories = [
  {
    icon: FileText,
    title: "Agreements & Contracts",
    items: "NDA, Service Agreement, Vendor Agreement, Consulting Agreement",
  },
  {
    icon: Users,
    title: "Employment Documents",
    items: "Employment Agreement, Independent Contractor Agreement, Non-Compete",
  },
  {
    icon: Shield,
    title: "Policies & Terms",
    items: "Privacy Policy, Terms of Service, Partnership Agreement",
  },
]

export function DocumentLibrarySection() {
  return (
    <section className="py-20 sm:py-28 bg-ivory-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-sm text-ink/40 tracking-wide uppercase mb-4">Document Library</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-ink leading-tight">
            Every template<br />you need.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ink/10">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href="/documents" className="block group bg-ivory-dark p-8 sm:p-10 text-center hover:bg-ivory transition-colors duration-300">
                <cat.icon className="h-5 w-5 text-ink/30 mx-auto mb-4" />
                <h4 className="text-lg font-serif font-medium text-ink mb-2 group-hover:text-ink/70 transition-colors">{cat.title}</h4>
                <p className="text-sm text-ink/40">{cat.items}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10"
        >
          <Link href="/documents">
            <Button variant="ghost" className="gap-2 text-ink font-medium hover:bg-ink/[0.04] rounded-none p-0 h-auto">
              Browse All Templates <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
