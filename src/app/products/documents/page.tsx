"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FileText, Check, ArrowRight, ListChecks, Globe, Palette, History, Download, Lock, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const features = [
  { icon: ListChecks, title: "Clause Library", desc: "Pick from a curated library of legally vetted clauses" },
  { icon: Globe, title: "Multi-Jurisdiction", desc: "Supports Indian law and international frameworks" },
  { icon: Palette, title: "Customisable", desc: "Tailor every section to your specific needs" },
  { icon: History, title: "Version History", desc: "Track changes across document revisions" },
  { icon: Download, title: "Multiple Formats", desc: "Export to PDF, DOCX, or Google Docs" },
  { icon: FileText, title: "Instant Generation", desc: "Documents ready in minutes" },
  { icon: Lock, title: "Secure Storage", desc: "All documents encrypted and stored safely" },
  { icon: Scale, title: "Lawyer Review", desc: "Optionally get a lawyer to review your document" },
]

const steps = [
  { num: "1", title: "Select Document Type", desc: "Choose from NDAs, contracts, agreements, and more from our document library." },
  { num: "2", title: "Answer Questions", desc: "Fill in your details through our guided form — party names, terms, clauses, and jurisdiction." },
  { num: "3", title: "AI Generates Draft", desc: "Our AI assembles a professional document using vetted legal templates and your inputs." },
  { num: "4", title: "Download & Use", desc: "Export your finished document as PDF, DOCX, or Google Docs. Lifetime access included." },
]

export default function ProductDocumentsPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal/10 mb-6">
              <FileText className="h-8 w-8 text-teal" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold mb-4">Legal Documents Workflow</h1>
            <p className="text-xl text-muted-foreground">Generate professional legal documents in minutes, not days</p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="text-center p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal to-teal-dark flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">{step.num}</div>
                  <h3 className="font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <motion.div key={feat.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Card className="h-full border-border/50 bg-card/50 hover:border-teal/20 transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-2">
                    <feat.icon className="h-6 w-6 text-teal mb-2" />
                    <h3 className="font-semibold">{feat.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feat.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Pricing</h2>
          <p className="text-muted-foreground mb-8">The Legal Documents Workflow operates on a prepaid, pay-per-document model.</p>
          <div className="p-8 rounded-2xl border border-teal/20 bg-card/50 backdrop-blur-sm">
            <p className="text-4xl font-bold text-teal mb-2">Starting at ₹500</p>
            <p className="text-muted-foreground mb-6">per document</p>
            <ul className="space-y-3 text-left max-w-md mx-auto mb-8">
              {["Purchase credits before generating a document", "Includes all customisations and clause selections", "Export to PDF, DOCX, or Google Docs", "Lifetime access to your generated document", "No subscription required"].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-teal mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/login">
              <Button size="lg" className="bg-teal hover:bg-teal-dark text-white gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
