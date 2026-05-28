"use client"

import { Calendar, Clock, Video, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardConsultationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Consultations</h1>
        <p className="text-muted-foreground">Manage your lawyer consultations</p>
      </div>

      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Calendar className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold mb-2">No consultations yet</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Book a consultation with a verified lawyer through our Lawyer Marketplace. Browse by expertise, location, and pricing.
        </p>
      </div>
    </div>
  )
}
