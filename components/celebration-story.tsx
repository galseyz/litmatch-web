'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, ChevronRight, ChevronLeft } from 'lucide-react'
import {
  statCards,
  celebrationMusicTracks,
  statsSummaryRows,
} from '@/lib/chat-data'
import { playSound } from '@/lib/sounds'
import CycleFinaleScreen from '@/components/cycle-finale-screen'

interface CelebrationStoryProps {
  onComplete: () => void
}

const FADE_MS = 900
const TARGET_VOLUME = 0.45

async function fadeVolume(
  audio: HTMLAudioElement,
  from: number,
  to: number,
  durationMs: number
): Promise<void> {
  const steps = 24
  const stepTime = durationMs / steps
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    audio.volume = from + (to - from) * t
    await new Promise(r => setTimeout(r, stepTime))
  }
}

export default function CelebrationStory({ onComplete }: CelebrationStoryProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showFinalMessage, setShowFinalMessage] = useState(false)
  const [showSummaryRecap, setShowSummaryRecap] = useState(false)
  const [showCycleFinale, setShowCycleFinale] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const slideAdvanceLockRef = useRef(false)
  const musicTrackIndexRef = useRef(-1)
  const isSwitchingMusicRef = useRef(false)

  const statSlideCount = statCards.length
  const finalSlideIndex = statSlideCount
  const totalProgressSlides = statSlideCount + 1

  const musicTrackIndex =
    currentSlide < statSlideCount
      ? Math.floor(currentSlide / 2) % celebrationMusicTracks.length
      : Math.floor((statSlideCount - 1) / 2) % celebrationMusicTracks.length

  const playTransitionSound = useCallback(() => {
    playSound('whoosh', 0.55)
  }, [])

  const switchMusicTrack = useCallback(
    async (trackIndex: number, fadeIn = true) => {
      if (isSwitchingMusicRef.current) return
      isSwitchingMusicRef.current = true

      const url = celebrationMusicTracks[trackIndex % celebrationMusicTracks.length]
      const prev = audioRef.current

      if (prev) {
        try {
          await fadeVolume(prev, prev.volume, 0, FADE_MS)
        } catch {
          /* ignore */
        }
        prev.pause()
      }

      const next = new Audio(url)
      next.loop = true
      next.volume = 0
      audioRef.current = next

      try {
        await next.play()
        setIsPlaying(true)
        if (fadeIn) {
          await fadeVolume(next, 0, TARGET_VOLUME, FADE_MS)
        } else {
          next.volume = TARGET_VOLUME
        }
      } catch {
        setIsPlaying(false)
      }

      musicTrackIndexRef.current = trackIndex
      isSwitchingMusicRef.current = false
    },
    []
  )

  useEffect(() => {
    switchMusicTrack(0, true)

    return () => {
      audioRef.current?.pause()
    }
  }, [switchMusicTrack])

  useEffect(() => {
    if (showSummaryRecap) return
    if (musicTrackIndexRef.current === musicTrackIndex) return
    switchMusicTrack(musicTrackIndex, true)
  }, [musicTrackIndex, showSummaryRecap, switchMusicTrack])

  const toggleMusic = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      await fadeVolume(audio, audio.volume, 0, 400)
      audio.pause()
      setIsPlaying(false)
    } else {
      await audio.play().catch(() => {})
      await fadeVolume(audio, audio.volume, TARGET_VOLUME, 600)
      setIsPlaying(true)
    }
  }

  useEffect(() => {
    if (showSummaryRecap) return
    if (currentSlide < 0 || currentSlide > finalSlideIndex) return

    setProgress(0)
    slideAdvanceLockRef.current = false

    const duration = currentSlide === finalSlideIndex ? 12000 : 9000
    const start = performance.now()
    let rafId = 0

    const tick = (now: number) => {
      const elapsed = now - start
      const pct = Math.min(100, (elapsed / duration) * 100)
      setProgress(pct)

      if (pct >= 100) {
        if (!slideAdvanceLockRef.current) {
          slideAdvanceLockRef.current = true
          if (currentSlide < statSlideCount) {
            playTransitionSound()
            setTimeout(() => setCurrentSlide(s => s + 1), 250)
          }
        }
        return
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    if (currentSlide === finalSlideIndex) {
      const finalTimer = setTimeout(() => setShowFinalMessage(true), 1200)
      return () => {
        cancelAnimationFrame(rafId)
        clearTimeout(finalTimer)
      }
    }

    return () => cancelAnimationFrame(rafId)
  }, [currentSlide, showSummaryRecap, finalSlideIndex, statSlideCount, playTransitionSound])

  const handleTap = (e: React.MouseEvent) => {
    if (showSummaryRecap) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width

    if (x < width / 3 && currentSlide > 0) {
      slideAdvanceLockRef.current = true
      playTransitionSound()
      setCurrentSlide(prev => prev - 1)
      setShowFinalMessage(false)
    } else if (x > (width * 2) / 3 && currentSlide < finalSlideIndex) {
      slideAdvanceLockRef.current = true
      playTransitionSound()
      setCurrentSlide(prev => prev + 1)
      setShowFinalMessage(false)
    }
  }

  const openSummaryRecap = async (e: React.MouseEvent) => {
    e.stopPropagation()
    playSound('celebrate', 0.9)
    slideAdvanceLockRef.current = true
    const audio = audioRef.current
    if (audio && isPlaying) {
      await fadeVolume(audio, audio.volume, TARGET_VOLUME * 0.35, 600)
    }
    setShowSummaryRecap(true)
  }

  const finishFromSummary = (e: React.MouseEvent) => {
    e.stopPropagation()
    playSound('whoosh', 0.6)
    setShowSummaryRecap(false)
    setShowCycleFinale(true)
  }

  const handleCycleFinaleComplete = async () => {
    const audio = audioRef.current
    if (audio) {
      await fadeVolume(audio, audio.volume, 0, FADE_MS)
      audio.pause()
    }
    onComplete()
  }

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onClick={handleTap}
    >
      {/* Progress bars — stat slides + love slide only */}
      {!showSummaryRecap && (
        <div className="absolute top-4 left-4 right-4 flex gap-1 z-10 safe-area-top">
          {[...Array(totalProgressSlides)].map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white"
                style={{
                  width:
                    index < currentSlide
                      ? '100%'
                      : index === currentSlide
                        ? `${progress}%`
                        : '0%',
                }}
              />
            </div>
          ))}
        </div>
      )}

      {!showSummaryRecap && (
        <motion.button
          onClick={e => {
            e.stopPropagation()
            playSound('tap', 0.5)
            toggleMusic()
          }}
          className="absolute top-12 right-4 z-20 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center safe-area-top"
          whileTap={{ scale: 0.9 }}
          aria-label={isPlaying ? 'Muzigi duraklat' : 'Muzigi cal'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
        </motion.button>
      )}

      <AnimatePresence mode="popLayout" initial={false}>
        {/* Individual stat slides */}
        {!showSummaryRecap &&
          currentSlide >= 0 &&
          currentSlide < statSlideCount && (
            <motion.div
              key={`stat-${currentSlide}`}
              initial={{ opacity: 0, x: 48 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -48 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className={`absolute inset-0 bg-gradient-to-br ${statCards[currentSlide].bgGradient} flex flex-col items-center justify-center p-6`}
            >
              <motion.div
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-sm w-full border border-white/20 shadow-2xl"
                initial={{ y: 40, opacity: 0, scale: 0.96 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
              >
                <motion.div
                  className="text-7xl text-center mb-6"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                >
                  {statCards[currentSlide].emoji}
                </motion.div>

                <motion.h2
                  className="text-white/80 text-center text-lg font-medium mb-4"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.45 }}
                >
                  {statCards[currentSlide].title}
                </motion.h2>

                <motion.p
                  className="text-white text-center text-lg font-semibold leading-relaxed whitespace-pre-line"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                >
                  {statCards[currentSlide].description}
                </motion.p>
              </motion.div>
            </motion.div>
          )}

        {/* Love slide — Seni Seviyorum opens summary */}
        {!showSummaryRecap && currentSlide === finalSlideIndex && (
          <motion.div
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-gradient-to-br from-[#00D2FF] via-pink-500 to-purple-600 flex flex-col items-center justify-center p-6"
          >
            <AnimatePresence>
              {showFinalMessage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2 }}
                  className="relative z-10 text-center"
                >
                  <motion.div
                    className="text-8xl mb-8"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    💕
                  </motion.div>

                  <motion.h1
                    className="text-white text-3xl font-bold leading-relaxed"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    Nice aylara Alminacik,
                  </motion.h1>

                  <motion.p
                    className="text-white/90 text-xl mt-4 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                  >
                    seninle her gun bir baska guzel.
                  </motion.p>

                  <motion.p
                    className="text-white text-2xl font-semibold mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 0.8 }}
                  >
                    Iyi ki varsin.
                  </motion.p>

                  <motion.button
                    onClick={openSummaryRecap}
                    className="mt-12 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full border border-white/30 font-semibold"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.8, duration: 0.6 }}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.3)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Devam
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* All stats on one recap card */}
        {showSummaryRecap && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex flex-col p-4 pt-14 pb-8 safe-area-top safe-area-bottom"
            onClick={e => e.stopPropagation()}
          >
            <motion.div
              className="flex-1 overflow-y-auto max-w-md mx-auto w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <h2 className="text-white text-2xl font-bold text-center mb-1">
                Bizim 1. Ay Ozeti
              </h2>
              <p className="text-white/60 text-sm text-center mb-6">
                Tek sayfada butun rakamlarimiz
              </p>

              <div className="space-y-3">
                {statsSummaryRows.map((row, i) => (
                  <motion.div
                    key={row.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * i, duration: 0.4 }}
                    className="flex items-start gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10"
                  >
                    <span className="text-2xl flex-none">{row.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-white/70 text-xs uppercase tracking-wide">
                        {row.label}
                      </p>
                      <p className="text-white text-lg font-bold">{row.value}</p>
                      {row.detail && (
                        <p className="text-white/55 text-sm mt-0.5">{row.detail}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.button
              onClick={finishFromSummary}
              className="mt-4 w-full max-w-md mx-auto bg-gradient-to-r from-[#00D2FF] to-pink-500 text-white font-bold py-4 rounded-full shadow-lg flex-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileTap={{ scale: 0.98 }}
            >
              Devam
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {showCycleFinale && (
        <CycleFinaleScreen onComplete={handleCycleFinaleComplete} />
      )}

      {!showSummaryRecap && currentSlide < finalSlideIndex && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 text-white/50 text-xs z-10 safe-area-bottom">
          <div className="flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            <span>Geri</span>
          </div>
          <span>|</span>
          <div className="flex items-center gap-1">
            <span>Ileri</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  )
}
