/** Relationship & cycle data for the finale screen */

export const RELATIONSHIP_START = new Date(2026, 3, 29, 23, 59, 0) // 29.04.2026 23:59

export const CYCLE_LENGTH = 28
export const PERIOD_LENGTH = 6

/** Last period start (current cycle anchor) */
export const CURRENT_PERIOD_START = new Date(2026, 4, 18, 0, 0, 0) // 18.05.2026

/** Historical: Nisan regl 23–28 */
export const APRIL_PERIOD_DAYS = { month: 3, year: 2026, from: 23, to: 28 } // month 0-indexed: 3 = April

export type CyclePhaseId = 'menstrual' | 'follicular' | 'ovulation' | 'luteal'

export interface CyclePhaseInfo {
  id: CyclePhaseId
  name: string
  emoji: string
  mood: string
  tips: string[]
  color: string
}

export const CYCLE_PHASES: Record<CyclePhaseId, CyclePhaseInfo> = {
  menstrual: {
    id: 'menstrual',
    name: 'Regl Donemi',
    emoji: '🌸',
    mood: 'Bu donemde yorgun, hassas veya keyifsiz hissedebilirsin — bu tamamen normal.',
    tips: [
      'Bol su ic, dinlenmeye oncelik ver',
      'Sicak dus veya kompres rahatlatabilir',
      'Kendine nazik ol; agir isleri ertele',
      'Yiğido sana destek olmak ister — istersen yaz',
    ],
    color: 'from-rose-400 to-pink-600',
  },
  follicular: {
    id: 'follicular',
    name: 'Folikuler Donem',
    emoji: '✨',
    mood: 'Bu donemde enerjin yukselebilir; yeni seylere acik ve daha pozitif hissedebilirsin.',
    tips: [
      'Yeni planlar ve sohbetler icin guzel bir zaman',
      'Hafif egzersiz ve yuruyus iyi gelir',
      'Yaratici isler veya hobiler icin enerji var',
      'Birlikte disari cikmak veya oyun oynamak harika olur',
    ],
    color: 'from-[#00D2FF] to-cyan-500',
  },
  ovulation: {
    id: 'ovulation',
    name: 'Yumurtlama Donemi',
    emoji: '🌺',
    mood: 'Bu donemde kendini daha enerjik, sosyal ve kendinden emin hissedebilirsin.',
    tips: [
      'Iletisim ve bulusmalar icin ideal gunler',
      'Kendini ifade etmek daha kolay olabilir',
      'Romantik bir mesaj veya surpriz guzel gider',
      'Bol uyku ve dengeli beslenmeye devam et',
    ],
    color: 'from-violet-400 to-purple-600',
  },
  luteal: {
    id: 'luteal',
    name: 'Luteal / PMS Donemi',
    emoji: '🌙',
    mood: 'Bu donemde duygular yogunlasabilir; sinirlilik veya siskinlik hissedebilirsin.',
    tips: [
      'Tuz ve kafeini biraz azaltabilirsin',
      'Sevdigin atistirmaliklar ve dinlenme iyi gelir',
      'Buyuk tartismalardan kacın; sakin konus',
      'Yiğido\'ya nasil hissettigini soyleyebilirsin',
    ],
    color: 'from-indigo-400 to-slate-600',
  },
}

export function getCycleDay(referenceDate = new Date()): number {
  const start = startOfDay(CURRENT_PERIOD_START)
  const now = startOfDay(referenceDate)
  const diffDays = Math.floor((now.getTime() - start.getTime()) / 86400000)
  if (diffDays < 0) return 1
  return (diffDays % CYCLE_LENGTH) + 1
}

export function getPhaseForCycleDay(day: number): CyclePhaseInfo {
  if (day <= PERIOD_LENGTH) return CYCLE_PHASES.menstrual
  if (day <= 13) return CYCLE_PHASES.follicular
  if (day <= 16) return CYCLE_PHASES.ovulation
  return CYCLE_PHASES.luteal
}

export function getDaysUntilNextPeriod(cycleDay: number): number {
  return CYCLE_LENGTH - cycleDay
}

export function getNextPeriodStart(from = new Date()): Date {
  const cycleDay = getCycleDay(from)
  const daysUntil = getDaysUntilNextPeriod(cycleDay)
  const next = new Date(from)
  next.setDate(next.getDate() + daysUntil)
  next.setHours(0, 0, 0, 0)
  return next
}

export function isPeriodDay(
  year: number,
  month: number,
  day: number,
  referencePeriodStart = CURRENT_PERIOD_START
): boolean {
  const date = new Date(year, month, day)
  const start = startOfDay(referencePeriodStart)

  // Check current and adjacent cycles (±1)
  for (let cycle = -1; cycle <= 2; cycle++) {
    const periodStart = new Date(start)
    periodStart.setDate(periodStart.getDate() + cycle * CYCLE_LENGTH)
    for (let d = 0; d < PERIOD_LENGTH; d++) {
      const p = new Date(periodStart)
      p.setDate(p.getDate() + d)
      if (sameDay(p, date)) return true
    }
  }

  // Nisan 23-28 (once)
  if (year === 2026 && month === 3 && day >= 23 && day <= 28) return true

  return false
}

export function isFertileDay(year: number, month: number, day: number): boolean {
  const date = new Date(year, month, day)
  const start = startOfDay(CURRENT_PERIOD_START)
  for (let cycle = -1; cycle <= 2; cycle++) {
    const periodStart = new Date(start)
    periodStart.setDate(periodStart.getDate() + cycle * CYCLE_LENGTH)
    for (let d = 11; d <= 16; d++) {
      const f = new Date(periodStart)
      f.setDate(f.getDate() + d)
      if (sameDay(f, date)) return true
    }
  }
  return false
}

export function formatDuration(ms: number): {
  days: number
  hours: number
  minutes: number
  seconds: number
} {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return { days, hours, minutes, seconds }
}

function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export const MONTH_NAMES_TR = [
  'Ocak', 'Subat', 'Mart', 'Nisan', 'Mayis', 'Haziran',
  'Temmuz', 'Agustos', 'Eylul', 'Ekim', 'Kasim', 'Aralik',
]

export const WEEKDAYS_TR = ['Pt', 'Sa', 'Ca', 'Pe', 'Cu', 'Ct', 'Pz']

export function getCalendarCells(year: number, month: number): (number | null)[] {
  const first = new Date(year, month, 1)
  const lastDate = new Date(year, month + 1, 0).getDate()
  let startWeekday = first.getDay() - 1
  if (startWeekday < 0) startWeekday = 6
  const cells: (number | null)[] = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= lastDate; d++) cells.push(d)
  return cells
}
