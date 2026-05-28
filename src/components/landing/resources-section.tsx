"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { BookOpen, ArrowRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

const guides = [
  {
    title: "Understanding NDAs",
    description: "Complete guide to Non-Disclosure Agreements in India, including types, clauses, and enforceability",
    category: "Legal Guides",
    readTime: "8 min read",
  },
  {
    title: "Employment Law Basics",
    description: "Essential guide to hiring employees, labor laws, and compliance requirements for employers",
    category: "Employment Law",
    readTime: "10 min read",
  },
  {
    title: "Startup Legal Checklist",
    description: "Complete legal compliance checklist for startups from incorporation to fundraising",
    category: "Startup Guides",
    readTime: "12 min read",
  },
]

export function ResourcesSection() {
  return (
    <section className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Legal Resources & Guides</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Learn from expert-written guides on legal topics relevant to Indian businesses.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-teal to-amber mx-auto rounded-full mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide, i) => (
            <motion.div
              key={guide.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Link href="/resources" className="block group">
                <div className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-teal/20 hover:bg-card/80 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-0.5 rounded-md bg-teal/10 text-teal text-xs font-medium">
                      {guide.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {guide.readTime}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-teal mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-bold mb-2 group-hover:text-teal transition-colors">{guide.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{guide.description}</p>
                    </div>
                  </div>
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
          <Link href="/resources">
            <Button variant="outline" className="gap-2 border-teal/30 hover:bg-teal/10 hover:text-teal">
              Read All Legal Guides <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
