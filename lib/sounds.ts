/**
 * Lightweight UI sounds via Web Audio (no mp3 files required).
 * Call unlockAudio() on first user gesture so mobile browsers allow playback.
 */

export type SoundId =
  | 'tap'
  | 'modalOpen'
  | 'error'
  | 'success'
  | 'messageIn'
  | 'messageOut'
  | 'system'
  | 'notification'
  | 'pop'
  | 'whoosh'
  | 'celebrate'

let ctx: AudioContext | null = null
let unlocked = false
let burstThrottle = 0

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return null
    ctx = new Ctx()
  }
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {})
  }
  return ctx
}

export function unlockAudio(): void {
  const c = getCtx()
  if (!c) return
  unlocked = true
  c.resume().catch(() => {})
}

function tone(
  frequency: number,
  startTime: number,
  duration: number,
  volume: number,
  type: OscillatorType = 'sine',
  attack = 0.01,
  release = 0.08
): void {
  const c = getCtx()
  if (!c || !unlocked) return

  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(frequency, startTime)
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(volume, startTime + attack)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration + release)
  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(startTime)
  osc.stop(startTime + duration + release + 0.05)
}

function chord(notes: number[], startTime: number, volume: number, duration: number): void {
  notes.forEach((f, i) => {
    tone(f, startTime + i * 0.04, duration, volume * 0.55, 'sine', 0.02, 0.12)
  })
}

const SOUND_MAP: Record<SoundId, (v: number) => void> = {
  tap: (v) => {
    const t = getCtx()?.currentTime ?? 0
    tone(880, t, 0.04, v * 0.35, 'sine', 0.005, 0.04)
    tone(1320, t + 0.02, 0.03, v * 0.2, 'sine', 0.005, 0.03)
  },
  modalOpen: (v) => {
    const t = getCtx()?.currentTime ?? 0
    tone(520, t, 0.08, v * 0.3, 'sine', 0.02, 0.1)
    tone(780, t + 0.06, 0.1, v * 0.25, 'sine', 0.02, 0.12)
  },
  error: (v) => {
    const t = getCtx()?.currentTime ?? 0
    tone(220, t, 0.12, v * 0.4, 'triangle', 0.01, 0.1)
    tone(180, t + 0.14, 0.14, v * 0.35, 'triangle', 0.01, 0.12)
  },
  success: (v) => {
    const t = getCtx()?.currentTime ?? 0
    chord([523.25, 659.25, 783.99], t, v * 0.45, 0.2)
  },
  messageIn: (v) => {
    const t = getCtx()?.currentTime ?? 0
    tone(640, t, 0.06, v * 0.4, 'sine', 0.01, 0.08)
    tone(960, t + 0.07, 0.08, v * 0.35, 'sine', 0.01, 0.1)
  },
  messageOut: (v) => {
    const t = getCtx()?.currentTime ?? 0
    tone(720, t, 0.05, v * 0.32, 'sine', 0.01, 0.07)
    tone(540, t + 0.06, 0.06, v * 0.28, 'sine', 0.01, 0.08)
  },
  system: (v) => {
    const t = getCtx()?.currentTime ?? 0
    tone(440, t, 0.1, v * 0.35, 'triangle', 0.02, 0.15)
    tone(554, t + 0.12, 0.12, v * 0.3, 'triangle', 0.02, 0.15)
    tone(659, t + 0.24, 0.14, v * 0.28, 'triangle', 0.02, 0.18)
  },
  notification: (v) => {
    const t = getCtx()?.currentTime ?? 0
    tone(880, t, 0.08, v * 0.42, 'sine', 0.01, 0.1)
    tone(1108, t + 0.1, 0.1, v * 0.38, 'sine', 0.01, 0.12)
    tone(1318, t + 0.22, 0.12, v * 0.32, 'sine', 0.01, 0.14)
  },
  pop: (v) => {
    const t = getCtx()?.currentTime ?? 0
    tone(500 + Math.random() * 80, t, 0.02, v * 0.2, 'sine', 0.003, 0.03)
  },
  whoosh: (v) => {
    const c = getCtx()
    if (!c || !unlocked) return
    const t = c.currentTime
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(400, t)
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.15)
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.35)
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(v * 0.25, t + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
    osc.connect(gain)
    gain.connect(c.destination)
    osc.start(t)
    osc.stop(t + 0.45)
  },
  celebrate: (v) => {
    const t = getCtx()?.currentTime ?? 0
    chord([392, 493.88, 587.33, 783.99], t, v * 0.5, 0.35)
  },
}

export function playSound(id: SoundId, volume = 1): void {
  if (!unlocked) return
  const fn = SOUND_MAP[id]
  if (fn) fn(Math.min(1, Math.max(0, volume)))
}

export function playMessageSound(
  sender: 'yagiv2' | 'anonim' | 'system',
  phase: 'initial' | 'scrolling' | 'final'
): void {
  if (phase === 'scrolling') {
    const now = Date.now()
    if (now - burstThrottle < 70) return
    burstThrottle = now
    playSound('pop', 0.85)
    return
  }
  if (sender === 'system') playSound('system', 0.9)
  else if (sender === 'yagiv2') playSound('messageIn', 0.95)
  else playSound('messageOut', 0.85)
}
