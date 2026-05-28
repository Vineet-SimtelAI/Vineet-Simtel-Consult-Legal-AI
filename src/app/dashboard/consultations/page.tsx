"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Video, Plus, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth-store"
import Link from "next/link"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"

interface Consultation {
  id: string
  lawyerId: string
  type: string
  status: string
  scheduledAt: string
  duration: number
  topic: string
  meetingLink?: string
  lawyer: { name: string; avatarUrl?: string }
}

export default function DashboardConsultationsPage() {
  const { token } = useAuthStore()
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchConsultations() {
      try {
        const res = await fetch(`${API_BASE}/consultations`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) {
          setConsultations(data.data.consultations)
        }
      } catch {
        // empty
      } finally {
        setLoading(false)
      }
    }
    if (token) fetchConsultations()
    else setLoading(false)
  }, [token])

  const statusColors: Record<string, string> = {
    REQUESTED: "bg-amber/10 text-amber",
    CONFIRMED: "bg-teal/10 text-teal",
    IN_PROGRESS: "bg-blue/10 text-blue",
    COMPLETED: "bg-green/10 text-green",
    CANCELLED: "bg-destructive/10 text-destructive",
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin h-8 w-8 border-2 border-teal border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Consultations</h1>
          <p className="text-muted-foreground">Manage your lawyer consultations</p>
        </div>
        <Link href="/dashboard/lawyers">
          <Button size="sm" className="bg-teal hover:bg-teal-dark text-white gap-1">
            <Plus className="h-4 w-4" /> Book New
          </Button>
        </Link>
      </div>

      {consultations.length > 0 ? (
        <div className="space-y-4">
          {consultations.map((consultation) => (
            <Card key={consultation.id} className="border-border/50 hover:border-teal/20 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm">{consultation.topic}</h3>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${statusColors[consultation.status] || "bg-muted"}`}>
                        {consultation.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      with {consultation.lawyer?.name || "Lawyer"} · {consultation.type} · {consultation.duration} min
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(consultation.scheduledAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  {consultation.meetingLink && consultation.status === "CONFIRMED" && (
                    <a href={consultation.meetingLink} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="gap-1 text-xs">
                        <Video className="h-3 w-3" /> Join
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold mb-2">No consultations yet</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Book a consultation with a verified lawyer through our Lawyer Marketplace. Browse by expertise, location, and pricing.
          </p>
          <Link href="/dashboard/lawyers">
            <Button size="sm" className="mt-4 bg-teal hover:bg-teal-dark text-white">Browse Lawyers</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
