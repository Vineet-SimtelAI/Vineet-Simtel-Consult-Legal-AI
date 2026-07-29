"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText, Plus, Download, Trash2, Loader2, Clock,
  CheckCircle2, XCircle, Sparkles, ChevronDown, ChevronUp,
  AlertCircle, Zap, Timer, BarChart3
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth-store"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"

interface Document {
  id: string
  type: string
  title: string
  status: string
  creditsUsed: number
  createdAt: string
}

interface ProgressStep {
  name: string
  label: string
  status: "pending" | "running" | "completed" | "failed" | "skipped"
  durationMs?: number
  error?: string
}

interface DocumentProgress {
  documentId: string
  status: "GENERATING" | "COMPLETED" | "FAILED"
  percentage: number
  currentStep: string
  currentStepIndex: number
  totalSteps: number
  message: string
  steps: ProgressStep[]
  startedAt: string
  estimatedTotalMs: number
  elapsedMs: number
}

function formatMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`
}

function formatEta(elapsedMs: number, estimatedTotalMs: number): string {
  const remaining = Math.max(0, estimatedTotalMs - elapsedMs)
  if (remaining === 0) return "Almost done..."
  return `~${formatMs(remaining)} remaining`
}

const STEP_ICON: Record<string, React.ReactNode> = {
  template_load: <FileText className="h-3.5 w-3.5" />,
  ai_enhance:    <Sparkles className="h-3.5 w-3.5" />,
  html_render:   <BarChart3 className="h-3.5 w-3.5" />,
  pdf_render:    <Zap className="h-3.5 w-3.5" />,
  upload:        <CheckCircle2 className="h-3.5 w-3.5" />,
}

function StepBadge({ step }: { step: ProgressStep }) {
  const base = "flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-all duration-300"

  if (step.status === "completed") {
    return (
      <span className={`${base} bg-emerald-500/15 text-emerald-400 border border-emerald-500/20`}>
        <CheckCircle2 className="h-3 w-3" />
        {step.label}
        {step.durationMs !== undefined && (
          <span className="opacity-60 ml-0.5">({formatMs(step.durationMs)})</span>
        )}
      </span>
    )
  }
  if (step.status === "running") {
    return (
      <span className={`${base} bg-amber-500/15 text-amber-400 border border-amber-500/20 animate-pulse`}>
        <Loader2 className="h-3 w-3 animate-spin" />
        {step.label}
      </span>
    )
  }
  if (step.status === "failed") {
    return (
      <span className={`${base} bg-red-500/15 text-red-400 border border-red-500/20`}>
        <XCircle className="h-3 w-3" />
        {step.label}
      </span>
    )
  }
  if (step.status === "skipped") {
    return (
      <span className={`${base} bg-muted/50 text-muted-foreground/50 border border-border/30`}>
        <span className="h-3 w-3 flex items-center justify-center opacity-40">—</span>
        {step.label}
      </span>
    )
  }
  // pending
  return (
    <span className={`${base} bg-muted/30 text-muted-foreground/40 border border-border/20`}>
      <span className="h-3 w-3 rounded-full border border-current opacity-40" />
      {step.label}
    </span>
  )
}

function ProgressPanel({ docId, token }: { docId: string; token: string }) {
  const [progress, setProgress] = useState<DocumentProgress | null>(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    let active = true
    let timer: NodeJS.Timeout

    const poll = async () => {
      try {
        const res = await fetch(`${API_BASE}/documents/${docId}/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (active && data.success) {
          setProgress(data.data)
          if (data.data.status === "GENERATING") {
            timer = setTimeout(poll, 1200) // poll every 1.2s while generating
          }
        }
      } catch {
        if (active) timer = setTimeout(poll, 3000)
      }
    }

    poll()
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [docId, token])

  if (!progress) {
    return (
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" />
        Loading progress...
      </div>
    )
  }

  const pct = progress.percentage

  return (
    <div className="mt-3 space-y-2">
      {/* Progress Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-muted/60 h-1.5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
        <span className="text-xs font-mono font-semibold text-amber-400 w-8 text-right">{pct}%</span>
      </div>

      {/* Message + ETA */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground leading-tight max-w-[70%]">
          {progress.message}
        </p>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
          <Timer className="h-3 w-3" />
          {progress.estimatedTotalMs > 0
            ? formatEta(progress.elapsedMs, progress.estimatedTotalMs)
            : formatMs(progress.elapsedMs)}
        </div>
      </div>

      {/* Steps Toggle */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1 text-[11px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
      >
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {expanded ? "Hide steps" : "Show steps"}
      </button>

      <AnimatePresence>
        {expanded && progress.steps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-1.5 pt-1">
              {progress.steps.map((step) => (
                <StepBadge key={step.name} step={step} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  DRAFT:      { label: "Draft",      color: "bg-slate-500/10 text-slate-400 border border-slate-500/20",    dot: "bg-slate-400" },
  GENERATING: { label: "Generating", color: "bg-amber-500/10 text-amber-400 border border-amber-500/20",    dot: "bg-amber-400" },
  COMPLETED:  { label: "Completed",  color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20", dot: "bg-emerald-400" },
  FAILED:     { label: "Failed",     color: "bg-red-500/10 text-red-400 border border-red-500/20",          dot: "bg-red-400" },
}

export default function DashboardDocumentsPage() {
  const { token } = useAuthStore()
  const { toast } = useToast()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setDocuments(data.data.documents)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [token])

  // Refresh document list periodically to catch status changes
  useEffect(() => {
    if (!token) { setLoading(false); return }
    fetchDocuments()
    const interval = setInterval(fetchDocuments, 5000)
    return () => clearInterval(interval)
  }, [token, fetchDocuments])

  const handleDownload = async (docId: string) => {
    try {
      const res = await fetch(`${API_BASE}/documents/${docId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success && data.data?.url) {
        window.open(data.data.url, "_blank")
      } else {
        toast({ title: "Document not ready", description: "The document is still being generated.", variant: "destructive" })
      }
    } catch {
      toast({ title: "Download failed", description: "Could not download the document.", variant: "destructive" })
    }
  }

  const handleDelete = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return
    try {
      const res = await fetch(`${API_BASE}/documents/${docId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== docId))
        toast({ title: "Document deleted" })
      }
    } catch {
      toast({ title: "Delete failed", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Manage your legal documents</p>
        </div>
        <Link href="/dashboard/documents/generate">
          <Button size="sm" className="bg-teal hover:bg-teal-dark text-white gap-1">
            <Plus className="h-4 w-4" /> Generate New
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin h-8 w-8 border-2 border-teal border-t-transparent rounded-full" />
        </div>
      ) : documents.length > 0 ? (
        <div className="space-y-3">
          {documents.map((doc, i) => {
            const cfg = statusConfig[doc.status] || statusConfig.DRAFT
            const isGenerating = doc.status === "GENERATING"
            const isFailed = doc.status === "FAILED"
            const isCompleted = doc.status === "COMPLETED"

            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={`border-border/50 transition-colors ${isGenerating ? "border-amber-500/20" : isFailed ? "border-red-500/20" : "hover:border-teal/20"}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left — icon + info */}
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5
                          ${isCompleted ? "bg-teal/10" : isFailed ? "bg-red-500/10" : "bg-amber-500/10"}`}>
                          {isGenerating ? (
                            <Loader2 className="h-5 w-5 text-amber-400 animate-spin" />
                          ) : isFailed ? (
                            <AlertCircle className="h-5 w-5 text-red-400" />
                          ) : (
                            <FileText className={`h-5 w-5 ${isCompleted ? "text-teal" : "text-muted-foreground"}`} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-sm leading-tight">{doc.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <span className="capitalize">{doc.type.replace(/-/g, " ")}</span>
                            <span>·</span>
                            <Clock className="h-3 w-3" />
                            <span>{new Date(doc.createdAt).toLocaleDateString("en-IN")}</span>
                            {doc.creditsUsed > 0 && (
                              <>
                                <span>·</span>
                                <span>{doc.creditsUsed} credits</span>
                              </>
                            )}
                          </div>

                          {/* Progress panel for generating docs */}
                          {isGenerating && token && (
                            <ProgressPanel docId={doc.id} token={token} />
                          )}

                          {/* Error message for failed docs */}
                          {isFailed && (
                            <div className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
                              <XCircle className="h-3 w-3 shrink-0" />
                              <span>Generation failed. Credits have been refunded.</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right — status + actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium flex items-center gap-1.5 ${cfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${isGenerating ? "animate-pulse" : ""}`} />
                          {cfg.label}
                        </span>

                        {isCompleted && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-teal"
                            onClick={() => handleDownload(doc.id)}
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}

                        {!isGenerating && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(doc.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold mb-2">No documents yet</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Generate your first legal document in minutes. Choose from NDA, Employment Agreements, Service Agreements, and more.
          </p>
          <Link href="/dashboard/documents/generate">
            <Button size="sm" className="mt-4 bg-teal hover:bg-teal-dark text-white">
              Generate Document
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
