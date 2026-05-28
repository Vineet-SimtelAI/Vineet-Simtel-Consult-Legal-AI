"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { FileText, Search, Check, ArrowRight, Zap, Scale, Shield, Clock, Lock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const documents = [
  { title: "Non-Disclosure Agreement", desc: "Free NDA template India. Generate legally valid Non-Disclosure Agreement online with AI. Protect confidential information.", category: "Agreements" },
  { title: "Employment Agreement", desc: "Free employment contract template India. Generate legally valid employment agreement online. Define roles, salary, benefits.", category: "Employment" },
  { title: "Service Agreement", desc: "Free service agreement template India. Generate service contract online for consulting, IT services, and agencies.", category: "Agreements" },
  { title: "Vendor / Supplier Agreement", desc: "Free vendor agreement template India. Generate supplier contract online. Define terms for supplying goods and services.", category: "Agreements" },
  { title: "Consulting Agreement", desc: "Free consulting agreement template India. Generate consultant contract online for advisors and freelancers.", category: "Agreements" },
  { title: "Partnership Agreement", desc: "Free partnership agreement template India. Generate business partnership contract online. Define responsibilities and profits.", category: "Agreements" },
  { title: "Independent Contractor Agreement", desc: "Free independent contractor agreement template India. Generate freelancer contract online. Define terms for contractors.", category: "Employment" },
  { title: "Privacy Policy", desc: "Free privacy policy template India. Generate GDPR-compliant privacy policy for websites and apps.", category: "Policies" },
  { title: "Terms of Service / Terms and Conditions", desc: "Free terms of service template India. Generate terms and conditions for websites, platforms, and services.", category: "Policies" },
  { title: "Non-Compete / Non-Solicitation Agreement", desc: "Free non-compete agreement template India. Generate non-solicitation contract online. Restrict competitive activities.", category: "Employment" },
]

const whyUs = [
  { icon: Zap, title: "AI-Powered", desc: "Advanced AI generates legally sound documents tailored to your needs" },
  { icon: Scale, title: "Lawyer Review", desc: "Optional expert review by qualified lawyers" },
  { icon: Shield, title: "Legally Valid", desc: "All templates comply with Indian laws and regulations" },
  { icon: Clock, title: "Fast & Easy", desc: "Generate professional documents in minutes" },
  { icon: Lock, title: "Secure", desc: "Bank-grade security with encrypted storage" },
  { icon: DollarSign, title: "Affordable", desc: "Fraction of the cost of traditional legal services" },
]

export default function DocumentsPage() {
  const [search, setSearch] = useState("")
  const filtered = documents.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.desc.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="pt-20">
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl sm:text-5xl font-bold mb-4">
              <FileText className="inline h-8 w-8 sm:h-10 sm:w-10 text-teal mr-2" />
              Legal Document Library
            </h1>
            <p className="text-lg text-muted-foreground">Free legal document templates for India. Generate professional contracts and agreements online with AI.</p>
          </motion.div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Document grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((doc, i) => (
              <motion.div key={doc.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="h-full border-border/50 bg-card/50 hover:border-teal/20 transition-all duration-300 hover:-translate-y-1 group">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded-md bg-teal/10 text-teal text-xs font-medium">{doc.category}</span>
                      <FileText className="h-5 w-5 text-teal/50" />
                    </div>
                    <h3 className="font-bold text-sm group-hover:text-teal transition-colors">{doc.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{doc.desc}</p>
                    <Link href="/login">
                      <Button variant="outline" size="sm" className="w-full gap-1 text-xs border-teal/30 hover:bg-teal/10 hover:text-teal">
                        Learn More <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Use ConsultLegal */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">Why Use ConsultLegal?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-card/50 transition-colors">
                  <item.icon className="h-6 w-6 text-teal shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
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
