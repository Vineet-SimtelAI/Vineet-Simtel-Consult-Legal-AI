"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FileText, Plus, Download, Trash2, Loader2, Clock } from "lucide-react"
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

export default function DashboardDocumentsPage() {
  const { token } = useAuthStore()
  const { toast } = useToast()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const res = await fetch(`${API_BASE}/documents`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) {
          setDocuments(data.data.documents)
        }
      } catch {
        // empty
      } finally {
        setLoading(false)
      }
    }
    if (token) fetchDocuments()
    else setLoading(false)
  }, [token])

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
        setDocuments(prev => prev.filter(d => d.id !== docId))
        toast({ title: "Document deleted" })
      }
    } catch {
      toast({ title: "Delete failed", variant: "destructive" })
    }
  }

  const statusColors: Record<string, string> = {
    DRAFT: "bg-muted text-muted-foreground",
    GENERATING: "bg-amber/10 text-amber",
    COMPLETED: "bg-teal/10 text-teal",
    FAILED: "bg-destructive/10 text-destructive",
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
          {documents.map((doc, i) => (
            <motion.div key={doc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="border-border/50 hover:border-teal/20 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-teal" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{doc.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{doc.type}</span>
                        <span>·</span>
                        <Clock className="h-3 w-3" />
                        <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${statusColors[doc.status] || "bg-muted"}`}>
                      {doc.status}
                    </span>
                    {doc.status === "COMPLETED" && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownload(doc.id)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(doc.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
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
            <Button size="sm" className="mt-4 bg-teal hover:bg-teal-dark text-white">Generate Document</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
