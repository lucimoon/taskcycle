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
