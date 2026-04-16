let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null
  if (!ctx) ctx = new AudioContext()
  return ctx
}

function playTone(frequency: number, startTime: number, duration: number, volume = 0.3): void {
  const context = getCtx()
  if (!context) return

  const osc = context.createOscillator()
  const gain = context.createGain()

  osc.connect(gain)
  gain.connect(context.destination)

  osc.type = 'sine'
  osc.frequency.setValueAtTime(frequency, startTime)

  const attack = 0.08
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(volume, startTime + attack)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  osc.start(startTime)
  osc.stop(startTime + duration + 0.05)
}

export function playStepComplete(): void {
  const context = getCtx()
  if (!context) return
  playTone(880, context.currentTime, 0.35, 0.25)
}

export function playTaskComplete(): void {
  const context = getCtx()
  if (!context) return
  const t = context.currentTime
  playTone(523, t,        0.22, 0.3)
  playTone(659, t + 0.16, 0.22, 0.3)
}

export function playSpinTick(): void {
  const context = getCtx()
  if (!context) return
  const osc = context.createOscillator()
  const gain = context.createGain()
  osc.connect(gain)
  gain.connect(context.destination)
  osc.type = 'square'
  osc.frequency.setValueAtTime(320, context.currentTime)
  gain.gain.setValueAtTime(0.12, context.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.055)
  osc.start(context.currentTime)
  osc.stop(context.currentTime + 0.06)
}

export function playTaskSelected(): void {
  const context = getCtx()
  if (!context) return
  const t = context.currentTime
  playTone(523, t,        0.18, 0.28)
  playTone(659, t + 0.13, 0.18, 0.28)
  playTone(784, t + 0.26, 0.28, 0.32)
}

export function playWheelComplete(): void {
  const context = getCtx()
  if (!context) return
  const t = context.currentTime
  // C4 E4 G4 C5 E5 — triumphant arpeggio
  playTone(262, t,        0.25, 0.3)
  playTone(330, t + 0.12, 0.25, 0.3)
  playTone(392, t + 0.24, 0.25, 0.3)
  playTone(523, t + 0.36, 0.30, 0.35)
  playTone(659, t + 0.50, 0.55, 0.4)
}
