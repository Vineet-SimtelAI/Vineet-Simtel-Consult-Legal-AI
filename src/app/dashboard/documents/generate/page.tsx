"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FileText, ChevronRight, Check, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useAuthStore } from "@/stores/auth-store"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"

const steps = ["Select Document", "Fill Details", "Review & Generate"]

const documentTypes = [
  { type: "nda", name: "Non-Disclosure Agreement", cost: 10 },
  { type: "employment-agreement", name: "Employment Agreement", cost: 10 },
  { type: "service-agreement", name: "Service Agreement", cost: 10 },
  { type: "vendor-agreement", name: "Vendor Agreement", cost: 10 },
  { type: "consulting-agreement", name: "Consulting Agreement", cost: 10 },
  { type: "partnership-agreement", name: "Partnership Agreement", cost: 10 },
]

export default function GenerateDocumentPage() {
  const { user, token, updateCredits } = useAuthStore()
  const { toast } = useToast()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [selectedType, setSelectedType] = useState("")
  const [aiEnhanced, setAiEnhanced] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({
    partyA: "",
    partyB: "",
    jurisdiction: "",
    duration: "24",
    purpose: "",
    additionalClauses: "",
  })

  const creditsCost = aiEnhanced ? 25 : 10

  const handleGenerate = async () => {
    setIsGenerating(true)

    try {
      const res = await fetch(`${API_BASE}/documents/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          type: selectedType,
          title: documentTypes.find(d => d.type === selectedType)?.name || selectedType,
          formData,
          aiEnhanced,
        }),
      })
      const data = await res.json()

      if (data.success) {
        toast({
          title: "Document generation started!",
          description: `Your document is being generated. ${data.data?.creditsUsed || creditsCost} credits used.`,
        })
        if (data.data?.creditBalance !== undefined) {
          updateCredits(data.data.creditBalance)
        }
        router.push("/dashboard/documents")
      } else {
        toast({ title: "Generation failed", description: data.error?.message || "Something went wrong.", variant: "destructive" })
      }
    } catch {
      // Fallback: simulate generation
      toast({
        title: "Document generation simulated",
        description: `${creditsCost} credits used. Connect backend API for real document generation.`,
      })
      updateCredits(Math.max(0, (user?.creditBalance || 0) - creditsCost))
      setTimeout(() => router.push("/dashboard/documents"), 1500)
    } finally {
      setIsGenerating(false)
    }
  }

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

      {/* Step 0: Select Document */}
      {step === 0 && (
        <Card>
          <CardHeader><h2 className="font-semibold">Select Document Type</h2></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {documentTypes.map((doc) => (
                <button
                  key={doc.type}
                  onClick={() => { setSelectedType(doc.type); }}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                    selectedType === doc.type ? "border-teal bg-teal/5" : "border-border hover:border-teal/30 hover:bg-teal/5"
                  }`}
                >
                  <FileText className="h-5 w-5 text-teal shrink-0" />
                  <div className="flex-1">
                    <span className="text-sm font-medium block">{doc.name}</span>
                    <span className="text-xs text-muted-foreground">{doc.cost} credits</span>
                  </div>
                </button>
              ))}
            </div>

            {/* AI Enhancement Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber" />
                <div>
                  <p className="text-sm font-medium">AI Enhancement</p>
                  <p className="text-xs text-muted-foreground">Get AI-powered legal clause suggestions (+15 credits)</p>
                </div>
              </div>
              <Switch checked={aiEnhanced} onCheckedChange={setAiEnhanced} />
            </div>

            <Button
              className="bg-teal hover:bg-teal-dark text-white"
              disabled={!selectedType}
              onClick={() => setStep(1)}
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Fill Details */}
      {step === 1 && (
        <Card>
          <CardHeader><h2 className="font-semibold">Fill in Details</h2></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Disclosing Party Name</Label>
                <Input
                  placeholder="Company or individual name"
                  value={formData.partyA}
                  onChange={(e) => setFormData(prev => ({ ...prev, partyA: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Receiving Party Name</Label>
                <Input
                  placeholder="Company or individual name"
                  value={formData.partyB}
                  onChange={(e) => setFormData(prev => ({ ...prev, partyB: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Jurisdiction</Label>
                <Select onValueChange={(val) => setFormData(prev => ({ ...prev, jurisdiction: val }))}>
                  <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="telangana">Telangana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duration (months)</Label>
                <Input
                  type="number"
                  placeholder="24"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Purpose</Label>
              <Textarea
                placeholder="Describe the purpose of this agreement"
                rows={3}
                value={formData.purpose}
                onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Additional Clauses</Label>
              <Textarea
                placeholder="Any specific clauses or terms to include"
                rows={3}
                value={formData.additionalClauses}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalClauses: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
              <Button className="bg-teal hover:bg-teal-dark text-white" onClick={() => setStep(2)}>Review & Generate</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Review */}
      {step === 2 && (
        <Card>
          <CardHeader><h2 className="font-semibold">Review & Generate</h2></CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 space-y-2 text-sm">
              <p><span className="text-muted-foreground">Document:</span> {documentTypes.find(d => d.type === selectedType)?.name}</p>
              <p><span className="text-muted-foreground">Party A:</span> {formData.partyA || "—"}</p>
              <p><span className="text-muted-foreground">Party B:</span> {formData.partyB || "—"}</p>
              <p><span className="text-muted-foreground">Jurisdiction:</span> {formData.jurisdiction || "—"}</p>
              <p><span className="text-muted-foreground">Duration:</span> {formData.duration} months</p>
              <p><span className="text-muted-foreground">AI Enhanced:</span> {aiEnhanced ? "Yes" : "No"}</p>
              <p><span className="text-muted-foreground">Cost:</span> <span className="font-bold text-teal">{creditsCost} credits</span></p>
              <p><span className="text-muted-foreground">Format:</span> PDF, DOCX</p>
            </div>
            <div className="p-4 rounded-lg bg-amber/5 border border-amber/20">
              <p className="text-sm text-amber">By generating this document, you acknowledge that this is not legal advice and recommend review by a qualified lawyer.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button
                className="bg-teal hover:bg-teal-dark text-white"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Generate Document — {creditsCost} credits
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
