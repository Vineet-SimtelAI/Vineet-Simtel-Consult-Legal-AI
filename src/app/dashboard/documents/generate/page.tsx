"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const steps = ["Select Document", "Fill Details", "Review & Generate"]

export default function GenerateDocumentPage() {
  const [step, setStep] = useState(0)

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Generate Document</h1>
        <p className="text-muted-foreground">Create a professional legal document in minutes</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${i <= step ? "bg-teal text-white" : "bg-muted text-muted-foreground"}`}>
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`text-xs ${i <= step ? "text-teal font-medium" : "text-muted-foreground"}`}>{s}</span>
            {i < steps.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 0 && (
        <Card>
          <CardHeader><h2 className="font-semibold">Select Document Type</h2></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {["Non-Disclosure Agreement", "Employment Agreement", "Service Agreement", "Vendor Agreement", "Consulting Agreement", "Partnership Agreement"].map((doc) => (
              <button key={doc} onClick={() => setStep(1)} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-teal/30 hover:bg-teal/5 text-left transition-colors">
                <FileText className="h-5 w-5 text-teal shrink-0" />
                <span className="text-sm font-medium">{doc}</span>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <CardHeader><h2 className="font-semibold">Fill in Details</h2></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Disclosing Party Name</Label><Input placeholder="Company or individual name" /></div>
              <div className="space-y-2"><Label>Receiving Party Name</Label><Input placeholder="Company or individual name" /></div>
              <div className="space-y-2"><Label>Jurisdiction</Label><Select><SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger><SelectContent><SelectItem value="karnataka">Karnataka</SelectItem><SelectItem value="maharashtra">Maharashtra</SelectItem><SelectItem value="delhi">Delhi</SelectItem><SelectItem value="tamil-nadu">Tamil Nadu</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Duration (months)</Label><Input type="number" placeholder="24" /></div>
            </div>
            <div className="space-y-2"><Label>Purpose of NDA</Label><Textarea placeholder="Describe the purpose of sharing confidential information" rows={3} /></div>
            <div className="space-y-2"><Label>Additional Clauses</Label><Textarea placeholder="Any specific clauses or terms to include" rows={3} /></div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
              <Button className="bg-teal hover:bg-teal-dark text-white" onClick={() => setStep(2)}>Review & Generate</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader><h2 className="font-semibold">Review & Generate</h2></CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 space-y-2 text-sm">
              <p><span className="text-muted-foreground">Document:</span> Non-Disclosure Agreement</p>
              <p><span className="text-muted-foreground">Cost:</span> <span className="font-bold text-teal">₹499</span></p>
              <p><span className="text-muted-foreground">Format:</span> PDF, DOCX</p>
            </div>
            <div className="p-4 rounded-lg bg-amber/5 border border-amber/20">
              <p className="text-sm text-amber">By generating this document, you acknowledge that this is not legal advice and recommend review by a qualified lawyer.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button className="bg-teal hover:bg-teal-dark text-white">Generate Document — ₹499</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
