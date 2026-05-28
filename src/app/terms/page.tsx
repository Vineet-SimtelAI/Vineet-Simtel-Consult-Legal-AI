'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FileText, ArrowLeft, Scale, UserCheck, CreditCard, Brain, Shield, AlertTriangle, Gavel, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const sections = [
  {
    icon: Scale,
    title: '1. Agreement to Terms',
    paragraphs: [
      'By accessing or using the Consult Legal platform ("Platform"), operated by Simulate Intelligence Private Limited ("Company," "we," "us," or "our"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, you may not access or use our Platform.',
      'We reserve the right to modify these Terms at any time. We will notify users of material changes via email or a notice on our Platform. Your continued use of the Platform after such modifications constitutes your acceptance of the updated Terms.',
      'These Terms constitute a legally binding agreement between you and Simulate Intelligence Private Limited, CIN: U62099KA2023PTC177253.'
    ]
  },
  {
    icon: FileText,
    title: '2. Description of Service',
    paragraphs: [
      'Consult Legal provides the following services through our Platform:'
    ],
    items: [
      'Legal Document Generation Service — AI-powered creation of legal documents including NDAs, Employment Agreements, Service Agreements, Lease Agreements, and more, based on user-provided information and templates vetted by legal professionals.',
      'Legal Consultation Marketplace — A platform connecting users with verified, independent lawyers for legal consultations. We facilitate scheduling and payment but do not provide legal advice directly.',
      'AI Legal Assistant — An AI-powered chatbot using GPT-4 technology to provide general legal information, answer legal queries, and assist with legal research. This service does not constitute legal advice.'
    ]
  },
  {
    icon: UserCheck,
    title: '3. Eligibility',
    paragraphs: [
      'You must be at least 18 years of age to use our Platform. By using our Services, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into a binding agreement.',
      'You must not be barred from using the Services under applicable law. If you are using the Platform on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.'
    ]
  },
  {
    icon: UserCheck,
    title: '4. Account Registration',
    paragraphs: [
      'To access certain features of our Platform, you must create an account. We use Google OAuth for authentication, meaning you can sign in using your Google account.',
      'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.',
      'You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.',
      'We reserve the right to suspend or terminate your account if any information provided proves to be inaccurate, not current, or incomplete.'
    ]
  },
  {
    icon: Scale,
    title: '5. Service Usage',
    subsections: [
      {
        subtitle: '5.1 Permitted Use',
        items: [
          'Use the Platform solely for lawful purposes and in accordance with these Terms',
          'Provide accurate and truthful information when generating legal documents',
          'Respect the intellectual property rights of the Company and other users',
          'Use AI-generated content as a starting point and seek professional legal review when appropriate',
          'Maintain the confidentiality of your account credentials'
        ]
      },
      {
        subtitle: '5.2 Prohibited Use',
        items: [
          'Using the Platform for any illegal or unauthorized purpose',
          'Generating documents intended for fraudulent, deceptive, or unlawful activities',
          'Attempting to reverse engineer, decompile, or disassemble any part of the Platform',
          'Using automated tools (bots, scrapers) to access the Platform without authorization',
          'Impersonating any person or entity or misrepresenting your affiliation',
          'Interfering with or disrupting the Platform\'s servers or networks',
          'Sharing your account credentials with third parties',
          'Using the Platform to harass, abuse, or harm others'
        ]
      }
    ]
  },
  {
    icon: FileText,
    title: '6. Legal Document Generation Service',
    paragraphs: [
      'Our Legal Document Generation Service uses AI technology to create legal documents based on the information you provide. By using this service, you acknowledge and agree to the following:'
    ],
    items: [
      'Documents generated through our Platform are based on templates and AI-generated content. They are not a substitute for professional legal advice.',
      'While we strive for accuracy, we do not guarantee that generated documents will be suitable for your specific legal situation or comply with all applicable laws.',
      'You are solely responsible for reviewing, modifying, and validating any generated document before use.',
      'We strongly recommend consulting with a qualified legal professional before executing or relying on any generated document.',
      'The Company shall not be liable for any losses, damages, or legal consequences arising from the use of documents generated on our Platform.',
      'Document templates are periodically updated to reflect changes in law, but there may be delays in updating. You are responsible for verifying current legal requirements.'
    ]
  },
  {
    icon: Scale,
    title: '7. Legal Consultation Marketplace',
    paragraphs: [
      'Our Platform includes a marketplace that connects users with independent, verified lawyers for legal consultations. Important disclaimers:'
    ],
    items: [
      'Lawyers on our Platform are independent professionals and not employees, agents, or representatives of the Company.',
      'We facilitate the connection between users and lawyers, including scheduling, communication, and payment processing, but we do not provide legal advice or services directly.',
      'The quality, accuracy, and outcome of any legal consultation are the sole responsibility of the consulting lawyer.',
      'We verify lawyer credentials (bar registration, experience) but do not guarantee the results of any consultation.',
      'Any disputes between you and a consulting lawyer are between you and that lawyer. The Company is not a party to the lawyer-client relationship.',
      'We reserve the right to remove lawyers from our Platform who violate our quality standards or professional conduct requirements.'
    ]
  },
  {
    icon: Brain,
    title: '8. AI Legal Assistant',
    paragraphs: [
      'Our AI Legal Assistant is powered by GPT-4 technology provided through Azure OpenAI. By using this service, you acknowledge:'
    ],
    items: [
      'The AI Legal Assistant provides general legal information and guidance only. It does not constitute legal advice and should not be relied upon as such.',
      'AI-generated responses may contain inaccuracies, errors, or omissions. You should always verify information with a qualified legal professional.',
      'The AI assistant should not be used as a substitute for professional legal counsel for any legal matter.',
      'We do not guarantee the accuracy, completeness, or reliability of AI-generated responses.',
      'Conversations with the AI assistant are processed by Azure OpenAI and may be used to improve the service. We configure the service to minimize data retention.',
      'You should not share confidential or sensitive personal information with the AI assistant.',
      'The Company is not liable for any decisions made or actions taken based on AI-generated responses.'
    ]
  },
  {
    icon: CreditCard,
    title: '9. Payment Terms',
    subsections: [
      {
        subtitle: '9.1 Pricing',
        items: [
          'Legal Document Generation: ₹499 per document (inclusive of applicable taxes)',
          'AI Legal Chat Credits: Purchased in packages as displayed on the Platform at the time of purchase',
          'Lawyer Consultations: Rates as set by individual lawyers and displayed on their profiles (minimum ₹500 per consultation)'
        ]
      },
      {
        subtitle: '9.2 Payment Processing',
        items: [
          'All payments are processed securely through Razorpay, our authorized payment gateway partner.',
          'We accept credit cards, debit cards, UPI, net banking, and popular digital wallets.',
          'Prices are displayed in Indian Rupees (INR) and include applicable GST (18%).',
          'Payment must be made in full before accessing the respective service.'
        ]
      },
      {
        subtitle: '9.3 Invoicing',
        items: [
          'GST-compliant invoices will be generated automatically for all transactions.',
          'Invoices will be sent to your registered email address.',
          'GSTIN: 29ABLCS4636F2ZY'
        ]
      }
    ]
  },
  {
    icon: Shield,
    title: '10. Intellectual Property',
    paragraphs: [
      'The Platform and its entire contents, features, and functionality — including but not limited to all information, software, source code, text, displays, images, video, audio, design, presentation, selection, and arrangement — are owned by the Company, its licensors, or other providers of such material and are protected by Indian and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.',
      'Documents generated using our Platform are owned by you, the user. However, the underlying templates, clause libraries, and document structures remain the intellectual property of the Company.',
      'You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any materials from our Platform without our prior written consent, except as permitted by these Terms.'
    ]
  },
  {
    icon: Shield,
    title: '11. Data and Privacy',
    paragraphs: [
      'Your use of our Platform is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our data practices.',
      'By using our Services, you consent to the collection and use of your information as described in our Privacy Policy.'
    ]
  },
  {
    icon: AlertTriangle,
    title: '12. Limitation of Liability',
    paragraphs: [
      'To the maximum extent permitted by applicable law, the Company shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses, resulting from:',
    ],
    items: [
      'Your access to or use of (or inability to access or use) the Platform',
      'Any conduct or content of any third party on the Platform, including lawyers',
      'Any content obtained from the Platform, including AI-generated legal documents or advice',
      'Unauthorized access, use, or alteration of your transmissions or content',
      'Errors, inaccuracies, or omissions in AI-generated content or legal documents',
      'The outcome of any legal matter or consultation facilitated through the Platform'
    ],
    disclaimer: 'In no event shall the Company\'s total liability exceed the amount you paid to the Company in the twelve (12) months preceding the claim. This limitation applies regardless of the legal theory on which the claim is based.'
  },
  {
    icon: Gavel,
    title: '13. Term and Termination',
    paragraphs: [
      'These Terms remain in effect until terminated by either party. You may terminate your account at any time by contacting us or ceasing to use the Platform.',
      'We may suspend or terminate your account and access to the Platform at our sole discretion, without notice, for conduct that we determine violates these Terms, is harmful to other users or the Platform, or for any other reason we deem appropriate.',
      'Upon termination, your right to use the Platform will immediately cease. Provisions of these Terms that by their nature should survive termination shall survive, including without limitation ownership provisions, warranty disclaimers, indemnification clauses, and limitations of liability.',
      'We reserve the right to discontinue any part of the Platform at any time with reasonable notice.'
    ]
  },
  {
    icon: Gavel,
    title: '14. Dispute Resolution',
    paragraphs: [
      'Any disputes arising out of or in connection with these Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.',
      'You agree to first attempt to resolve any dispute informally by contacting us. If the dispute is not resolved within 30 days, either party may pursue legal action.',
      'All disputes shall be subject to the exclusive jurisdiction of the courts of Bangalore, Karnataka, India.',
      'Any arbitration proceedings shall be conducted in accordance with the Arbitration and Conciliation Act, 1996, and shall take place in Bangalore, India.'
    ]
  },
  {
    icon: FileText,
    title: '15. Miscellaneous',
    items: [
      'Entire Agreement — These Terms, together with the Privacy Policy and any other agreements expressly incorporated by reference, constitute the entire agreement between you and the Company regarding the use of the Platform.',
      'Severability — If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish its objectives to the greatest extent possible under applicable law, and the remaining provisions will continue in full force and effect.',
      'Waiver — The failure of the Company to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision.',
      'Assignment — You may not assign or transfer these Terms or your rights hereunder, in whole or in part, without our prior written consent. We may assign our rights and obligations without restriction.',
      'Force Majeure — The Company shall not be liable for any failure to perform its obligations where such failure results from circumstances beyond our reasonable control.',
      'No Agency — Nothing in these Terms creates any agency, partnership, joint venture, or employment relationship between you and the Company.'
    ]
  },
  {
    icon: Mail,
    title: '16. Contact Information',
    paragraphs: [
      'If you have any questions or concerns about these Terms and Conditions, please contact us:'
    ],
    items: [
      'Email: info@simtel.ai',
      'Company: Simulate Intelligence Private Limited',
      'CIN: U62099KA2023PTC177253',
      'Address: Bengaluru, Karnataka, India'
    ]
  }
]

export default function TermsPage() {
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
                <FileText className="h-6 w-6 text-teal" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold">Terms &amp; Conditions</h1>
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
                transition={{ duration: 0.5, delay: index * 0.04 }}
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
                    <div className="space-y-4">
                      {section.subsections.map((sub, i) => (
                        <div key={i} className="space-y-2">
                          <h3 className="font-semibold text-foreground">{sub.subtitle}</h3>
                          {sub.items && (
                            <ul className="space-y-2 ml-2">
                              {sub.items.map((item, j) => (
                                <li key={j} className="flex items-start gap-2 text-muted-foreground">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber shrink-0 mt-2" />
                                  <span className="leading-relaxed">{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {section.disclaimer && (
                    <p className="text-sm text-amber italic bg-amber/5 p-3 rounded-lg border border-amber/20">
                      {section.disclaimer}
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
