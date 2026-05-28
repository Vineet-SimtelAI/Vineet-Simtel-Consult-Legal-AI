"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Send, Bot, User, Zap, Sparkles, Plus, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuthStore } from "@/stores/auth-store"
import { useChatStore } from "@/stores/chat-store"
import { useSocket } from "@/hooks/use-socket"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"

const suggestedQuestions = [
  "What are the key clauses in an NDA?",
  "How to draft an employment agreement in India?",
  "What are the legal requirements for a startup?",
  "Explain non-compete clauses in India",
]

interface ConversationItem {
  _id: string
  title: string
  creditsUsed: number
  createdAt: string
}

export default function DashboardChatPage() {
  const { user, token, updateCredits } = useAuthStore()
  const { messages, activeConversation, setMessages, addMessage, updateMessage, setActiveConversation, setConversations } = useChatStore()
  const { joinConversation, sendMessage } = useSocket()
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationList, setConversationList] = useState<ConversationItem[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  // Load conversations list
  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch(`${API_BASE}/chat/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) {
          setConversationList(data.data.conversations)
        }
      } catch {
        // empty
      }
    }
    if (token) fetchConversations()
  }, [token])

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Create new conversation
  const createConversation = async () => {
    try {
      const res = await fetch(`${API_BASE}/chat/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      if (data.success && data.data) {
        setActiveConversation(data.data._id)
        setMessages([])
        joinConversation(data.data._id)
        setConversationList(prev => [{ _id: data.data._id, title: "New Conversation", creditsUsed: 0, createdAt: new Date().toISOString() }, ...prev])
        return data.data._id
      }
    } catch {
      // Fallback: create local conversation
      const localId = `local_${Date.now()}`
      setActiveConversation(localId)
      setMessages([])
      return localId
    }
    return null
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    let convId = activeConversation

    // Create conversation if none active
    if (!convId) {
      convId = await createConversation()
      if (!convId) return
    }

    // Add user message immediately
    const userMsg = {
      id: `msg_${Date.now()}`,
      role: "user" as const,
      content: input,
      createdAt: new Date(),
    }
    addMessage(userMsg)
    setInput("")
    setIsLoading(true)

    // Try Socket.io first, then REST fallback
    try {
      sendMessage(convId, input)
    } catch {
      // REST fallback
      try {
        const res = await fetch(`${API_BASE}/chat/conversations/${convId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ content: input }),
        })
        const data = await res.json()
        if (data.success && data.data?.assistantMessage) {
          const assistantMsg = {
            id: data.data.assistantMessage._id || `ai_${Date.now()}`,
            role: "assistant" as const,
            content: data.data.assistantMessage.content,
            createdAt: new Date(),
            metadata: data.data.assistantMessage.metadata,
          }
          addMessage(assistantMsg)
          if (data.data.creditBalance !== undefined) {
            updateCredits(data.data.creditBalance)
          }
        }
      } catch {
        // Final fallback: use AI SDK
        try {
          const aiRes = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: [...messages.map(m => ({ role: m.role, content: m.content })), { role: "user", content: input }] }),
          })
          if (aiRes.ok) {
            const aiData = await aiRes.json()
            addMessage({
              id: `ai_${Date.now()}`,
              role: "assistant",
              content: aiData.content || aiData.choices?.[0]?.message?.content || "I'm unable to respond right now. Please try again.",
              createdAt: new Date(),
            })
          }
        } catch {
          // Demo fallback
          addMessage({
            id: `ai_${Date.now()}`,
            role: "assistant",
            content: "I'm currently in demo mode. To get real AI-powered legal answers, please ensure the backend API and AI service are configured. This is a placeholder response that would normally contain detailed legal information based on Indian law.",
            createdAt: new Date(),
          })
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectConversation = async (convId: string) => {
    setActiveConversation(convId)
    joinConversation(convId)

    // Load messages for this conversation
    try {
      const res = await fetch(`${API_BASE}/chat/conversations/${convId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success && data.data?.messages) {
        setMessages(
          data.data.messages.map((m: any) => ({
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

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Conversations Sidebar */}
      <div className="hidden lg:flex w-64 flex-col border border-border rounded-xl overflow-hidden">
        <div className="p-3 border-b border-border">
          <Button
            size="sm"
            className="w-full bg-teal hover:bg-teal-dark text-white gap-1"
            onClick={() => { setActiveConversation(null); setMessages([]) }}
          >
            <Plus className="h-4 w-4" /> New Chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversationList.map((conv) => (
            <button
              key={conv._id}
              onClick={() => handleSelectConversation(conv._id)}
              className={`w-full text-left p-2 rounded-lg text-sm hover:bg-muted transition-colors ${
                activeConversation === conv._id ? "bg-teal/10 text-teal" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-3 w-3 shrink-0" />
                <span className="truncate">{conv.title}</span>
              </div>
            </button>
          ))}
          {conversationList.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">No conversations yet</p>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">AI Legal Chat</h1>
            <p className="text-sm text-muted-foreground">Ask any legal question — powered by AI</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal/10 border border-teal/20">
            <Zap className="h-4 w-4 text-teal" />
            <span className="text-sm font-medium text-teal">{user?.creditBalance ?? 0} credits</span>
          </div>
        </div>

        <Card className="flex-1 flex flex-col border-border/50 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-teal/10 flex items-center justify-center">
                  <Bot className="h-8 w-8 text-teal" />
                </div>
                <div>
                  <h2 className="text-lg font-bold mb-2">AI Legal Assistant</h2>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Get instant answers to your legal questions. Ask about NDAs, contracts, corporate law, compliance, and more.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 max-w-md">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="px-3 py-1.5 rounded-lg border border-border hover:border-teal/30 hover:bg-teal/5 text-xs text-muted-foreground hover:text-teal transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4 text-teal" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] p-3 rounded-xl text-sm ${
                      msg.role === "user"
                        ? "bg-teal text-white rounded-br-sm"
                        : "bg-muted rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                    {msg.metadata?.legalReferences && msg.metadata.legalReferences.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-border/50 space-y-1">
                        {msg.metadata.legalReferences.map((ref, i) => (
                          <p key={i} className="text-xs text-muted-foreground">
                            📖 {ref.act}, {ref.section}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-teal/20 flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-teal" />
                    </div>
                  )}
                </motion.div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-teal animate-pulse" />
                </div>
                <div className="bg-muted p-3 rounded-xl text-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend() }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a legal question..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" className="bg-teal hover:bg-teal-dark text-white shrink-0" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              AI provides general legal information, not legal advice. 1 credit per message. Consult a lawyer for specific situations.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
