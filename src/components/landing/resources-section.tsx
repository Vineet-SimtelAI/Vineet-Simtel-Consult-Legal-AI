"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { BookOpen, ArrowRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

const guides = [
  {
    title: "Understanding NDAs",
    description: "Complete guide to Non-Disclosure Agreements in India",
    category: "Legal Guides",
    readTime: "8 min",
  },
  {
    title: "Employment Law Basics",
    description: "Essential guide to hiring employees and labor laws",
    category: "Employment Law",
    readTime: "10 min",
  },
  {
    title: "Startup Legal Checklist",
    description: "Complete legal compliance checklist for startups",
    category: "Startup Guides",
    readTime: "12 min",
  },
]

export function ResourcesSection() {
  return (
    <section className="py-20 sm:py-28 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-sm text-ink/40 tracking-wide uppercase mb-4">Resources</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-ink leading-tight">
            Legal knowledge,<br />accessible.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ink/10">
          {guides.map((guide, i) => (
            <motion.div
              key={guide.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href="/resources" className="block group bg-ivory p-8 sm:p-10 hover:bg-ivory-dark transition-colors duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs text-ink/30 tracking-wide uppercase">{guide.category}</span>
                  <span className="text-ink/10">·</span>
                  <span className="flex items-center gap-1 text-xs text-ink/30">
                    <Clock className="h-3 w-3" /> {guide.readTime}
                  </span>
                </div>
                <BookOpen className="h-4 w-4 text-ink/20 mb-4" />
                <h4 className="text-lg font-serif font-medium text-ink mb-2 group-hover:text-ink/70 transition-colors">{guide.title}</h4>
                <p className="text-sm text-ink/40 leading-relaxed">{guide.description}</p>
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
          <Link href="/resources">
            <Button variant="ghost" className="gap-2 text-ink font-medium hover:bg-ink/[0.04] rounded-none p-0 h-auto">
              Read All Guides <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
