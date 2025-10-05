"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, Send, X, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import ReactMarkdown from "react-markdown"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function ZofiaChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight
      }
    }
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { 
      role: "user", 
      content: input.trim(),
      timestamp: new Date()
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/zofia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      })

      const data = await response.json()
      const assistantMessage: Message = {
        role: "assistant",
        content: data.answer || "Przepraszam, nie mogłam przetworzyć tego zapytania.",
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Wystąpił błąd podczas łączenia z serwerem. Spróbuj ponownie.",
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-2 right-2 h-16 w-16 rounded-full shadow-2xl hover:shadow-[0_20px_50px_rgba(0,153,63,0.3)] transition-shadow duration-300 bg-gradient-to-br from-[#00993F] to-[#007A32] text-white z-50 flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {isOpen ? (
            <X className="h-7 w-7" />
          ) : (
            <>
              <MessageCircle className="h-7 w-7" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#3F84D2] rounded-full animate-pulse" />
            </>
          )}
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 right-6 w-[calc(100vw-3rem)] sm:w-[420px] h-[520px] max-h-[calc(100vh-8rem)] rounded-2xl overflow-hidden shadow-2xl z-40 flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
          >
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white dark:bg-gray-900 border-r border-b border-gray-200 dark:border-gray-800 transform rotate-45" />

            <div className="px-5 py-4 bg-gradient-to-r from-[#00993F] via-[#00A847] to-[#3F84D2] text-white shadow-md relative z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-11 w-11 border-2 border-white/30 shadow-lg">
                    <AvatarFallback className="bg-white text-[#00993F] font-bold text-lg">
                      Z
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 border-2 border-white rounded-full" />
                </div>
                <div className="flex-1">
                  <h2 className="text-white text-base font-semibold flex items-center gap-1.5">
                    Zofia.AI
                    <Sparkles className="h-3.5 w-3.5 text-yellow-200" />
                  </h2>
                  <p className="text-white/90 text-xs font-normal leading-tight">
                    Twój spokojny głos rozsądku o przyszłości
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white hover:bg-white/20 h-8 w-8 rounded-full transition-colors flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

          <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-950" ref={scrollRef}>
            <ScrollArea className="h-full w-full">
              <div className="px-4 py-6 space-y-6">
              {messages.length === 0 && (
                <div className="text-center py-16 animate-in fade-in slide-in-from-bottom-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#00993F] to-[#3F84D2] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <MessageCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Witaj w Zofia.AI
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 max-w-[280px] mx-auto">
                    Jestem Twoją asystentką ZUS. Pomogę Ci zrozumieć emerytury, świadczenia i składki.
                  </p>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 animate-in fade-in slide-in-from-bottom-2 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <Avatar className="h-7 w-7 bg-[#00993F] flex-shrink-0 shadow-sm mt-1">
                      <AvatarFallback className="bg-[#00993F] text-white text-xs font-semibold">
                        Z
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className={`rounded-2xl px-4 py-2.5 max-w-[300px] shadow-sm ${
                        msg.role === "user"
                          ? "bg-[#00993F] text-white rounded-tr-md"
                          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-tl-md"
                      }`}
                    >
                      <div className="text-sm leading-relaxed">
                        {msg.role === "assistant" ? (
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc ml-4 mb-3 space-y-1">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal ml-4 mb-3 space-y-1">{children}</ol>,
                              li: ({ children }) => <li>{children}</li>,
                              strong: ({ children }) => <strong className="font-semibold text-[#00993F] dark:text-[#00B84D]">{children}</strong>,
                              em: ({ children }) => <em className="italic">{children}</em>,
                              code: ({ children }) => (
                                <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs font-mono">
                                  {children}
                                </code>
                              ),
                              h3: ({ children }) => <h3 className="font-semibold mb-2 text-base">{children}</h3>,
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-2 border-[#00993F] pl-3 italic my-2">
                                  {children}
                                </blockquote>
                              ),
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        ) : (
                          <p>{msg.content}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500 dark:text-gray-500 px-1">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 animate-in fade-in slide-in-from-bottom-2">
                  <Avatar className="h-7 w-7 bg-[#00993F] flex-shrink-0 shadow-sm mt-1">
                    <AvatarFallback className="bg-[#00993F] text-white text-xs font-semibold">
                      Z
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl rounded-tl-md px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex gap-1.5 items-center">
                      <div className="w-2 h-2 bg-[#00993F] rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-[#00993F] rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-[#00993F] rounded-full animate-bounce [animation-delay:0.4s]" />
                      <span className="text-xs text-gray-500 ml-2">Zofia myśli...</span>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </ScrollArea>
          </div>

            <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-3.5 bg-white dark:bg-gray-900">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Napisz pytanie..."
                  disabled={isLoading}
                  className="flex-1 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus-visible:ring-[#00993F] rounded-xl"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="bg-gradient-to-r from-[#00993F] to-[#007A32] hover:from-[#007A32] hover:to-[#00993F] text-white rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 h-10 w-10"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-2 text-center">
                Naciśnij <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-mono border border-gray-300 dark:border-gray-700">Enter</kbd> aby wysłać
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

