"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Bot, User, Zap, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

const suggestedQuestions = [
  "What are the key clauses in an NDA?",
  "How to draft an employment agreement in India?",
  "What are the legal requirements for a startup?",
  "Explain non-compete clauses in India",
]

export default function DashboardChatPage() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return
    setMessages((prev) => [...prev, { role: "user", content: input }])
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "This is a demo response. In the full version, this would be powered by GPT-4 and provide context-aware legal guidance based on Indian legal frameworks." },
      ])
    }, 1000)
    setInput("")
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">AI Legal Chat</h1>
          <p className="text-sm text-muted-foreground">Ask any legal question — powered by GPT-4</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal/10 border border-teal/20">
          <Zap className="h-4 w-4 text-teal" />
          <span className="text-sm font-medium text-teal">25 credits</span>
        </div>
      </div>

      {/* Chat area */}
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
            messages.map((msg, i) => (
              <motion.div
                key={i}
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
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-teal/20 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-teal" />
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a legal question..."
              className="flex-1"
            />
            <Button type="submit" size="icon" className="bg-teal hover:bg-teal-dark text-white shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            AI provides general legal information, not legal advice. Consult a lawyer for specific situations.
          </p>
        </div>
      </Card>
    </div>
  )
}
