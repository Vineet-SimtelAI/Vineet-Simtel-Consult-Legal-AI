"use client"

import { User, Mail, Phone, Building, Shield } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function DashboardSettingsPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <h2 className="text-lg font-semibold flex items-center gap-2"><User className="h-5 w-5 text-teal" /> Profile</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="you@example.com" disabled />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input placeholder="+91 98765 43210" />
          </div>
          <div className="space-y-2">
            <Label>Company</Label>
            <Input placeholder="Your company name" />
          </div>
          <Button className="bg-teal hover:bg-teal-dark text-white">Save Changes</Button>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <h2 className="text-lg font-semibold flex items-center gap-2"><Shield className="h-5 w-5 text-teal" /> Security</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">You&apos;re signed in with Google OAuth. No password change required.</p>
          <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
