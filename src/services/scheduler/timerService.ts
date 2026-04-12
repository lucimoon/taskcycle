export function startTimer(onTick: () => void, intervalMs = 1000): () => void {
  const id = setInterval(onTick, intervalMs)
  return () => clearInterval(id)
}

export function formatCountdown(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
