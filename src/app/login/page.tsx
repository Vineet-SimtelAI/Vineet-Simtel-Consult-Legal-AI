"use client"

import { Suspense, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Scale, Phone, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/stores/auth-store"
import { useSearchParams } from "next/navigation"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"

function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const login = useAuthStore((state) => state.login)

  // mode: "start" | "otp"
  const [mode, setMode] = useState<"start" | "otp">("start")
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [otp, setOtp] = useState("")
  const [isNewUser, setIsNewUser] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")

  // Load and initialize Google Identity Services script
  useEffect(() => {
    if (mode !== "start") return

    const initGoogle = () => {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      const google = (window as any).google
      if (google && clientId) {
        google.accounts.id.initialize({
          client_id: clientId,
          ux_mode: "popup",
          callback: async (response: { credential: string }) => {
            setGoogleLoading(true)
            setError("")
            try {
              // Decode JWT credential from Google
              const payload = JSON.parse(atob(response.credential.split(".")[1]))
              const res = await fetch(`${API_BASE}/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  googleId: payload.sub,
                  email: payload.email,
                  name: payload.name,
                  avatarUrl: payload.picture,
                }),
              })
              const data = await res.json()
              if (data.success && data.data?.user && data.data?.accessToken) {
                await authenticateAndRedirect(data.data.user, data.data.accessToken)
              } else {
                setError(data.error?.message || "Google sign-in failed. Please try again.")
              }
            } catch {
              setError("Google sign-in failed. Please try again.")
            } finally {
              setGoogleLoading(false)
            }
          },
        })

        const container = document.getElementById("google-button-container")
        if (container) {
          google.accounts.id.renderButton(container, {
            theme: "outline",
            size: "large",
            width: 384,
            text: "continue_with",
          })
        }
      }
    }

    if ((window as any).google) {
      initGoogle()
    } else {
      const script = document.createElement("script")
      script.src = "https://accounts.google.com/gsi/client"
      script.async = true
      script.defer = true
      script.onload = initGoogle
      document.head.appendChild(script)
      return () => {
        const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
        if (existingScript) {
          document.head.removeChild(existingScript)
        }
      }
    }
  }, [mode])

  const authenticateAndRedirect = async (userData: any, token: string) => {
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
    window.location.href = callbackUrl
  }

  // Step 1 — Send OTP
  const handleSendOtp = async () => {
    const cleaned = phone.trim()
    if (!cleaned) { setError("Please enter your phone number"); return }
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch(`${API_BASE}/auth/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleaned }),
      })
      const data = await res.json()
      if (data.success) {
        setIsNewUser(data.data?.isNewUser ?? false)
        setMode("otp")
      } else {
        setError(data.error?.message || "Failed to send OTP. Please try again.")
      }
    } catch {
      setError("Cannot reach server. Make sure the API is running.")
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2 — Verify OTP & login/register
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return
    if (isNewUser && !name.trim()) { setError("Please enter your name to register"); return }
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch(`${API_BASE}/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), otp, name: name.trim() || undefined }),
      })
      const data = await res.json()
      if (data.success && data.data?.user && data.data?.accessToken) {
        await authenticateAndRedirect(data.data.user, data.data.accessToken)
      } else {
        setError(data.error?.message || "Invalid OTP. Please try again.")
      }
    } catch {
      setError("Cannot reach server. Make sure the API is running.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink pt-16 px-4">
      <div className="w-full max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2.5">
              <Scale className="h-6 w-6 text-ivory/60" />
              <span className="text-lg font-medium text-ivory tracking-tight">Consult Legal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-ivory">
              {mode === "otp" ? "Verify your number" : "Legal Work, Perfected."}
            </h1>
            <p className="text-sm text-ivory/40">
              {mode === "otp"
                ? `OTP sent to ${phone}. Enter it below.`
                : "Create an account or sign in to continue."}
            </p>
          </div>

          {/* Feature badges — only on start screen */}
          {mode === "start" && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {["AI-generated clauses", "Risk analysis", "10+ document types"].map((f) => (
                <span key={f} className="px-2.5 py-1 rounded-sm bg-ivory/[0.04] text-ivory/30 text-xs">{f}</span>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-sm bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* ── STEP 1: Phone input ── */}
          {mode === "start" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-ivory/50 text-sm">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                  className="bg-ink-light border-white/[0.06] text-ivory placeholder:text-ivory/20 rounded-sm h-11"
                  autoFocus
                />
              </div>

              <Button
                onClick={handleSendOtp}
                disabled={!phone.trim() || isLoading}
                className="w-full h-11 bg-ivory text-ink rounded-sm hover:bg-ivory/90 font-medium"
              >
                {isLoading
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <><Phone className="h-4 w-4 mr-2" />Send OTP</>}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.06]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-ink px-3 text-ivory/20">OR</span>
                </div>
              </div>

              {/* Google Sign In container */}
              <div className="flex justify-center w-full">
                <div id="google-button-container" className="w-full min-h-[44px] flex justify-center items-center overflow-hidden rounded-sm" />
              </div>
            </div>
          )}

          {/* ── STEP 2: OTP + name (new user only) ── */}
          {mode === "otp" && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Development Mode Tip */}
              <div className="p-3 rounded-sm bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs leading-relaxed">
                ⚠️ <strong>Dev Mode:</strong> The OTP code is logged in the NestJS API terminal console since real SMS is production-only.
              </div>

              {/* New user — ask for name */}
              {isNewUser && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-ivory/50 text-sm">
                    Your Name <span className="text-ivory/30 text-xs">(new account)</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-ink-light border-white/[0.06] text-ivory placeholder:text-ivory/20 rounded-sm h-11"
                    autoFocus
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="otp" className="text-ivory/50 text-sm">6-digit OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="• • • • • •"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  onKeyDown={(e) => e.key === "Enter" && otp.length === 6 && handleVerifyOtp()}
                  maxLength={6}
                  className="bg-ink-light border-white/[0.06] text-ivory placeholder:text-ivory/20 rounded-sm h-11 text-center text-lg tracking-[0.5em] font-mono"
                  autoFocus
                />
              </div>

              <Button
                onClick={handleVerifyOtp}
                disabled={otp.length !== 6 || isLoading || (isNewUser && !name.trim())}
                className="w-full h-11 bg-ivory text-ink rounded-sm hover:bg-ivory/90 font-medium"
              >
                {isLoading
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : isNewUser ? "Create Account & Login" : "Verify & Login"}
              </Button>

              <button
                onClick={() => { setMode("start"); setOtp(""); setError("") }}
                className="flex items-center gap-1.5 text-xs text-ivory/30 hover:text-ivory/60 transition-colors mx-auto"
              >
                <ArrowLeft className="h-3 w-3" /> Change number
              </button>
            </motion.div>
          )}

          <p className="text-center text-xs text-ivory/20">
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline underline-offset-2 hover:text-ivory/40">Terms</a>
            {" & "}
            <a href="/privacy" className="underline underline-offset-2 hover:text-ivory/40">Privacy Policy</a>
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
