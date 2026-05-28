"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FileText, Plus, Download, Eye, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const documentTypes = [
  { name: "Non-Disclosure Agreement", desc: "Protect confidential information", popular: true },
  { name: "Employment Agreement", desc: "Define employment terms and conditions", popular: true },
  { name: "Service Agreement", desc: "Contract for services between parties", popular: false },
  { name: "Vendor Agreement", desc: "Terms for vendor/supplier relationships", popular: false },
  { name: "Consulting Agreement", desc: "Contract for consulting services", popular: false },
  { name: "Partnership Agreement", desc: "Define partnership terms and responsibilities", popular: false },
  { name: "Independent Contractor", desc: "Terms for freelancer/contractor engagement", popular: false },
  { name: "Privacy Policy", desc: "GDPR-compliant privacy policy for platforms", popular: false },
  { name: "Terms of Service", desc: "Terms and conditions for websites/apps", popular: false },
  { name: "Non-Compete Agreement", desc: "Restrict competitive activities", popular: false },
]

export default function DashboardDocumentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Generate and manage your legal documents</p>
        </div>
        <Link href="/dashboard/documents/generate">
          <Button className="bg-teal hover:bg-teal-dark text-white gap-2">
            <Plus className="h-4 w-4" /> Generate New
          </Button>
        </Link>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Available Document Types</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documentTypes.map((doc, i) => (
            <motion.div key={doc.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="group hover:border-teal/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-teal/10 shrink-0">
                    <FileText className="h-5 w-5 text-teal" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm truncate">{doc.name}</h3>
                      {doc.popular && <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber/10 text-amber font-medium shrink-0">Popular</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{doc.desc}</p>
                    <p className="text-xs font-medium text-teal mt-2">₹499</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
