'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CreditCard, ArrowLeft, IndianRupee, Receipt, Percent, FileText, RotateCcw, AlertCircle, RefreshCw, XCircle, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'

const sections = [
  {
    icon: IndianRupee,
    title: '1. Pricing Structure',
    subsections: [
      {
        subtitle: 'Legal Document Generation',
        price: '₹499 per document',
        items: [
          'Includes one legally vetted template-based document',
          'AI-powered customization based on your inputs',
          'PDF and editable format delivery',
          'Price inclusive of all applicable taxes'
        ]
      },
      {
        subtitle: 'AI Legal Chat Credits',
        price: 'Multiple packages available',
        items: [
          'Credits can be purchased in packages as displayed on the Platform',
          'Each credit allows a set number of AI interactions',
          'Credits do not expire as long as your account is active',
          'Package pricing may vary; current prices are displayed at the time of purchase'
        ]
      },
      {
        subtitle: 'Lawyer Consultation',
        price: 'Starting from ₹500',
        items: [
          'Rates are set by individual lawyers and displayed on their profiles',
          'Minimum consultation fee: ₹500',
          'Duration and scope of consultation are as agreed with the lawyer',
          'Additional charges may apply for follow-up sessions or document review'
        ]
      }
    ]
  },
  {
    icon: CreditCard,
    title: '2. Payment Methods',
    paragraphs: [
      'All payments on Consult Legal are processed securely through Razorpay, our authorized payment gateway partner. We support the following payment methods:'
    ],
    items: [
      'Credit Cards — Visa, Mastercard, American Express, and other major cards',
      'Debit Cards — All major bank debit cards',
      'UPI — Google Pay, PhonePe, Paytm, BHIM UPI, and all bank UPI apps',
      'Net Banking — All major Indian banks including SBI, HDFC, ICICI, Axis, and more',
      'Digital Wallets — Paytm, Amazon Pay, Mobikwik, and Freecharge',
      'International cards are accepted where supported by Razorpay'
    ],
    note: 'All transactions are secured with 256-bit SSL encryption and are PCI-DSS compliant. We do not store your card details on our servers — they are processed directly by Razorpay.'
  },
  {
    icon: Percent,
    title: '3. Taxes',
    paragraphs: [
      'All prices displayed on the Platform include applicable taxes. The following tax details apply to our services:'
    ],
    items: [
      'GST Rate: 18% applicable on all services',
      'GSTIN: 29ABLCS4636F2ZY',
      'GST-compliant invoices are generated for every transaction',
      'The GST component is separately displayed on all invoices',
      'For reverse charge mechanism (RCM) applicability, please contact our billing team',
      'Tax rates are subject to change as per government regulations. Any changes will be reflected in the pricing at the time of transaction'
    ]
  },
  {
    icon: FileText,
    title: '4. Billing and Invoices',
    items: [
      'Invoices are automatically generated upon successful payment and sent to your registered email address',
      'Each invoice includes: company details, GSTIN, service description, amount, GST breakup, and transaction ID',
      'You can access your complete billing history from your account dashboard',
      'For changes to invoice details (such as business name or GSTIN), please contact billing@simtel.ai before the transaction',
      'Invoice corrections can be requested within 30 days of the transaction date',
      'We maintain records of all transactions for 7 years as required by Indian tax laws'
    ]
  },
  {
    icon: RotateCcw,
    title: '5. Refund Policy Summary',
    paragraphs: [
      'Our refund policy varies by service type. Below is a summary. For complete details, please refer to our Refunds Policy page.'
    ],
    items: [
      'Legal Document Generation — No refunds once a document has been generated and delivered',
      'AI Legal Chat Credits — Unused credits are refundable within 30 days of purchase',
      'Lawyer Consultations — Refunds are subject to mutual agreement between the user and the lawyer; cancellation windows apply (see Section 6)',
      'For full refund details and process, visit our Refunds Policy page or contact billing@simtel.ai'
    ]
  },
  {
    icon: AlertCircle,
    title: '6. Lawyer Consultation Cancellation',
    paragraphs: [
      'Cancellation of lawyer consultations is subject to the following refund schedule:'
    ],
    tiers: [
      {
        label: 'More than 24 hours before scheduled time',
        value: '100% refund'
      },
      {
        label: 'Between 12 and 24 hours before scheduled time',
        value: '50% refund'
      },
      {
        label: 'Less than 12 hours before scheduled time',
        value: 'No refund'
      }
    ],
    extra: [
      'Cancellations must be submitted through the Platform or by contacting support',
      'Refunds, where applicable, will be processed within 7-10 business days to the original payment method',
      'No-shows are treated as cancellations with less than 12 hours notice — no refund will be issued',
      'If a lawyer cancels a consultation, a full refund or rescheduling option will be provided',
      'The Company reserves the right to make exceptions to this policy in exceptional circumstances'
    ]
  },
  {
    icon: AlertCircle,
    title: '7. Failed Payments and Duplicate Charges',
    items: [
      'If a payment fails during a transaction, no charge will be applied to your account. You may retry the payment.',
      'In case of a deduction without service delivery (failed payment but amount debited), the amount will be automatically refunded within 5-7 business days by Razorpay.',
      'If you notice a duplicate charge, please contact billing@simtel.ai immediately with the transaction details.',
      'Duplicate charges verified by our team will be refunded within 7-10 business days to the original payment method.',
      'We are not responsible for delays caused by your bank or payment processor in processing refunds.',
      'For any payment discrepancies, please report within 60 days of the transaction date.'
    ]
  },
  {
    icon: XCircle,
    title: '8. Auto-Renewal',
    paragraphs: [
      'Consult Legal does NOT have any auto-renewal or recurring billing features. All purchases on our Platform are one-time transactions:',
    ],
    items: [
      'Legal document generation is a one-time purchase per document',
      'AI Legal Chat Credits are purchased as one-time packages',
      'Lawyer consultations are booked and paid for individually',
      'No subscription models or recurring charges exist on our Platform',
      'You will never be charged automatically without your explicit action and confirmation'
    ]
  },
  {
    icon: Mail,
    title: '9. Contact for Payment Issues',
    paragraphs: [
      'For any payment-related queries, disputes, or assistance, please contact our billing team:'
    ],
    items: [
      'Email: billing@simtel.ai',
      'Response Time: We aim to respond within 24 hours during business days',
      'Please include your transaction ID and registered email address in all correspondence',
      'For urgent payment issues, you may also reach us at info@simtel.ai',
      'Company: Simulate Intelligence Private Limited',
      'Address: Bengaluru, Karnataka, India'
    ]
  }
]

export default function PaymentPage() {
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
                <CreditCard className="h-6 w-6 text-teal" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold">Payment Policy</h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Last Updated: March 11, 2026
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

                  {section.subsections && (
                    <div className="grid gap-4 sm:grid-cols-3">
                      {section.subsections.map((sub, i) => (
                        <Card key={i} className="border-teal/20 bg-card/50">
                          <CardContent className="p-4 space-y-3">
                            <h3 className="font-semibold text-foreground">{sub.subtitle}</h3>
                            <p className="text-lg font-bold text-teal">{sub.price}</p>
                            <ul className="space-y-1.5">
                              {sub.items.map((item, j) => (
                                <li key={j} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                  <span className="w-1 h-1 rounded-full bg-amber shrink-0 mt-1.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {section.tiers && (
                    <div className="space-y-3">
                      {section.tiers.map((tier, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50"
                        >
                          <span className="text-muted-foreground text-sm">{tier.label}</span>
                          <span className={`font-semibold text-sm ${tier.value === 'No refund' ? 'text-red-400' : tier.value === '50% refund' ? 'text-amber' : 'text-teal'}`}>
                            {tier.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.extra && (
                    <ul className="space-y-2 mt-4">
                      {section.extra.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber shrink-0 mt-2" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
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
