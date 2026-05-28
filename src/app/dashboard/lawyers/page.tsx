"use client"

import { motion } from "framer-motion"
import { Star, MapPin, Video, Phone, MessageSquare, Filter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const lawyers = [
  { name: "Adv. Priya Sharma", specialization: "Corporate Law", location: "Mumbai", experience: "12 years", rating: 4.8, reviews: 156, price: 1500, modes: ["video", "audio", "chat"] },
  { name: "Adv. Rajesh Kumar", specialization: "Employment Law", location: "Delhi", experience: "8 years", rating: 4.6, reviews: 98, price: 1200, modes: ["video", "audio"] },
  { name: "Adv. Ananya Patel", specialization: "Intellectual Property", location: "Bangalore", experience: "10 years", rating: 4.9, reviews: 203, price: 2000, modes: ["video", "audio", "chat"] },
  { name: "Adv. Vikram Singh", specialization: "Contract Law", location: "Hyderabad", experience: "15 years", rating: 4.7, reviews: 178, price: 1800, modes: ["video", "chat"] },
  { name: "Adv. Meera Nair", specialization: "Startup & Business Law", location: "Chennai", experience: "6 years", rating: 4.5, reviews: 67, price: 800, modes: ["video", "audio", "chat"] },
  { name: "Adv. Arjun Reddy", specialization: "Real Estate Law", location: "Bangalore", experience: "9 years", rating: 4.8, reviews: 134, price: 1500, modes: ["video", "audio"] },
]

export default function DashboardLawyersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Find a Lawyer</h1>
        <p className="text-muted-foreground">Browse verified lawyers and book consultations</p>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2">
        <Input placeholder="Search by name, specialization..." className="flex-1" />
        <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filters</Button>
      </div>

      {/* Lawyer grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lawyers.map((lawyer, i) => (
          <motion.div key={lawyer.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="hover:border-teal/30 transition-all duration-300 hover:-translate-y-1 h-full">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center text-teal font-bold text-sm">
                    {lawyer.name.split(" ").slice(-1)[0][0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{lawyer.name}</h3>
                    <p className="text-xs text-teal">{lawyer.specialization}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {lawyer.location} · {lawyer.experience}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Star className="h-3 w-3 text-amber fill-amber" />
                    <span className="font-medium">{lawyer.rating}</span>
                    <span className="text-muted-foreground">({lawyer.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {lawyer.modes.map((mode) => (
                      <span key={mode} className="p-1 rounded bg-muted">
                        {mode === "video" ? <Video className="h-3 w-3 text-muted-foreground" /> :
                         mode === "audio" ? <Phone className="h-3 w-3 text-muted-foreground" /> :
                         <MessageSquare className="h-3 w-3 text-muted-foreground" />}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm">₹{lawyer.price}<span className="text-xs font-normal text-muted-foreground">/hr</span></p>
                  <Button size="sm" className="bg-teal hover:bg-teal-dark text-white text-xs">Book</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
