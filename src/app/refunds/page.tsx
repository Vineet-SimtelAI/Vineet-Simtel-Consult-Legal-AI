'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { RotateCcw, ArrowLeft, Scale, FileText, Bot, MessageSquare, Gavel, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'

const sections = [
  {
    icon: RotateCcw,
    title: '1. General Policy',
    paragraphs: [
      'At Consult Legal, operated by Simulate Intelligence Private Limited, we strive to provide high-quality legal technology services. However, given the nature of our digital services, our refund policy is structured as follows:',
    ],
    items: [
      'Refunds are not provided by default for any of our services unless explicitly stated in this policy.',
      'Each service category has specific refund eligibility criteria outlined in the sections below.',
      'All refund requests must be submitted in writing to billing@simtel.ai.',
      'Refund requests are reviewed on a case-by-case basis and are subject to the terms outlined in this policy.',
      'We reserve the right to update this Refunds Policy at any time. Changes will be effective upon posting on our Platform.'
    ],
    highlight: 'By purchasing any service on Consult Legal, you acknowledge and agree to the terms of this Refunds Policy.'
  },
  {
    icon: Scale,
    title: '2. Lawyer Consultation Refunds',
    paragraphs: [
      'Lawyer consultations booked through our Platform are subject to the following refund terms:'
    ],
    items: [
      'Refunds for lawyer consultations require mutual agreement between the user and the consulting lawyer.',
      'The Platform facilitates communication between the user and lawyer regarding refund requests, but the final decision rests with the consulting lawyer.',
      'If a lawyer fails to attend a scheduled consultation without prior notice, a full refund will be issued.',
      'If a user wishes to cancel a consultation, the cancellation policy from our Payment Policy applies:',
    ],
    tiers: [
      { label: 'Cancellation > 24 hours before', value: '100% refund', color: 'text-teal' },
      { label: 'Cancellation 12-24 hours before', value: '50% refund', color: 'text-amber' },
      { label: 'Cancellation < 12 hours before', value: 'No refund', color: 'text-red-400' },
    ],
    extra: [
      'Partial refunds may be considered if the consultation did not cover the agreed-upon scope, subject to review by our support team.',
      'Refund disputes between a user and a lawyer will be mediated by Consult Legal, but our decision is final and binding.',
      'No refunds are provided for consultations that have been completed, regardless of user satisfaction with the legal advice received.'
    ]
  },
  {
    icon: FileText,
    title: '3. Legal Document Generation Refunds',
    paragraphs: [
      'Legal documents generated through our Platform are digital products created based on user-provided information. The following refund terms apply:'
    ],
    items: [
      'No refunds are provided once a legal document has been generated and delivered to the user.',
      'The document generation process includes real-time preview and editing capabilities, allowing users to review and modify content before final generation.',
      'If a document fails to generate due to a technical error on our end, you will be entitled to either a re-generation at no additional cost or a full refund.',
      'If you encounter issues with the content or format of a generated document, please contact our support team. We will work with you to resolve the issue, which may include document corrections at no additional charge.',
      'Quality concerns about the legal accuracy of a generated document do not constitute grounds for a refund, as our documents are provided as templates and are not a substitute for professional legal review.',
      'No refunds are provided for user errors in inputting information during the document generation process.'
    ],
    disclaimer: 'We strongly recommend reviewing all generated documents with a qualified legal professional before use. Consult Legal does not guarantee the legal sufficiency of any generated document for your specific situation.'
  },
  {
    icon: Bot,
    title: '4. AI Legal Chat Credits Refunds',
    paragraphs: [
      'AI Legal Chat Credits are a prepaid service with the following refund terms:'
    ],
    items: [
      'Unused AI credits are eligible for a refund within 30 days of the original purchase date.',
      'The refund amount will be calculated based on the per-credit price of the purchased package, multiplied by the number of unused credits.',
      'Credits that have been partially used are not eligible for a partial refund of the used portion.',
      'To request a refund for unused credits, you must contact billing@simtel.ai with your account details and purchase receipt.',
      'Refunds for unused credits will be processed within 7-10 business days to the original payment method.',
      'Credits that have expired due to account deactivation or Terms of Service violations are not eligible for a refund.',
      'No refunds are provided for credits purchased more than 30 days ago, regardless of usage status.'
    ]
  },
  {
    icon: MessageSquare,
    title: '5. How to Request a Refund',
    paragraphs: [
      'To request a refund, please follow these steps:'
    ],
    steps: [
      { step: '1', text: 'Send an email to billing@simtel.ai with the subject line "Refund Request — [Your Registered Email]"' },
      { step: '2', text: 'Include the following details: your registered email address, transaction ID (from your invoice), service type, reason for refund request, and the date of purchase' },
      { step: '3', text: 'Our billing team will review your request and respond within 3-5 business days' },
      { step: '4', text: 'If your refund is approved, it will be processed within 7-10 business days to the original payment method' },
      { step: '5', text: 'You will receive an email confirmation once the refund has been initiated' },
    ],
    note: 'Incomplete refund requests may delay processing. Please ensure all required information is provided. We may request additional information to verify your identity and transaction details.'
  },
  {
    icon: Gavel,
    title: '6. Dispute Resolution',
    paragraphs: [
      'If you disagree with a refund decision, you may escalate the matter as follows:'
    ],
    items: [
      'Submit a written appeal to info@simtel.ai within 15 days of receiving the refund decision, including any additional supporting documentation.',
      'Our management team will review the appeal and provide a final decision within 10 business days.',
      'All disputes arising from or related to this Refunds Policy shall be governed by the laws of India, specifically the State of Karnataka.',
      'Any legal proceedings shall be subject to the exclusive jurisdiction of the courts of Bangalore, Karnataka, India.',
      'In the event of arbitration, proceedings shall be conducted in accordance with the Arbitration and Conciliation Act, 1996, and shall take place in Bangalore, India.',
      'Nothing in this policy limits your statutory rights as a consumer under applicable Indian law.'
    ]
  },
  {
    icon: Mail,
    title: '7. Contact Us',
    paragraphs: [
      'For any questions or concerns about our Refunds Policy, please contact us:'
    ],
    contactCards: [
      { icon: Mail, label: 'Email', value: 'info@simtel.ai', sublabel: 'General inquiries' },
      { icon: Phone, label: 'Phone', value: '+91 95133 33471', sublabel: 'Mon-Fri, 10am-6pm IST' },
      { icon: MapPin, label: 'Address', value: 'Bengaluru, Karnataka, India', sublabel: 'Simulate Intelligence Pvt. Ltd.' },
    ]
  }
]

export default function RefundsPage() {
  return (
    <div className="pt-20">
      <section className="py-12 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal/10">
                <RotateCcw className="h-6 w-6 text-teal" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold">Refunds Policy</h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Last Updated: March 16, 2026
            </p>
            <Separator className="mt-6" />
          </motion.div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-teal/10 shrink-0 mt-0.5">
                    <section.icon className="h-4 w-4 text-teal" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-teal">{section.title}</h2>
                </div>

                <div className="pl-11 space-y-4">
                  {section.paragraphs && section.paragraphs.map((p, i) => (
                    <p key={i} className="text-muted-foreground leading-relaxed">{p}</p>
                  ))}

                  {section.items && (
                    <ul className="space-y-2">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0 mt-2" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.tiers && (
                    <div className="space-y-2 ml-2">
                      {section.tiers.map((tier, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50"
                        >
                          <span className="text-muted-foreground text-sm">{tier.label}</span>
                          <span className={`font-semibold text-sm ${tier.color}`}>
                            {tier.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.extra && (
                    <ul className="space-y-2 mt-2">
                      {section.extra.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber shrink-0 mt-2" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.steps && (
                    <div className="space-y-3">
                      {section.steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-teal/10 text-teal font-bold text-sm shrink-0">
                            {step.step}
                          </div>
                          <p className="text-muted-foreground leading-relaxed pt-0.5">{step.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.contactCards && (
                    <div className="grid gap-3 sm:grid-cols-3">
                      {section.contactCards.map((card, i) => (
                        <Card key={i} className="border-teal/20 bg-card/50">
                          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-teal/10">
                              <card.icon className="h-5 w-5 text-teal" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">{card.label}</p>
                              <p className="font-semibold text-sm text-foreground">{card.value}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{card.sublabel}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {section.highlight && (
                    <p className="text-sm text-amber italic bg-amber/5 p-3 rounded-lg border border-amber/20">
                      {section.highlight}
                    </p>
                  )}

                  {section.disclaimer && (
                    <p className="text-sm text-amber italic bg-amber/5 p-3 rounded-lg border border-amber/20">
                      {section.disclaimer}
                    </p>
                  )}

                  {section.note && (
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      {section.note}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center"
          >
            <Separator className="mb-8" />
            <Link href="/">
              <Button variant="outline" className="gap-2 border-teal/30 text-teal hover:bg-teal/10">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
