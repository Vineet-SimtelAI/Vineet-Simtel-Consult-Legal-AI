"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Clock, Send, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  { q: "How quickly can I generate legal documents?", a: "You can generate a professional legal document in under 10 minutes using our AI-powered platform. Simply select your document type, answer a few guided questions, and your document is ready for download." },
  { q: "What payment methods do you accept?", a: "We accept all major payment methods through Razorpay, including credit/debit cards, UPI (Google Pay, PhonePe, Paytm), net banking, and wallets." },
  { q: "Can I get a refund if I'm not satisfied?", a: "Document generation fees are non-refundable once a document is generated. However, unused AI chat credits can be refunded within 30 days of purchase. Lawyer consultation refunds follow our cancellation policy." },
  { q: "Is my data secure and confidential?", a: "Yes, absolutely. We use end-to-end encryption, GDPR-compliant practices, and secure document storage. Your data is never shared without your consent." },
  { q: "Do you provide customer support?", a: "We offer 24/7 email support with a response within 24 hours, and phone support Monday-Saturday, 10 AM - 6 PM IST." },
  { q: "How does the AI legal assistant work?", a: "Our AI assistant is powered by GPT-4 and trained on Indian legal frameworks. You ask questions in plain language, and it provides context-aware legal guidance in seconds. It maintains conversation history for deeper follow-up questions." },
  { q: "What if I need help from a real lawyer?", a: "You can browse our Lawyer Marketplace to find verified lawyers by expertise, location, and pricing. Book video, audio, or chat consultations directly through the platform." },
  { q: "Can I use this for business or commercial purposes?", a: "Yes! Our documents are designed for business use and comply with Indian laws. Many businesses use ConsultLegal for their ongoing legal documentation needs." },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="pt-20">
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-3xl sm:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground">We&apos;re here to help! Get in touch with us</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
                <p className="text-muted-foreground">Have questions about our services? Need technical support? Want to partner with us? We&apos;d love to hear from you!</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-teal mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Office Address</p>
                    <p className="text-sm text-muted-foreground">Simulate Intelligence Private Limited<br />36 Emami Nest Flat No 302, 8th Main 16th Cross<br />Malleshwaram, Bengaluru 560055, Karnataka, India</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="h-5 w-5 text-teal mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">General: contact@simtel.ai<br />Support: support@simtel.ai<br />Sales: sales@simtel.ai</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="h-5 w-5 text-teal mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">+91 95133 33471</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="h-5 w-5 text-teal mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Hours</p>
                    <p className="text-sm text-muted-foreground">Monday - Saturday, 10:00 AM - 6:00 PM IST</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-2">Send Us a Message</h3>
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name *</Label>
                  <Input id="name" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Your Email *</Label>
                  <Input id="email" type="email" placeholder="john@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="support">Technical Support</SelectItem>
                      <SelectItem value="sales">Sales / Partnerships</SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" placeholder="How can we help you?" rows={4} required />
                </div>
                <Button type="submit" className="w-full bg-teal hover:bg-teal-dark text-white gap-2" disabled={submitted}>
                  {submitted ? "Message Sent!" : <><Send className="h-4 w-4" /> Send Message</>}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border rounded-xl px-4 bg-card/50">
                <AccordionTrigger className="text-left text-sm font-medium hover:text-teal">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  )
}
