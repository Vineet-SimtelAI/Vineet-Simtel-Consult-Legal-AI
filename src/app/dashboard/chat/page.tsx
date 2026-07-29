"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send, Bot, User, Zap, Plus, MessageSquare,
  Copy, Check, RefreshCw, AlertTriangle, Scale,
  Lightbulb, FileText, Shield, Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { useAuthStore } from "@/stores/auth-store"
import { useChatStore } from "@/stores/chat-store"
import { useSocket } from "@/hooks/use-socket"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"
const LOW_CREDIT_THRESHOLD = 10

const suggestedQuestions = [
  { icon: FileText, text: "What are the key clauses in an NDA?" },
  { icon: Building2, text: "How to incorporate a private limited company in India?" },
  { icon: Shield, text: "What are tenant rights under the Rent Control Act?" },
  { icon: Scale, text: "What is Section 498A of the Indian Penal Code?" },
  { icon: Lightbulb, text: "How do I file an RTI application?" },
  { icon: FileText, text: "Explain non-compete clauses under Indian law" },
]

interface ConversationItem {
  _id: string
  title: string
  creditsUsed: number
  createdAt: string
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: Date
  metadata?: { legalReferences?: Array<{ act: string; section: string }> }
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date)
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={handleCopy}
      title="Copy message"
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}

export default function DashboardChatPage() {
  const { user, token } = useAuthStore()
  const { messages, activeConversation, setMessages, addMessage, setActiveConversation } = useChatStore()
  const { joinConversation } = useSocket()
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [streamingId, setStreamingId] = useState<string | null>(null)
  const [conversationList, setConversationList] = useState<ConversationItem[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const credits = user?.creditBalance ?? 0
  const isLowCredits = credits > 0 && credits <= LOW_CREDIT_THRESHOLD

  // Load conversations list
  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch(`${API_BASE}/chat/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) setConversationList(data.data.conversations)
      } catch { /* silent */ }
    }
    if (token) fetchConversations()
  }, [token])

  // Auto scroll — scroll WITHIN the messages container, not the whole page
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" })
  }, [messages, isLoading])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [input])

  const handleSend = useCallback(async (overrideContent?: string) => {
    const userContent = overrideContent ?? input.trim()
    if (!userContent || isLoading) return

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: userContent,
      createdAt: new Date(),
    }
    addMessage(userMsg)
    if (!overrideContent) setInput("")
    setIsLoading(true)

    const contextMessages = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: userContent },
    ]

    const aiMsgId = `ai_${Date.now()}`
    // Optimistically add empty AI message for streaming
    addMessage({ id: aiMsgId, role: "assistant", content: "", createdAt: new Date() })
    setStreamingId(aiMsgId)

    abortRef.current = new AbortController()

    try {
      const res = await fetch("/api/chat?stream=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: contextMessages }),
        signal: abortRef.current.signal,
      })

      if (!res.ok || !res.body) {
        const errData = await res.json().catch(() => ({}))
        throw new Error((errData as { error?: string }).error || `API error ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          const payload = line.slice(6).trim()
          if (payload === "[DONE]") break
          try {
            const parsed = JSON.parse(payload)
            if (parsed.delta) {
              accumulated += parsed.delta
              // Update the message content live
              useChatStore.getState().updateMessage?.(aiMsgId, accumulated)
            }
          } catch { /* malformed chunk */ }
        }
      }

      // Persist to backend if logged in
      if (token) {
        let convId = activeConversation
        if (!convId) {
          try {
            const convRes = await fetch(`${API_BASE}/chat/conversations`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({}),
            })
            const convData = await convRes.json()
            if (convData.success && convData.data) {
              convId = convData.data._id
              setActiveConversation(convId)
              joinConversation(convId!)
              setConversationList((prev) => [
                { _id: convData.data._id, title: userContent.slice(0, 50), creditsUsed: 0, createdAt: new Date().toISOString() },
                ...prev,
              ])
            }
          } catch { /* backend unavailable */ }
        }
      }
    } catch (err: unknown) {
      if ((err as Error)?.name === "AbortError") return
      const errMsg = err instanceof Error ? err.message : "Unknown error"
      useChatStore.getState().updateMessage?.(aiMsgId, `⚠️ Could not get a response: ${errMsg}. Please try again.`)
    } finally {
      setIsLoading(false)
      setStreamingId(null)
      abortRef.current = null
    }
  }, [input, isLoading, messages, token, activeConversation, addMessage, setActiveConversation, joinConversation])

  const handleRegenerate = useCallback(() => {
    // Find the last user message and resend it
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")
    if (!lastUserMsg) return
    // Remove the last AI response from the store, then re-send
    const withoutLastAi = messages.filter((m, i) => {
      if (m.role === "assistant") {
        const isLast = messages.slice(i + 1).every((x) => x.role !== "assistant")
        return !isLast
      }
      return true
    })
    setMessages(withoutLastAi)
    handleSend(lastUserMsg.content)
  }, [messages, handleSend, setMessages])

  const handleSelectConversation = async (convId: string) => {
    setActiveConversation(convId)
    joinConversation(convId)
    try {
      const res = await fetch(`${API_BASE}/chat/conversations/${convId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success && data.data?.messages) {
        setMessages(
          data.data.messages.map((m: { _id: string; role: "user" | "assistant"; content: string; createdAt: string; metadata?: ChatMessage["metadata"] }) => ({
            id: m._id,
            role: m.role,
            content: m.content,
            createdAt: new Date(m.createdAt),
            metadata: m.metadata,
          }))
        )
      }
    } catch {
      setMessages([])
    }
  }

  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === "assistant")

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4 min-h-0">
      {/* Conversations Sidebar */}
      <div className="hidden lg:flex w-64 flex-col border border-border/50 rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm">
        <div className="p-3 border-b border-border/50">
          <Button
            size="sm"
            className="w-full bg-teal hover:bg-teal-dark text-white gap-1.5 font-medium"
            onClick={() => { setActiveConversation(null); setMessages([]) }}
          >
            <Plus className="h-4 w-4" /> New Chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {conversationList.map((conv) => (
            <button
              key={conv._id}
              onClick={() => handleSelectConversation(conv._id)}
              className={`w-full text-left p-2.5 rounded-lg text-sm hover:bg-muted/70 transition-all duration-150 ${
                activeConversation === conv._id ? "bg-teal/10 text-teal border border-teal/20" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{conv.title}</span>
              </div>
            </button>
          ))}
          {conversationList.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-6">No conversations yet</p>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Legal Chat</h1>
            <p className="text-sm text-muted-foreground">Ask any legal question — powered by AI</p>
          </div>
          <div className="flex items-center gap-2">
            {isLowCredits && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-medium"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                Low credits!
              </motion.div>
            )}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
              credits === 0
                ? "bg-red-500/10 border-red-500/30 text-red-500"
                : "bg-teal/10 border-teal/20 text-teal"
            }`}>
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">{credits} credits</span>
            </div>
          </div>
        </div>

        {/* Zero credits banner */}
        {credits === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm"
          >
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>You have no credits left. Please top up to continue chatting.</span>
            <Button size="sm" variant="outline" className="ml-auto border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs">
              Top Up
            </Button>
          </motion.div>
        )}

        <Card className="flex-1 flex flex-col border-border/50 overflow-hidden bg-card/50 backdrop-blur-sm min-h-0">
          {/* Messages area */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-5 min-h-0">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center h-full text-center gap-6 px-4"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-teal/10 border border-teal/20 flex items-center justify-center shadow-lg">
                    <Scale className="h-10 w-10 text-teal" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-teal flex items-center justify-center">
                    <Lightbulb className="h-3 w-3 text-white" />
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">AI Legal Assistant</h2>
                  <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                    Get instant answers about Indian law — NDAs, contracts, corporate compliance, tenant rights, and more.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
                  {suggestedQuestions.map(({ icon: Icon, text }) => (
                    <button
                      key={text}
                      onClick={() => setInput(text)}
                      className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl border border-border hover:border-teal/40 hover:bg-teal/5 text-left text-xs text-muted-foreground hover:text-foreground transition-all duration-200 group"
                    >
                      <Icon className="h-3.5 w-3.5 mt-0.5 shrink-0 text-teal/60 group-hover:text-teal transition-colors" />
                      <span>{text}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex gap-3 group ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-lg bg-teal/10 border border-teal/20 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="h-4 w-4 text-teal" />
                      </div>
                    )}

                    <div className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"} max-w-[75%]`}>
                      {/* Message bubble */}
                      <div
                        className={`relative p-3.5 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-teal text-white rounded-tr-sm"
                            : "bg-muted/70 rounded-tl-sm border border-border/40"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-li:my-0.5 prose-code:bg-black/20 prose-code:px-1 prose-code:rounded prose-code:text-xs prose-pre:bg-black/30 prose-pre:rounded-lg">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.content || (streamingId === msg.id ? "▋" : "")}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        )}

                        {/* Legal references */}
                        {msg.metadata?.legalReferences && msg.metadata.legalReferences.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">References</p>
                            {msg.metadata.legalReferences.map((ref, i) => (
                              <p key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                                <Scale className="h-3 w-3 shrink-0" />
                                {ref.act}, {ref.section}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions row */}
                      <div className={`flex items-center gap-2 px-1 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                        <span className="text-[10px] text-muted-foreground/60">{formatTime(msg.createdAt)}</span>
                        <CopyButton text={msg.content} />
                        {/* Regenerate button on last AI message */}
                        {msg.role === "assistant" && index === messages.length - 1 && !isLoading && (
                          <button
                            onClick={handleRegenerate}
                            title="Regenerate response"
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-lg bg-teal/20 border border-teal/30 flex items-center justify-center shrink-0 mt-1">
                        <User className="h-4 w-4 text-teal" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {/* Typing indicator (shows only if loading but no streaming content yet) */}
            {isLoading && !streamingId && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-teal/10 border border-teal/20 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-teal animate-pulse" />
                </div>
                <div className="bg-muted/70 border border-border/40 px-4 py-3 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1.5 items-center h-4">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="w-2 h-2 bg-teal/50 rounded-full animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

          </div>

          {/* Input area */}
          <div className="p-4 border-t border-border/50 bg-card/80">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend() }}
              className="flex gap-2 items-end"
            >
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Ask a legal question… (Shift+Enter for new line)"
                className="flex-1 resize-none min-h-[44px] max-h-[160px] text-sm py-2.5 px-3 bg-background/60 border-border/50 focus-visible:ring-teal/30"
                disabled={isLoading || credits === 0}
                rows={1}
              />
              <Button
                type="submit"
                size="icon"
                className="bg-teal hover:bg-teal-dark text-white shrink-0 h-11 w-11 rounded-xl shadow-md transition-all hover:shadow-teal/25 hover:shadow-lg"
                disabled={isLoading || !input.trim() || credits === 0}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-[10px] text-muted-foreground/70 mt-2 text-center">
              AI provides general legal information, not legal advice. 1 credit per message. Consult a lawyer for specific situations.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
