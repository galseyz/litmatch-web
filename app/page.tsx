'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LoginScreen from '@/components/login-screen'
import ChatList from '@/components/chat-list'
import ChatConversation from '@/components/chat-conversation'
import CelebrationStory from '@/components/celebration-story'
import { playSound } from '@/lib/sounds'

type Screen = 'login' | 'chatList' | 'conversation' | 'celebration' | 'end'

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login')

  return (
    <div className="h-[100dvh] bg-white overflow-hidden">
      <AnimatePresence mode="wait">
        {currentScreen === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoginScreen onLogin={() => setCurrentScreen('chatList')} />
          </motion.div>
        )}

        {currentScreen === 'chatList' && (
          <motion.div
            key="chatList"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <ChatList onOpenChat={() => setCurrentScreen('conversation')} />
          </motion.div>
        )}

        {currentScreen === 'conversation' && (
          <motion.div
            key="conversation"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            {/* No onBack - chat is locked, user cannot go back */}
            <ChatConversation 
              onCelebrate={() => setCurrentScreen('celebration')}
            />
          </motion.div>
        )}

        {currentScreen === 'celebration' && (
          <CelebrationStory onComplete={() => setCurrentScreen('end')} />
        )}

        {currentScreen === 'end' && (
          <motion.div
            key="end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-br from-[#00D2FF] via-pink-500 to-purple-600 flex items-center justify-center p-8"
          >
            <div className="text-center">
              <motion.div
                className="text-8xl mb-8"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💕
              </motion.div>
              <motion.h1 
                className="text-white text-2xl md:text-3xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Seni cok seviyorum
              </motion.h1>
              <motion.p 
                className="text-white/80 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Nice mutlu aylara...
              </motion.p>

              <motion.button
                onClick={() => {
                  playSound('tap')
                  setCurrentScreen('login')
                }}
                className="mt-12 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full border border-white/30 hover:bg-white/30 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Tekrar Izle
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
