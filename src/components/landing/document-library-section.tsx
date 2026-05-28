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
    color: "teal",
  },
  {
    icon: Users,
    title: "Employment Documents",
    items: "Employment Agreement, Independent Contractor Agreement, Non-Compete",
    color: "amber",
  },
  {
    icon: Shield,
    title: "Policies & Terms",
    items: "Privacy Policy, Terms of Service, Partnership Agreement",
    color: "teal",
  },
]

export function DocumentLibrarySection() {
  return (
    <section className="py-20 sm:py-28 relative bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Legal Document Library</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Browse our comprehensive library of legal document templates. Each page provides detailed information, key clauses, and FAQs to help you understand your legal needs.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-teal to-amber mx-auto rounded-full mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Link href="/documents" className="block group">
                <div className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-teal/20 hover:bg-card/80 transition-all duration-300 hover:-translate-y-1 text-center">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${cat.color === "teal" ? "bg-teal/10" : "bg-amber/10"}`}>
                    <cat.icon className={`h-7 w-7 ${cat.color === "teal" ? "text-teal" : "text-amber"}`} />
                  </div>
                  <h4 className="font-bold mb-2 group-hover:text-teal transition-colors">{cat.title}</h4>
                  <p className="text-sm text-muted-foreground">{cat.items}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link href="/documents">
            <Button variant="outline" className="gap-2 border-teal/30 hover:bg-teal/10 hover:text-teal">
              Browse All Document Templates <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
