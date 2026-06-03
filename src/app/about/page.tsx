"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Scale, ShieldCheck, Zap, DollarSign, Award, Users, Bot, Globe, Check, ArrowRight, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const stats = [
  { value: "5,000+", label: "NDAs Generated" },
  { value: "100+", label: "Verified Lawyers" },
  { value: "2,000+", label: "Active Users" },
  { value: "98%", label: "Satisfaction Rate" },
]

const values = [
  { icon: ShieldCheck, title: "Transparency", desc: "Clear pricing, no hidden fees" },
  { icon: Lock, title: "Security", desc: "Your data is sacred" },
  { icon: Award, title: "Quality", desc: "Legally vetted, reliable" },
  { icon: Zap, title: "Innovation", desc: "AI-powered efficiency" },
]

const whyUs = [
  { title: "Security First", items: ["Bank-grade encryption", "Secure document storage", "GDPR compliant", "Regular security audits"] },
  { title: "Speed & Efficiency", items: ["Generate documents in 5-10 minutes", "Instant AI responses", "Quick lawyer matching", "Real-time document preview"] },
  { title: "Affordable Pricing", items: ["Pay per document (₹499)", "No monthly subscriptions", "Prepurchase AI credits", "No hidden fees ever"] },
  { title: "Quality Assured", items: ["Templates vetted by lawyers", "Advanced AI-powered assistance", "Regular template updates", "Comprehensive clause library"] },
  { title: "User-Centric", items: ["Intuitive interface", "24/7 email support", "Phone support in business hours", "Regular feature updates"] },
  { title: "Built for India", items: ["Compliant with Indian laws", "Templates for Indian jurisdictions", "GST-compliant invoicing", "India-based data centers"] },
]

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Scale className="h-10 w-10 text-teal" />
              <h1 className="text-3xl sm:text-5xl font-bold">Consult Legal</h1>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-teal mb-6">Transforming Legal Services with AI</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Consult Legal, operated by Simulate Intelligence Private Limited, is a pioneering legal technology company based in Bangalore, India. Founded in 2023, we&apos;re on a mission to make legal services accessible, affordable, and efficient for businesses and individuals across India.</p>
              <p>We combine cutting-edge artificial intelligence with deep legal expertise to automate document generation, facilitate legal consultations, and provide instant legal guidance. Our platform serves thousands of users from startups to established enterprises, helping them navigate the complexities of legal documentation with ease.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-8 rounded-2xl border border-teal/20 bg-card/50">
              <h3 className="text-xl font-bold text-teal mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">To democratize access to legal services by leveraging AI and technology, making professional legal assistance available to everyone at an affordable cost.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-8 rounded-2xl border border-amber/20 bg-card/50">
              <h3 className="text-xl font-bold text-amber mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">To become India&apos;s most trusted legal tech platform, where every business and individual can confidently handle their legal needs without barriers.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal/10 mb-3">
                  <v.icon className="h-6 w-6 text-teal" />
                </div>
                <h3 className="font-bold mb-1">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">Achievements & Milestones</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6 rounded-2xl border border-border/50 bg-card/50">
                <p className="text-3xl font-bold text-teal mb-1">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">Why Choose Consult Legal?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Card className="h-full border-border/50 bg-card/50">
                  <CardHeader><h3 className="font-bold">{item.title}</h3></CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {item.items.map((it) => (
                        <li key={it} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="h-3 w-3 text-teal shrink-0" /> {it}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Our Story</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>Consult Legal was born from a simple observation: legal services in India are expensive, slow, and often inaccessible to those who need them most. Startups wait weeks for legal documents, small businesses struggle with legal costs, and individuals find legal jargon overwhelming.</p>
            <p>We asked ourselves: What if technology could change this?</p>
            <p>In 2023, our founders—combining expertise in artificial intelligence, software engineering, and legal services—set out to build a platform that would make legal services as easy as ordering food online. Starting with legal document generation, we&apos;ve expanded to create a comprehensive legal tech ecosystem.</p>
            <p>Today, we&apos;re proud to serve thousands of users, from solo entrepreneurs to growing startups to established businesses. Every document generated, every consultation booked, and every AI question answered brings us closer to our vision of democratized legal services.</p>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Company Information</h2>
          <div className="p-6 rounded-2xl border border-border/50 bg-card/50 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Legal Name</span><span className="font-medium">Simulate Intelligence Private Limited</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Incorporated</span><span className="font-medium">2023</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Registration</span><span className="font-medium">U62099KA2023PTC177253</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">GST</span><span className="font-medium">29ABLCS4636F2ZY</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span className="font-medium">Bengaluru, Karnataka, India</span></div>
          </div>
          <div className="text-center mt-8">
            <Link href="/login">
              <Button size="lg" className="bg-teal hover:bg-teal-dark text-white gap-2">
                Try Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
