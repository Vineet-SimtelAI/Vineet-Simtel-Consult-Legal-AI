"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star, MapPin, Video, Phone, MessageSquare, Filter, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/stores/auth-store"
import { useToast } from "@/hooks/use-toast"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"

// Fallback data when API is not available
const fallbackLawyers = [
  { id: "1", name: "Adv. Priya Sharma", specializations: ["Corporate Law"], city: "Mumbai", state: "Maharashtra", experience: 12, rating: 4.8, totalReviews: 156, hourlyRate: 1500, languages: ["English", "Hindi"], isAvailable: true },
  { id: "2", name: "Adv. Rajesh Kumar", specializations: ["Employment Law"], city: "Delhi", state: "Delhi", experience: 8, rating: 4.6, totalReviews: 98, hourlyRate: 1200, languages: ["English", "Hindi"], isAvailable: true },
  { id: "3", name: "Adv. Ananya Patel", specializations: ["Intellectual Property"], city: "Bangalore", state: "Karnataka", experience: 10, rating: 4.9, totalReviews: 203, hourlyRate: 2000, languages: ["English", "Hindi", "Gujarati"], isAvailable: true },
  { id: "4", name: "Adv. Vikram Singh", specializations: ["Contract Law"], city: "Hyderabad", state: "Telangana", experience: 15, rating: 4.7, totalReviews: 178, hourlyRate: 1800, languages: ["English", "Hindi", "Telugu"], isAvailable: true },
  { id: "5", name: "Adv. Meera Nair", specializations: ["Startup & Business Law"], city: "Chennai", state: "Tamil Nadu", experience: 6, rating: 4.5, totalReviews: 67, hourlyRate: 800, languages: ["English", "Hindi", "Tamil"], isAvailable: true },
  { id: "6", name: "Adv. Arjun Reddy", specializations: ["Real Estate Law"], city: "Bangalore", state: "Karnataka", experience: 9, rating: 4.8, totalReviews: 134, hourlyRate: 1500, languages: ["English", "Hindi", "Kannada"], isAvailable: true },
]

export default function DashboardLawyersPage() {
  const { token } = useAuthStore()
  const { toast } = useToast()
  const [lawyers, setLawyers] = useState(fallbackLawyers)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [bookingId, setBookingId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLawyers() {
      try {
        const res = await fetch(`${API_BASE}/lawyers`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success && data.data?.lawyers?.length > 0) {
          setLawyers(data.data.lawyers)
        }
      } catch {
        // Use fallback data
      }
    }
    fetchLawyers()
  }, [token])

  const filteredLawyers = lawyers.filter((l) =>
    !search ||
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.specializations.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
    l.city.toLowerCase().includes(search.toLowerCase())
  )

  const handleBook = async (lawyerId: string) => {
    setBookingId(lawyerId)
    toast({ title: "Booking initiated", description: "Select a time slot to complete your consultation booking. Full booking flow coming soon!" })
    setBookingId(null)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Find a Lawyer</h1>
        <p className="text-muted-foreground">Browse verified lawyers and book consultations</p>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Search by name, specialization, city..."
          className="flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filters</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLawyers.map((lawyer, i) => (
          <motion.div key={lawyer.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="hover:border-teal/30 transition-all duration-300 hover:-translate-y-1 h-full">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center text-teal font-bold text-sm">
                    {lawyer.name.split(" ").slice(-1)[0][0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{lawyer.name}</h3>
                    <p className="text-xs text-teal">{lawyer.specializations?.join(", ")}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {lawyer.city}, {lawyer.state} · {lawyer.experience} years
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Star className="h-3 w-3 text-amber fill-amber" />
                    <span className="font-medium">{lawyer.rating}</span>
                    <span className="text-muted-foreground">({lawyer.totalReviews} reviews)</span>
                  </div>
                  <div className="flex gap-1">
                    {["video", "audio", "chat"].map((mode) => (
                      <span key={mode} className="p-1 rounded bg-muted">
                        {mode === "video" ? <Video className="h-3 w-3 text-muted-foreground" /> :
                         mode === "audio" ? <Phone className="h-3 w-3 text-muted-foreground" /> :
                         <MessageSquare className="h-3 w-3 text-muted-foreground" />}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm">₹{lawyer.hourlyRate}<span className="text-xs font-normal text-muted-foreground">/hr</span></p>
                  <Button
                    size="sm"
                    className="bg-teal hover:bg-teal-dark text-white text-xs"
                    onClick={() => handleBook(lawyer.id)}
                    disabled={bookingId === lawyer.id}
                  >
                    {bookingId === lawyer.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Book"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredLawyers.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No lawyers found matching your search.</p>
        </div>
      )}
    </div>
  )
}
