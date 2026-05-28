"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const plans = [
  {
    title: "Document Generation",
    price: "₹499",
    period: "per document",
    features: [
      "Legally vetted templates",
      "Customizable clauses",
      "Multiple export formats",
      "Lifetime access",
    ],
    popular: false,
    color: "teal",
  },
  {
    title: "Lawyer Consultation",
    price: "₹500+",
    period: "per hour",
    features: [
      "Verified lawyers",
      "Video/Audio/Chat",
      "Flexible scheduling",
      "Secure & confidential",
    ],
    popular: true,
    color: "amber",
  },
  {
    title: "AI Legal Chat",
    price: "₹10+",
    period: "prepurchase credits",
    features: [
      "Pay per token",
      "24/7 availability",
      "Instant responses",
      "Context-aware",
    ],
    popular: false,
    color: "teal",
  },
]

export function PricingSection() {
  return (
    <section className="py-20 sm:py-28 relative bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Transparent Pricing</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-teal to-amber mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1 rounded-full bg-amber text-amber-foreground text-xs font-bold shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
              )}
              <Card className={`h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                plan.popular
                  ? "border-amber/50 bg-card shadow-lg scale-105"
                  : "border-border/50 bg-card/50"
              }`}>
                {plan.popular && (
                  <div className="absolute inset-0 bg-gradient-to-br from-amber/5 via-transparent to-teal/5" />
                )}
                <CardHeader className="relative text-center pb-2">
                  <h3 className="text-xl font-bold">{plan.title}</h3>
                  <div className="mt-4">
                    <span className={`text-4xl font-bold ${plan.color === "teal" ? "text-teal" : "text-amber"}`}>
                      {plan.price}
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">{plan.period}</p>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <Check className={`h-4 w-4 shrink-0 ${plan.color === "teal" ? "text-teal" : "text-amber"}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="relative">
                  <Link href="/login" className="w-full">
                    <Button
                      className={`w-full gap-2 ${
                        plan.popular
                          ? "bg-amber hover:bg-amber/90 text-white"
                          : "bg-teal hover:bg-teal-dark text-white"
                      }`}
                    >
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
