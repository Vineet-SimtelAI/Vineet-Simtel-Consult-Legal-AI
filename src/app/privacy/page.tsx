'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, ArrowLeft, Lock, Eye, Database, Share2, Cookie, Baby, Scale, Mail, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const sections = [
  {
    icon: Eye,
    title: '1. Introduction',
    content: `Simulate Intelligence Private Limited ("Company," "we," "us," or "our"), operating under the brand name "Consult Legal," is committed to protecting the privacy and personal information of our users. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and related services (collectively, the "Services").`,
    extra: `By accessing or using our Services, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access or use our Services.`
  },
  {
    icon: Database,
    title: '2. Information We Collect',
    subsections: [
      {
        subtitle: '2.1 Personal Information',
        items: [
          'Full name and email address (collected via Google OAuth)',
          'Phone number (optional, provided during consultation booking)',
          'Billing address and payment information (processed securely through Razorpay)',
          'Documents and content you upload or generate on our platform',
          'Communication records with lawyers and support team'
        ]
      },
      {
        subtitle: '2.2 Automatically Collected Information',
        items: [
          'Device information (browser type, operating system, device identifiers)',
          'Log data (IP address, access times, pages viewed, referring URLs)',
          'Cookies and similar tracking technologies (see Section 8)',
          'Usage patterns and interaction data with our Services',
          'Search queries and document generation history'
        ]
      }
    ]
  },
  {
    icon: Eye,
    title: '3. How We Use Your Information',
    items: [
      'Providing, maintaining, and improving our Services',
      'Processing transactions and sending related information including confirmations and invoices',
      'Sending you technical notices, updates, security alerts, and support messages',
      'Responding to your comments, questions, and requests, and providing customer service',
      'Communicating with you about products, services, offers, and events (with your consent)',
      'Monitoring and analyzing trends, usage, and activities in connection with our Services',
      'Detecting, investigating, and preventing fraudulent transactions and other illegal activities',
      'Personalizing and improving your experience on our platform',
      'Facilitating legal consultations between you and verified lawyers on our platform'
    ]
  },
  {
    icon: Share2,
    title: '4. Data Sharing and Disclosure',
    subsections: [
      {
        subtitle: '4.1 Lawyers on Our Platform',
        text: 'When you book a legal consultation, we share your name, contact details, and relevant case information with the assigned lawyer to facilitate the consultation.'
      },
      {
        subtitle: '4.2 Service Providers',
        text: 'We use third-party service providers who perform services on our behalf:',
        items: [
          'Razorpay — Payment processing and secure handling of financial transactions',
          'MinIO — Secure object storage for your generated legal documents',
          'Azure OpenAI — AI-powered legal document generation and chat assistance'
        ]
      },
      {
        subtitle: '4.3 Legal Requirements',
        text: 'We may disclose your information where required by law, court order, or governmental regulation, or if we believe in good faith that disclosure is necessary to protect our rights, your safety, or the safety of others.'
      }
    ]
  },
  {
    icon: Lock,
    title: '5. Data Storage and Security',
    content: `We take the security of your personal information seriously and implement appropriate technical and organizational measures to protect it.`,
    subsections: [
      {
        subtitle: '5.1 Data Storage',
        items: [
          'Generated legal documents are stored securely using MinIO with server-side encryption',
          'User data and platform information are stored in MongoDB with encryption at rest',
          'All data is stored on secure servers located in India',
          'Regular backups are maintained with encrypted storage'
        ]
      },
      {
        subtitle: '5.2 Security Measures',
        items: [
          'SSL/TLS encryption for all data in transit',
          'Encryption at rest for sensitive data stored in our databases',
          'Role-based access controls limiting internal access to personal data',
          'Regular security assessments and vulnerability testing',
          'Secure authentication via Google OAuth 2.0'
        ]
      }
    ],
    disclaimer: 'While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.'
  },
  {
    icon: Shield,
    title: '6. Your Rights',
    items: [
      'Access — You have the right to request copies of your personal information we hold',
      'Correction — You have the right to request correction of any inaccurate or incomplete personal data',
      'Deletion — You have the right to request deletion of your personal information, subject to legal obligations',
      'Export — You have the right to request a portable copy of your data in a commonly used machine-readable format',
      'Opt-Out — You have the right to opt out of marketing communications at any time by updating your preferences or contacting us'
    ],
    note: 'To exercise any of these rights, please contact us at privacy@simtel.ai. We will respond to your request within 30 days.'
  },
  {
    icon: Database,
    title: '7. Data Retention',
    content: `We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Specifically:`,
    items: [
      'Account data is retained for the duration of your account and up to 3 years after account deletion',
      'Transaction records and invoices are retained for 7 years as required by Indian tax laws',
      'Generated documents are retained until you request deletion or close your account',
      'Log data and usage analytics are retained for up to 2 years',
      'Communication records with lawyers are retained for 5 years for dispute resolution purposes'
    ]
  },
  {
    icon: Cookie,
    title: '8. Cookies and Tracking',
    content: `We use cookies and similar tracking technologies to track activity on our Services and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.`,
    items: [
      'Essential Cookies — Required for the basic functioning of our platform (authentication, security)',
      'Analytics Cookies — Help us understand how users interact with our Services (page views, feature usage)',
      'Preference Cookies — Remember your settings and preferences for a personalized experience',
      'You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some features of our Services may not function properly without cookies.'
    ]
  },
  {
    icon: Share2,
    title: '9. Third-Party Services',
    content: `Our Services integrate with and may direct you to third-party services. We are not responsible for the privacy practices of these third parties:`,
    items: [
      "Google OAuth — Used for user authentication. Google's Privacy Policy applies to data collected through Google services.",
      'Azure OpenAI — Powers our AI Legal Assistant and document generation. OpenAI processes prompts as described in their privacy policy, and we configure the service to minimize data retention.',
      'Razorpay — Our payment processing partner. Razorpay collects and processes payment data in compliance with PCI-DSS standards and RBI guidelines.',
      'We encourage you to read the privacy policies of these third-party services before using them.'
    ]
  },
  {
    icon: Baby,
    title: '10. Children\'s Privacy',
    content: `Our Services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18 years of age. If we discover that a child under 18 has provided us with personal information, we will delete such information from our servers immediately. If you are a parent or guardian and believe your child has provided us with personal information, please contact us at privacy@simtel.ai.`
  },
  {
    icon: Scale,
    title: '11. Compliance',
    content: `We comply with applicable data protection and privacy laws, including:`,
    items: [
      'Information Technology Act, 2000 and the IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 — India\'s primary legislation governing data protection and cybersecurity',
      'General Data Protection Regulation (GDPR) — To the extent applicable to our processing of data from EU residents, we ensure compliance with GDPR principles including data minimization, purpose limitation, and user rights',
      'Personal Data Protection Bill (PDPB) — We proactively align our practices with the anticipated PDPB requirements to ensure compliance upon enactment',
      'We regularly review and update our practices to maintain compliance with evolving privacy regulations.'
    ]
  },
  {
    icon: Mail,
    title: '12. Contact Us',
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:`,
    items: [
      'Email: privacy@simtel.ai',
      'Company: Simulate Intelligence Private Limited',
      'Address: Bengaluru, Karnataka, India',
      'CIN: U62099KA2023PTC177253'
    ]
  }
]

export default function PrivacyPage() {
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
                <Shield className="h-6 w-6 text-teal" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold">Privacy Policy</h1>
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
                  {section.content && (
                    <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                  )}

                  {section.extra && (
                    <p className="text-muted-foreground leading-relaxed">{section.extra}</p>
                  )}

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
                          {sub.text && (
                            <p className="text-muted-foreground leading-relaxed">{sub.text}</p>
                          )}
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
