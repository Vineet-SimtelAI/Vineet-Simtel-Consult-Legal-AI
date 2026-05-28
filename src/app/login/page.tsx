"use client"

import { motion } from "framer-motion"
import { Scale, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />

      <div className="relative w-full max-w-md mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Scale className="h-8 w-8 text-teal" />
              <span className="text-2xl font-bold bg-gradient-to-r from-teal to-teal-light bg-clip-text text-transparent">Consult Legal</span>
            </div>
            <h1 className="text-2xl font-bold">AI-Powered Legal Document Platform</h1>
            <p className="text-sm text-muted-foreground">Generate, review and manage legally binding documents in minutes — not days.</p>
          </div>

          {/* Features badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {["AI-generated, lawyer-verified clauses", "Risk analysis & compliance checks", "10+ document types under Indian law"].map((f) => (
              <span key={f} className="px-2 py-1 rounded-md bg-teal/10 text-teal text-xs">{f}</span>
            ))}
          </div>

          <div className="text-center">
            <span className="px-3 py-1 rounded-full bg-amber/10 border border-amber/20 text-amber text-xs font-medium inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> TRUSTED BY INDIAN BUSINESSES
            </span>
          </div>

          {/* Auth Tabs */}
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input id="login-password" type="password" placeholder="Enter your password" />
              </div>
              <Button className="w-full bg-teal hover:bg-teal-dark text-white">Login</Button>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="reg-name">Full Name</Label>
                <Input id="reg-name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input id="reg-email" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <Input id="reg-password" type="password" placeholder="Create a password" />
              </div>
              <Button className="w-full bg-teal hover:bg-teal-dark text-white">Register</Button>
            </TabsContent>
          </Tabs>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-background px-2 text-muted-foreground">OR</span></div>
          </div>

          {/* Google OAuth */}
          <Button variant="outline" className="w-full gap-2 h-12" onClick={() => {}}>
            <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Sign in with Google
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms & Conditions and Privacy Policy
          </p>

          <p className="text-center text-xs text-muted-foreground">
            &copy; 2026 Simulate Intelligence Private Limited
          </p>
        </motion.div>
      </div>
    </div>
  )
}
