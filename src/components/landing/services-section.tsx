"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FileText, Users, Bot, ArrowRight, Check } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const services = [
  {
    icon: FileText,
    title: "Automated Legal Document Generation",
    description: "Generate professional legal documents tailored to your needs",
    features: [
      "NDAs & Agreements — Comprehensive documents compliant with Indian law",
      "International Contracts — Cross-border agreements for global business",
      "Quick Generation — Create documents in minutes, not hours",
      "Legally Vetted — Templates reviewed by experienced lawyers",
      "Customizable Clauses — Tailor every aspect to your requirements",
      "Multiple Formats — Export to PDF, DOCX, Google Docs",
    ],
    price: "Starting at ₹499 per document",
    color: "teal",
    href: "/products/documents",
  },
  {
    icon: Users,
    title: "Legal Consultation Marketplace",
    description: "Connect with experienced lawyers for expert legal advice",
    features: [
      "Find Specialists — Browse lawyers by expertise and location",
      "Verified Profiles — All lawyers vetted and verified",
      "Direct Consultation — Book video/audio/chat consultations",
      "Flexible Scheduling — Choose time slots that work for you",
      "Transparent Pricing — Clear pricing from ₹500/hour",
      "Reviews & Ratings — Make informed decisions",
      "Confidential — All consultations are private and secure",
    ],
    price: "Browse 100+ verified lawyers across India",
    color: "amber",
    href: "/products/lawyers",
  },
  {
    icon: Bot,
    title: "AI Legal Consultation",
    description: "Get instant answers to your legal questions powered by GPT-4",
    features: [
      "24/7 Availability — Ask legal questions anytime",
      "Instant Responses — Get answers in seconds",
      "Comprehensive Knowledge — Trained on Indian legal frameworks",
      "Focused on Legal Topics — NDAs, contracts, corporate law, compliance",
      "Quick Guidance — Understand legal concepts and requirements",
      "Context-Aware — Maintains conversation history",
      "Cost-Effective — Pay per token with prepurchased credits",
    ],
    price: "Start chatting from ₹10 — Prepurchase credits for best rates",
    color: "teal",
    href: "/products/ai-chat",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function ServicesSection() {
  return (
    <section className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Services</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-teal to-amber mx-auto rounded-full" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={cardVariants}>
              <Card className="h-full tilt-card group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-teal/30 transition-all duration-500">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal/5 via-transparent to-amber/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardHeader className="relative pb-2">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${service.color === "teal" ? "bg-teal/10" : "bg-amber/10"}`}>
                    <service.icon className={`h-6 w-6 ${service.color === "teal" ? "text-teal" : "text-amber"}`} />
                  </div>
                  <h3 className="text-xl font-bold">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </CardHeader>

                <CardContent className="relative">
                  <ul className="space-y-2.5">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className={`h-4 w-4 mt-0.5 shrink-0 ${service.color === "teal" ? "text-teal" : "text-amber"}`} />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="relative flex flex-col items-start gap-4">
                  <p className={`text-sm font-semibold ${service.color === "teal" ? "text-teal" : "text-amber"}`}>
                    {service.price}
                  </p>
                  <Link href={service.href} className="w-full">
                    <Button variant="outline" className="w-full group/btn gap-2 border-teal/30 hover:bg-teal/10 hover:text-teal">
                      Learn More <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
