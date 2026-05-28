'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Image, UserPlus, Home, Compass, MessageCircle, User } from 'lucide-react'
import { playSound } from '@/lib/sounds'

interface ChatListProps {
  onOpenChat: () => void
}

export default function ChatList({ onOpenChat }: ChatListProps) {
  const [showNotification, setShowNotification] = useState(false)
  const [notificationVisible, setNotificationVisible] = useState(false)

  // Show notification after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true)
      playSound('notification')
      setTimeout(() => setNotificationVisible(true), 100)
    }, 3500)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="h-[100dvh] bg-white flex flex-col w-full max-w-md mx-auto overflow-hidden">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between px-4 py-3 border-b border-gray-100 safe-area-top flex-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-8 h-8 flex items-center justify-center">
          <div className="text-2xl">👻</div>
        </div>
        <h1 className="text-lg font-bold text-gray-800">Chat</h1>
        <div className="flex items-center gap-3">
          <Image className="w-5 h-5 text-gray-600" />
          <UserPlus className="w-5 h-5 text-gray-600" />
        </div>
      </motion.div>

      {/* Search bar */}
      <motion.div 
        className="px-4 py-3 flex-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Chat History"
            className="bg-transparent flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
      </motion.div>

      {/* Chat list - empty initially, then notification drops */}
      <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
        {!showNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-64 text-gray-400"
          >
            <MessageCircle className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-sm">Henuz sohbet yok</p>
          </motion.div>
        )}

        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ 
                opacity: notificationVisible ? 1 : 0, 
                y: notificationVisible ? 0 : -50,
                scale: notificationVisible ? 1 : 0.8
              }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            >
              {/* Chat item - matching the Litmatch design exactly */}
              <motion.div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors active:bg-gray-100"
                onClick={() => {
                  playSound('tap')
                  onOpenChat()
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center overflow-hidden">
                    {/* Green frog/creature avatar like in reference */}
                    <span className="text-2xl">🐸</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Name row with badge */}
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">yagiv2</span>
                    <span className="text-xs text-white bg-[#00D2FF] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <span className="text-[10px]">♀</span>21
                    </span>
                  </div>
                  {/* Message preview */}
                  <p className="text-sm text-gray-500 truncate mt-0.5">
                    Merhaba de!.
                  </p>
                </div>
              
                {/* Time */}
                <div className="flex-shrink-0">
                  <span className="text-xs text-gray-400">09:20</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <motion.div 
        className="flex items-center justify-around py-3 border-t border-gray-100 bg-white safe-area-bottom flex-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <Home className="w-6 h-6" />
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <Compass className="w-6 h-6" />
        </button>
        <button className="flex flex-col items-center gap-1 text-[#00D2FF]">
          <MessageCircle className="w-6 h-6 fill-[#00D2FF]" />
        </button>
        <button className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full" />
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <User className="w-6 h-6" />
        </button>
      </motion.div>
    </div>
  )
}
