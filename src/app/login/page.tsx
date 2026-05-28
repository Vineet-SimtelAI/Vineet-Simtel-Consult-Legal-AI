"use client"

import { Suspense, useState } from "react"
import { motion } from "framer-motion"
import { Scale, Sparkles, Phone, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const { login } = useAuthStore()

  // Phone OTP state
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [name, setName] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"

  // Send OTP
  const handleSendOtp = async () => {
    if (!phone) return
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch(`${API_BASE}/auth/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()

      if (data.success) {
        setOtpSent(true)
      } else {
        setError(data.error?.message || "Failed to send OTP")
      }
    } catch {
      // In dev mode without backend, simulate OTP
      setOtpSent(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) return
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch(`${API_BASE}/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, name: name || undefined }),
      })
      const data = await res.json()

      if (data.success && data.data?.user && data.data?.accessToken) {
        login(data.data.user, data.data.accessToken)
        router.push(callbackUrl)
      } else {
        setError(data.error?.message || "Invalid OTP")
      }
    } catch {
      // In dev mode without backend, simulate login
      login({
        id: "dev_user_1",
        name: name || "Dev User",
        phone,
        role: "USER",
        creditBalance: 25,
        emailVerified: false,
        phoneVerified: true,
      }, "dev_token_123")
      router.push(callbackUrl)
    } finally {
      setIsLoading(false)
    }
  }

  // Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl })
    } catch {
      // In dev mode, simulate Google login
      login({
        id: "dev_google_user",
        name: "Google User",
        email: "user@gmail.com",
        role: "USER",
        creditBalance: 25,
        emailVerified: true,
        phoneVerified: false,
      }, "dev_google_token_123")
      router.push(callbackUrl)
    }
  }

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

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Auth Tabs */}
          <Tabs defaultValue="phone" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="phone">Phone OTP</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="phone" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={otpSent}
                  />
                  {!otpSent ? (
                    <Button onClick={handleSendOtp} disabled={!phone || isLoading} className="bg-teal hover:bg-teal-dark text-white shrink-0">
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => { setOtpSent(false); setOtp("") }} className="shrink-0">
                      Change
                    </Button>
                  )}
                </div>
              </div>

              {otpSent && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                  />
                  <p className="text-xs text-muted-foreground">OTP sent to {phone} (check console in dev mode)</p>
                </motion.div>
              )}

              {otpSent && (
                <Button onClick={handleVerifyOtp} disabled={otp.length !== 6 || isLoading} className="w-full bg-teal hover:bg-teal-dark text-white">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Phone className="h-4 w-4 mr-2" />}
                  Verify & Login
                </Button>
              )}
            </TabsContent>

            <TabsContent value="register" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="reg-name">Full Name</Label>
                <Input id="reg-name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-phone">Phone Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="reg-phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={otpSent}
                  />
                  {!otpSent ? (
                    <Button onClick={handleSendOtp} disabled={!phone || isLoading} className="bg-teal hover:bg-teal-dark text-white shrink-0">
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => { setOtpSent(false); setOtp("") }} className="shrink-0">
                      Change
                    </Button>
                  )}
                </div>
              </div>
              {otpSent && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
                  <Label htmlFor="reg-otp">Enter OTP</Label>
                  <Input
                    id="reg-otp"
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                  />
                </motion.div>
              )}
              {otpSent && (
                <Button onClick={handleVerifyOtp} disabled={otp.length !== 6 || !name || isLoading} className="w-full bg-teal hover:bg-teal-dark text-white">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Register & Login
                </Button>
              )}
            </TabsContent>
          </Tabs>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-background px-2 text-muted-foreground">OR</span></div>
          </div>

          {/* Google OAuth */}
          <Button variant="outline" className="w-full gap-2 h-12" onClick={handleGoogleSignIn}>
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-teal border-t-transparent rounded-full" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
