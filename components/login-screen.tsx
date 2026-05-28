'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircleHeart } from 'lucide-react'
import { unlockAudio, playSound } from '@/lib/sounds'

interface LoginScreenProps {
  onLogin: () => void
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [showModal, setShowModal] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setError('')
    
    if (username === 'Anonim' && password === 'ALYIFOREVER') {
      playSound('success')
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1500))
      onLogin()
    } else {
      playSound('error')
      setError('Kullanici adi veya sifre hatali')
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div 
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#00D2FF]/10"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-[#00D2FF]/5"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Help button */}
      <div className="absolute top-4 right-4 flex items-center gap-2 text-gray-500 text-sm">
        <span>Yardım merkezi</span>
        <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-xs">
          i
        </div>
      </div>

      {/* Logo and mascot */}
      <motion.div 
        className="flex flex-col items-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Mascot illustration */}
        <div className="relative w-40 h-40 mb-6">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-[#7EE8FF] to-[#00D2FF] rounded-full opacity-30"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="absolute inset-2 bg-gradient-to-br from-[#B2F5FF] to-[#00D2FF] rounded-full flex items-center justify-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="relative">
                {/* Hand with heart */}
                <div className="text-6xl">👋</div>
                <motion.div 
                  className="absolute -top-2 -right-2"
                  animate={{ scale: [1, 1.2, 1], y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="bg-white rounded-lg p-2 shadow-lg">
                    <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* App name */}
        <motion.h1 
          className="text-3xl font-bold text-gray-800 mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Litmatch
        </motion.h1>
        <motion.p 
          className="text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Make new friends
        </motion.p>
      </motion.div>

      {/* Login button — hidden while modal is open to avoid overlapping the modal submit button */}
      {!showModal && (
        <motion.button
          onClick={() => {
            unlockAudio()
            playSound('tap')
            playSound('modalOpen', 0.7)
            setShowModal(true)
          }}
          className="w-full max-w-xs bg-[#00D2FF] text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:bg-[#00A8CC] transition-colors flex items-center justify-center gap-3 relative z-10 cursor-pointer touch-manipulation"
          style={{ WebkitTapHighlightColor: 'transparent' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <MessageCircleHeart className="w-5 h-5" />
          Giris Yap
        </motion.button>
      )}

      {/* Divider */}
      <motion.div 
        className="flex items-center gap-4 my-6 w-full max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-gray-400 text-sm">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </motion.div>

      <motion.div
        className="text-2xl opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.7 }}
      >
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      </motion.div>

      {/* Footer text */}
      <motion.p 
        className="absolute bottom-6 text-xs text-gray-400 text-center px-4 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Kaydolarak, Kullanim Kosullarini, Gizlilik Ilkesi ve Cookies<br />
        Politikasi okudugunuzu ve kabul ettiginizi belirtmis olursunuz.
      </motion.p>

      {/* Login Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              playSound('tap', 0.6)
              setShowModal(false)
            }}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#7EE8FF] to-[#00D2FF] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Giris Yap</h2>
                <p className="text-gray-500 text-sm mt-1">Hesabina giris yap</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kullanici Adi
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00D2FF] focus:border-transparent transition-all text-gray-800"
                    placeholder="Kullanici adini gir"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sifre
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00D2FF] focus:border-transparent transition-all text-gray-800"
                    placeholder="Sifreni gir"
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>

                {error && (
                  <motion.p
                    className="text-red-500 text-sm text-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.p>
                )}

                <motion.button
                  onClick={() => {
                    unlockAudio()
                    playSound('tap')
                    handleLogin()
                  }}
                  disabled={isLoading}
                  className="w-full bg-[#00D2FF] text-white font-semibold py-4 rounded-xl hover:bg-[#00A8CC] transition-colors disabled:opacity-70"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <motion.div
                      className="flex items-center justify-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Giris yapiliyor...</span>
                    </motion.div>
                  ) : (
                    'Giris Yap'
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
