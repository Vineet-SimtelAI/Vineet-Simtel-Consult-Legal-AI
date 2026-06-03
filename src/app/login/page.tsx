"use client"

import { Suspense, useState } from "react"
import { motion } from "framer-motion"
import { Scale, Sparkles, Phone, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthStore } from "@/stores/auth-store"
import { useSearchParams } from "next/navigation"

function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const login = useAuthStore((state) => state.login)

  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [name, setName] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"

  const authenticateAndRedirect = async (userData: any, token: string, url: string) => {
    try {
      await fetch("/api/auth/set-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
    } catch {
      document.cookie = `cl_token=${token}; path=/; max-age=${604800}; SameSite=Lax`
    }
    login(userData, token)
    window.location.href = url
  }

  const handleSendOtp = async () => {
    if (!phone) return
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch(`${API_BASE}/auth/otp/send`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone }) })
      const data = await res.json()
      if (data.success) setOtpSent(true)
      else setError(data.error?.message || "Failed to send OTP")
    } catch { setOtpSent(true) }
    finally { setIsLoading(false) }
  }

  const handleVerifyOtp = async () => {
    if (!otp) return
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch(`${API_BASE}/auth/otp/verify`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, otp, name: name || undefined }) })
      const data = await res.json()
      if (data.success && data.data?.user && data.data?.accessToken) await authenticateAndRedirect(data.data.user, data.data.accessToken, callbackUrl)
      else setError(data.error?.message || "Invalid OTP")
    } catch {
      await authenticateAndRedirect({ id: "dev_user_1", name: name || "Dev User", phone, role: "USER", creditBalance: 25, emailVerified: false, phoneVerified: true }, "dev_token_123", callbackUrl)
    } finally { setIsLoading(false) }
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    await authenticateAndRedirect({ id: "demo_user_1", name: "Demo User", email: "demo@consultlegal.in", phone: "+91 98765 43210", role: "USER", creditBalance: 100, emailVerified: true, phoneVerified: true }, "demo_token_123", callbackUrl)
  }

  const handleGoogleSignIn = () => { handleDemoLogin() }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink pt-16">
      <div className="relative w-full max-w-md mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2.5">
              <Scale className="h-6 w-6 text-ivory/60" />
              <span className="text-lg font-medium text-ivory tracking-tight">Consult Legal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-ivory">Legal Work, Perfected.</h1>
            <p className="text-sm text-ivory/40">Generate, review and manage legally binding documents in minutes.</p>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {["AI-generated clauses", "Risk analysis", "10+ document types"].map((f) => (
              <span key={f} className="px-2.5 py-1 rounded-sm bg-ivory/[0.04] text-ivory/30 text-xs">{f}</span>
            ))}
          </div>

          <div className="text-center">
            <span className="text-xs text-ivory/30 tracking-wide uppercase">Trusted by Indian Businesses</span>
          </div>

          {error && (
            <div className="p-3 rounded-sm bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          {/* Demo mode banner */}
          <div className="p-3 rounded-sm bg-ivory/[0.03] border border-white/[0.06] text-ivory/40 text-sm text-center">
            Demo mode — use any phone number or click &quot;Try Demo&quot;
          </div>

          {/* Auth Tabs */}
          <Tabs defaultValue="phone" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-ink-light border border-white/[0.06] rounded-sm">
              <TabsTrigger value="phone" className="rounded-sm text-ivory/50 data-[state=active]:bg-ivory data-[state=active]:text-ink">Phone OTP</TabsTrigger>
              <TabsTrigger value="register" className="rounded-sm text-ivory/50 data-[state=active]:bg-ivory data-[state=active]:text-ink">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="phone" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-ivory/50 text-sm">Phone Number</Label>
                <div className="flex gap-2">
                  <Input id="phone" type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={otpSent} className="bg-ink-light border-white/[0.06] text-ivory placeholder:text-ivory/20 rounded-sm" />
                  {!otpSent ? (
                    <Button onClick={handleSendOtp} disabled={!phone || isLoading} className="bg-ivory text-ink rounded-sm hover:bg-ivory/90 shrink-0">Send OTP</Button>
                  ) : (
                    <Button variant="outline" onClick={() => { setOtpSent(false); setOtp("") }} className="border-ivory/20 text-ivory/50 rounded-sm shrink-0">Change</Button>
                  )}
                </div>
              </div>
              {otpSent && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
                  <Label htmlFor="otp" className="text-ivory/50 text-sm">Enter OTP</Label>
                  <Input id="otp" type="text" placeholder="Enter 6 digits" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} maxLength={6} className="bg-ink-light border-white/[0.06] text-ivory placeholder:text-ivory/20 rounded-sm" />
                </motion.div>
              )}
              {otpSent && (
                <Button onClick={handleVerifyOtp} disabled={otp.length !== 6 || isLoading} className="w-full bg-ivory text-ink rounded-sm hover:bg-ivory/90 font-medium">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Phone className="h-4 w-4 mr-2" />}
                  Verify & Login
                </Button>
              )}
            </TabsContent>

            <TabsContent value="register" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="reg-name" className="text-ivory/50 text-sm">Full Name</Label>
                <Input id="reg-name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="bg-ink-light border-white/[0.06] text-ivory placeholder:text-ivory/20 rounded-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-phone" className="text-ivory/50 text-sm">Phone Number</Label>
                <div className="flex gap-2">
                  <Input id="reg-phone" type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={otpSent} className="bg-ink-light border-white/[0.06] text-ivory placeholder:text-ivory/20 rounded-sm" />
                  {!otpSent ? (
                    <Button onClick={handleSendOtp} disabled={!phone || isLoading} className="bg-ivory text-ink rounded-sm hover:bg-ivory/90 shrink-0">Send OTP</Button>
                  ) : (
                    <Button variant="outline" onClick={() => { setOtpSent(false); setOtp("") }} className="border-ivory/20 text-ivory/50 rounded-sm shrink-0">Change</Button>
                  )}
                </div>
              </div>
              {otpSent && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
                  <Label htmlFor="reg-otp" className="text-ivory/50 text-sm">Enter OTP</Label>
                  <Input id="reg-otp" placeholder="Enter 6 digits" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} maxLength={6} className="bg-ink-light border-white/[0.06] text-ivory placeholder:text-ivory/20 rounded-sm" />
                </motion.div>
              )}
              {otpSent && (
                <Button onClick={handleVerifyOtp} disabled={otp.length !== 6 || !name || isLoading} className="w-full bg-ivory text-ink rounded-sm hover:bg-ivory/90 font-medium">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Register & Login
                </Button>
              )}
            </TabsContent>
          </Tabs>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.06]" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-ink px-2 text-ivory/20">OR</span></div>
          </div>

          <Button variant="outline" className="w-full gap-2 h-11 border-ivory/10 text-ivory/50 hover:bg-ivory/[0.04] rounded-sm" onClick={handleDemoLogin} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin text-ivory/50" /> : <Sparkles className="h-4 w-4 text-ivory/30" />}
            Try Demo Account
          </Button>

          <Button variant="outline" className="w-full gap-2 h-11 border-ivory/10 text-ivory/50 hover:bg-ivory/[0.04] rounded-sm" onClick={handleGoogleSignIn} disabled={isLoading}>
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Sign in with Google (Demo)
          </Button>

          <p className="text-center text-xs text-ivory/20">
            By continuing, you agree to our Terms & Conditions and Privacy Policy
          </p>
          <p className="text-center text-xs text-ivory/15">
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
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <div className="animate-spin h-6 w-6 border-2 border-ivory/20 border-t-ivory/60 rounded-full" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
