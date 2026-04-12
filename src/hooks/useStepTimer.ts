import { useState, useEffect, useCallback } from 'react'
import { startTimer } from '@/services/scheduler/timerService'

interface UseStepTimerResult {
  remainingMs: number
  running: boolean
  start: () => void
  pause: () => void
  reset: () => void
}

export function useStepTimer(durationMinutes: number, onComplete?: () => void): UseStepTimerResult {
  const durationMs = durationMinutes * 60_000
  const [remainingMs, setRemainingMs] = useState(durationMs)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const cancel = startTimer(() => {
      setRemainingMs((prev) => {
        const next = prev - 1000
        if (next <= 0) {
          setRunning(false)
          onComplete?.()
          return 0
        }
        return next
      })
    })
    return cancel
  }, [running, onComplete])

  const start = useCallback(() => setRunning(true), [])
  const pause = useCallback(() => setRunning(false), [])
  const reset = useCallback(() => {
    setRunning(false)
    setRemainingMs(durationMs)
  }, [durationMs])

  return { remainingMs, running, start, pause, reset }
}
