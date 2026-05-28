'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Video, MoreVertical, Send, Image, Mic, Smile } from 'lucide-react'
import { initialConversation, scrollSimulationMessages, finalConversation, type ChatMessage } from '@/lib/chat-data'
import { playMessageSound, playSound } from '@/lib/sounds'

interface ChatConversationProps {
  onCelebrate: () => void
}

export default function ChatConversation({ onCelebrate }: ChatConversationProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [partnerName, setPartnerName] = useState('yagiv2')
  const [showCelebrateButton, setShowCelebrateButton] = useState(false)
  const [phase, setPhase] = useState<'initial' | 'scrolling' | 'final'>('initial')
  const [scrollMessages, setScrollMessages] = useState<ChatMessage[]>([])
  const [finalIndex, setFinalIndex] = useState(0)
  const [finalReady, setFinalReady] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasMergedScrollMessagesRef = useRef(false)

  const getFinalMessageDelay = (msg: ChatMessage) => {
    if (msg.message.includes('1. Ayiniz')) return 5500
    if (msg.kind === 'date') return 2400
    if (msg.sender === 'system') return 3000
    if (msg.sender === 'yagiv2') return 2800
    return 2500
  }

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const el = containerRef.current
    if (!el) return
    // rAF ensures DOM has painted new messages before measuring scrollHeight.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.scrollTo({ top: el.scrollHeight, behavior })
      })
    })
  }, [])

  useEffect(() => {
    scrollToBottom(phase === 'scrolling' ? 'auto' : 'smooth')
  }, [messages, isTyping, scrollMessages, phase, scrollToBottom])

  // Initial conversation phase - slower timing
  useEffect(() => {
    if (phase !== 'initial') return
    if (currentIndex >= initialConversation.length) {
      // Start fast scroll simulation
      setTimeout(() => {
        setPhase('scrolling')
      }, 1500)
      return
    }

    const currentMessage = initialConversation[currentIndex]
    // Normal chat: slower at start (fast only during scroll simulation).
    let delay =
      currentMessage.sender === 'yagiv2'
        ? 3200 + Math.random() * 1800
        : 2200 + Math.random() * 1200

    // After login, the very first incoming message should arrive a bit later.
    if (currentIndex === 0 && currentMessage.sender === 'yagiv2') {
      delay += 1500
    }

    if (currentMessage.sender === 'yagiv2') {
      setIsTyping(true)
      const typingTimeout = setTimeout(() => {
        setIsTyping(false)
        playMessageSound(currentMessage.sender, 'initial')
        setMessages(prev => [...prev, currentMessage])
        setCurrentIndex(prev => prev + 1)
      }, delay)
      return () => clearTimeout(typingTimeout)
    } else {
      const timeout = setTimeout(() => {
        playMessageSound(currentMessage.sender, 'initial')
        setMessages(prev => [...prev, currentMessage])
        setCurrentIndex(prev => prev + 1)
      }, delay)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, phase])

  // Fast scroll simulation phase
  useEffect(() => {
    if (phase !== 'scrolling') return

    let msgIndex = 0
    const totalScrollMessages = scrollSimulationMessages.length

    const addMessage = () => {
      if (msgIndex >= totalScrollMessages) {
        setTimeout(() => setPhase('final'), 1200)
        return
      }

      const progress = msgIndex / totalScrollMessages
      // Speed: very fast at start, slightly slower near the end
      const nextDelay = progress > 0.85 ? 160 : progress > 0.7 ? 90 : progress > 0.5 ? 55 : 30

      const msg = scrollSimulationMessages[msgIndex]
      if (msg) {
        playMessageSound(msg.sender, 'scrolling')
        setScrollMessages(prev => [...prev, { ...msg, id: msg.id + msgIndex * 1000 }])
      }
      msgIndex++

      setTimeout(addMessage, nextDelay)
    }

    addMessage()
  }, [phase])

  // When fast-scroll ends, merge those messages into the main timeline once.
  // Otherwise final/system messages can appear "above" the fast-scroll batch.
  useEffect(() => {
    if (phase !== 'final') return
    if (hasMergedScrollMessagesRef.current) return
    if (scrollMessages.length === 0) {
      hasMergedScrollMessagesRef.current = true
      return
    }

    hasMergedScrollMessagesRef.current = true
    setMessages(prev => [...prev, ...scrollMessages])
    setScrollMessages([])
  }, [phase, scrollMessages])

  // Pause before final messages start (after fast-scroll batch)
  useEffect(() => {
    if (phase !== 'final') {
      setFinalReady(false)
      return
    }
    const timer = setTimeout(() => setFinalReady(true), 2800)
    return () => clearTimeout(timer)
  }, [phase])

  // Final conversation phase - slower timing
  useEffect(() => {
    if (phase !== 'final' || !finalReady) return

    if (finalIndex >= finalConversation.length) {
      setTimeout(() => setShowCelebrateButton(true), 2000)
      return
    }

    const msg = finalConversation[finalIndex]
    if (!msg) return

    // Check for name change system message
    if (msg.sender === 'system' && msg.message.includes('Yigidomm')) {
      setPartnerName('Yigidomm')
    }

    const delay = getFinalMessageDelay(msg)

    const timeout = setTimeout(() => {
      playMessageSound(msg.sender, 'final')
      setMessages(prev => [...prev, msg])
      setFinalIndex(prev => prev + 1)
    }, delay)

    return () => clearTimeout(timeout)
  }, [phase, finalReady, finalIndex])

  const allVisibleMessages = [...messages, ...scrollMessages].filter(Boolean)

  return (
    <div className="h-[100dvh] bg-white flex flex-col w-full max-w-md mx-auto overflow-hidden">
      {/* Header - No back button */}
      <motion.div 
        className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white safe-area-top flex-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* No back button - chat is locked */}
        <div className="w-6" />
        
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-300 to-rose-400 flex items-center justify-center text-xl">
          🐸
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        </div>

        <div className="flex-1">
          <motion.h2 
            className="font-semibold text-gray-800"
            key={partnerName}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {partnerName}
          </motion.h2>
          <p className="text-xs text-green-500">Cevrimici</p>
        </div>

        <div className="flex items-center gap-4">
          <Phone className="w-5 h-5 text-gray-500" />
          <Video className="w-5 h-5 text-gray-500" />
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </div>
      </motion.div>

      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50 overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <AnimatePresence mode="popLayout">
          {allVisibleMessages.map((msg, index) => (
            <motion.div
              key={`msg-${msg.id}-${index}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                type: 'spring', 
                damping: 25, 
                stiffness: 300,
                duration: phase === 'scrolling' ? 0.1 : 0.3
              }}
              className={`mb-2 ${
                msg.sender === 'system' ? 'flex justify-center' :
                msg.sender === 'anonim' ? 'flex justify-end' : 'flex justify-start'
              }`}
            >
              {msg.sender === 'system' ? (
                msg.kind === 'date' ? (
                  <div className="w-full flex items-center gap-3 py-2">
                    <div className="flex-1 h-px bg-gray-300/70" />
                    <div className="text-xs text-gray-500 font-medium tracking-wide">
                      {msg.message}
                    </div>
                    <div className="flex-1 h-px bg-gray-300/70" />
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-[#00D2FF]/20 to-pink-200/30 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                    {msg.message}
                  </div>
                )
              ) : (
                <div className={`max-w-[75%] ${
                  msg.sender === 'anonim' 
                    ? 'bg-[#00D2FF] text-white rounded-2xl rounded-br-md' 
                    : 'bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm'
                } px-4 py-2.5`}>
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                  <p className={`text-[10px] mt-1 ${
                    msg.sender === 'anonim' ? 'text-white/70' : 'text-gray-400'
                  }`}>
                    {msg.timestamp}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex justify-start mb-3"
            >
              <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm px-4 py-3">
                <div className="flex gap-1">
                  <motion.div 
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div 
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div 
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrolling indicator */}
        <AnimatePresence>
          {phase === 'scrolling' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm z-10"
            >
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                Binlerce mesaj...
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Celebrate button */}
        <AnimatePresence>
          {showCelebrateButton && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center mt-6"
            >
              <motion.div
                className="w-full max-w-sm overflow-hidden rounded-xl shadow-lg bg-gradient-to-r from-[#6b2030] to-[#3b2530] text-white"
                animate={{
                  boxShadow: [
                    '0 10px 25px rgba(0,0,0,0.18)',
                    '0 14px 34px rgba(0,0,0,0.22)',
                    '0 10px 25px rgba(0,0,0,0.18)',
                  ],
                }}
                transition={{ duration: 2.2, repeat: Infinity }}
              >
                <div className="px-4 pt-3 pb-3">
                  <div className="flex gap-3">
                    <div className="mt-0.5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-none">
                      <span className="text-lg">💐</span>
                    </div>
                    <div className="text-[11px] leading-snug text-white/85">
                      <p className="font-semibold text-white/90 mb-1">
                        Tebrikler, 1 Ay kilidini actik :O (Ac).
                      </p>
                      <p>
                        Birine içini açmak büyük cesaret ama seninle bunu yapmak çok kolaydı.
                        bir ayda birbirimize çok şey kattık, çok yaklaştık.
                        Bu seruvende ikimizin de emegini tebrik etmek lazim!
                        Hadi asagidaki butona bas!
                      </p>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={() => {
                    playSound('celebrate')
                    onCelebrate()
                  }}
                  className="w-full bg-[#ff7aa6] text-white font-semibold py-3 text-sm"
                  whileTap={{ scale: 0.99 }}
                >
                  Bu anı tebrik edelim!
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input bar */}
      <motion.div 
        className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 bg-white safe-area-bottom flex-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button className="p-2 text-gray-400">
          <Smile className="w-6 h-6" />
        </button>
        <div className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 flex items-center">
          <input
            type="text"
            placeholder="Mesaj yaz..."
            className="bg-transparent flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
            disabled
          />
        </div>
        <button className="p-2 text-gray-400">
          <Image className="w-6 h-6" />
        </button>
        <button className="p-2 text-gray-400">
          <Mic className="w-6 h-6" />
        </button>
        <button className="p-2 text-[#00D2FF]">
          <Send className="w-6 h-6" />
        </button>
      </motion.div>
    </div>
  )
}
