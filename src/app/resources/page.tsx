"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { BookOpen, Clock, ArrowRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

const guides = [
  { title: "Employment Law Basics in India: What Every Employer Should Know", category: "Employment Law", readTime: "10 min read", date: "2026-02-01", desc: "Navigate India's complex employment laws with confidence. This guide covers essential labor laws, employee rights, and compliance requirements." },
  { title: "Protecting Your Business Intellectual Property in India", category: "Intellectual Property", readTime: "9 min read", date: "2026-02-20", desc: "Safeguard your business innovations and creative works. This comprehensive guide covers all aspects of intellectual property protection in India." },
  { title: "Complete Legal Checklist for Indian Startups 2026", category: "Startup Guides", readTime: "12 min read", date: "2026-03-01", desc: "Everything a startup founder needs to know about legal compliance in India. From incorporation to fundraising, this checklist covers it all." },
  { title: "Understanding NDAs in India: A Complete Guide for 2026", category: "Legal Guides", readTime: "8 min read", date: "2026-01-15", desc: "Non-Disclosure Agreements are essential for protecting confidential business information. This comprehensive guide covers everything you need to know about NDAs in India." },
]

export default function ResourcesPage() {
  return (
    <div className="pt-20">
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-3xl sm:text-5xl font-bold mb-4">
              <BookOpen className="inline h-8 w-8 sm:h-10 sm:w-10 text-teal mr-2" />
              Legal Resources & Guides
            </h1>
            <p className="text-lg text-muted-foreground">Expert legal guides to help you navigate business law in India</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {guides.map((guide, i) => (
              <motion.div key={guide.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <div className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-teal/20 transition-all duration-300 hover:-translate-y-1 group h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded-md bg-teal/10 text-teal text-xs font-medium">{guide.category}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {guide.readTime}</span>
                  </div>
                  <h3 className="font-bold mb-2 group-hover:text-teal transition-colors">{guide.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">{guide.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3 w-3" /> {guide.date}</span>
                    <Button variant="ghost" size="sm" className="text-teal gap-1 text-xs hover:bg-teal/10">
                      Read More <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
