"use client"

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import { MessageSquare, X, Send, Bot, User } from 'lucide-react'
import { GlassCard } from './ui/glass-card'
import { Button } from './ui/button'

interface AIGuideProps {
  cityContext: string
  userLocation?: { latitude: number; longitude: number }
  themeClass?: string
}

export function AIGuide({ cityContext, userLocation, themeClass = "text-primary" }: AIGuideProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const transport = useMemo(() => new DefaultChatTransport({
    api: '/api/chat',
    body: {
      cityContext,
      userLocation
    }
  }), [cityContext, userLocation])

  const [input, setInput] = useState('')
  const { messages, sendMessage, status } = useChat({
    transport
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage({ text: input })
    setInput('')
  }

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-black shadow-[0_0_20px_rgba(var(--primary),0.5)] hover:shadow-[0_0_30px_rgba(var(--primary),0.8)] transition-shadow"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Chat Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96"
          >
            <GlassCard glowColor="primary" className="h-[500px] flex flex-col p-0 overflow-hidden border-white/20">
              
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
                <div className="flex items-center gap-2">
                  <Bot className={`w-5 h-5 ${themeClass}`} />
                  <h3 className="font-bold text-lg">AI Local Guide</h3>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-white/50 space-y-3">
                    <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">Hi! I'm your AI guide for {cityContext}.</p>
                    <p className="text-xs">Ask me for recommendations, hidden gems, or romantic spots!</p>
                  </div>
                ) : (
                  messages.map(m => (
                    <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${m.role === 'user' ? 'bg-primary text-black' : 'bg-black/50 border border-white/10'}`}>
                        {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`text-sm px-4 py-2 rounded-2xl max-w-[80%] ${
                        m.role === 'user' 
                          ? 'bg-primary text-black rounded-tr-none' 
                          : 'bg-white/10 border border-white/5 rounded-tl-none whitespace-pre-wrap'
                      }`}>
                        {m.parts?.map(p => p.type === 'text' ? p.text : '').join('') || ''}
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="text-sm px-4 py-3 rounded-2xl bg-white/10 border border-white/5 rounded-tl-none flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-white/10 bg-black/40">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask about places..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  <Button type="submit" disabled={isLoading || !input.trim()} className="rounded-full w-10 h-10 p-0 shrink-0">
                    <Send className="w-4 h-4 ml-0.5" />
                  </Button>
                </form>
              </div>

            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
