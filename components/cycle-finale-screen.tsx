'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Calendar, Sparkles } from 'lucide-react'
import {
  RELATIONSHIP_START,
  CYCLE_LENGTH,
  formatDuration,
  getCycleDay,
  getPhaseForCycleDay,
  getDaysUntilNextPeriod,
  getNextPeriodStart,
  isPeriodDay,
  isFertileDay,
  MONTH_NAMES_TR,
  WEEKDAYS_TR,
  getCalendarCells,
} from '@/lib/cycle-data'
import { playSound } from '@/lib/sounds'

interface CycleFinaleScreenProps {
  onComplete: () => void
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function CounterBlock({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center">
      <p className="text-white/60 text-xs uppercase tracking-wider mb-2">{label}</p>
      <p className="text-white text-2xl font-bold tabular-nums leading-tight">{value}</p>
      {sub && <p className="text-white/50 text-xs mt-1">{sub}</p>}
    </div>
  )
}

function MonthCalendar({
  year,
  month,
  today,
}: {
  year: number
  month: number
  today: Date
}) {
  const cells = getCalendarCells(year, month)

  return (
    <div className="mb-4">
      <p className="text-white/80 text-sm font-semibold mb-2 text-center">
        {MONTH_NAMES_TR[month]} {year}
      </p>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS_TR.map(d => (
          <div key={d} className="text-center text-[10px] text-white/40 font-medium">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`e-${i}`} className="aspect-square" />
          }
          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day
          const period = isPeriodDay(year, month, day)
          const fertile = !period && isFertileDay(year, month, day)

          return (
            <div
              key={`${month}-${day}`}
              className={`aspect-square rounded-lg flex items-center justify-center text-[11px] font-medium relative ${
                period
                  ? 'bg-rose-500/90 text-white'
                  : fertile
                    ? 'bg-violet-500/50 text-white'
                    : isToday
                      ? 'bg-[#00D2FF] text-white ring-2 ring-white/50'
                      : 'bg-white/5 text-white/70'
              }`}
            >
              {day}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function CycleFinaleScreen({ onComplete }: CycleFinaleScreenProps) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const rel = formatDuration(now.getTime() - RELATIONSHIP_START.getTime())
  const cycleDay = getCycleDay(now)
  const phase = getPhaseForCycleDay(cycleDay)
  const daysUntilPeriod = getDaysUntilNextPeriod(cycleDay)
  const nextPeriod = getNextPeriodStart(now)

  const relStr = `${rel.days} gun ${pad(rel.hours)}:${pad(rel.minutes)}:${pad(rel.seconds)}`
  const cycleStr = `${cycleDay}. gun / ${CYCLE_LENGTH}`
  const nextPeriodStr = `${pad(nextPeriod.getDate())}.${pad(nextPeriod.getMonth() + 1)}.${nextPeriod.getFullYear()}`

  const displayYear = now.getFullYear()
  const displayMonth = now.getMonth()
  const prevMonth = displayMonth === 0 ? 11 : displayMonth - 1
  const prevYear = displayMonth === 0 ? displayYear - 1 : displayYear

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-[#1a0a14] via-[#2d1b2e] to-[#0f172a] flex flex-col safe-area-top safe-area-bottom"
    >
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-4 max-w-md mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-pink-500/20 mb-3">
            <Heart className="w-7 h-7 text-pink-300 fill-pink-300" />
          </div>
          <h1 className="text-white text-2xl font-bold">Bizim Hikayemiz</h1>
          <p className="text-white/55 text-sm mt-1">29 Nisan 23:59&apos;dan beri</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-3 mb-6">
          <CounterBlock
            label="Ne zamandir konusuyoruz"
            value={relStr}
            sub="29.04.2026 23:59'dan sayiliyor"
          />
          <CounterBlock
            label="Dongu sayaci"
            value={cycleStr}
            sub={`Sonraki regle ~${daysUntilPeriod} gun (${nextPeriodStr})`}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/15 mb-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-pink-300" />
            <h2 className="text-white font-semibold">Regl Takvimi</h2>
          </div>

          <p className="text-white/50 text-xs text-center mb-3">
            <span className="inline-block w-2 h-2 rounded-full bg-rose-500 mr-1 align-middle" />
            Regl
            <span className="inline-block w-2 h-2 rounded-full bg-violet-500/70 mx-2 align-middle" />
            Verimli donem
            <span className="inline-block w-2 h-2 rounded-full bg-[#00D2FF] ml-1 align-middle" />
            Bugun
          </p>

          <MonthCalendar year={prevYear} month={prevMonth} today={now} />
          <MonthCalendar year={displayYear} month={displayMonth} today={now} />

          <p className="text-white/45 text-[11px] text-center mt-2">
            Nisan: 23–28 arasi · Bu ay regl 18&apos;inde basladi
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
          className={`rounded-3xl p-5 bg-gradient-to-br ${phase.color} border border-white/20 shadow-xl`}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{phase.emoji}</span>
            <div>
              <p className="text-white/80 text-xs uppercase tracking-wide">Simdiki donem</p>
              <h3 className="text-white text-xl font-bold">{phase.name}</h3>
              <p className="text-white/70 text-sm">Dongunun {cycleDay}. gunu</p>
            </div>
          </div>

          <p className="text-white text-sm leading-relaxed mb-4">{phase.mood}</p>

          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-white/80" />
            <p className="text-white/90 text-sm font-semibold">Yapabileceklerin</p>
          </div>
          <ul className="space-y-2">
            {phase.tips.map((tip, i) => (
              <li
                key={i}
                className="text-white/90 text-sm flex gap-2 bg-black/15 rounded-xl px-3 py-2"
              >
                <span className="text-white/50 flex-none">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div className="px-4 pb-6 max-w-md mx-auto w-full flex-none">
        <motion.button
          onClick={() => {
            playSound('success')
            onComplete()
          }}
          className="w-full bg-gradient-to-r from-pink-500 to-[#00D2FF] text-white font-bold py-4 rounded-full shadow-lg"
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Seni Seviyorum
        </motion.button>
      </div>
    </motion.div>
  )
}
