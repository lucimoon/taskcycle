import { useStepTimer } from '@/hooks/useStepTimer'
import { formatCountdown } from '@/services/scheduler/timerService'

interface StepTimerProps {
  durationMinutes: number
  onComplete?: () => void
}

export function StepTimer({ durationMinutes, onComplete }: StepTimerProps) {
  const { remainingMs, running, start, pause, reset } = useStepTimer(durationMinutes, onComplete)
  const finished = remainingMs === 0

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={[
          'font-mono text-xs font-bold tabular-nums px-2.5 py-0.5 rounded-full border border-white/80 backdrop-blur-sm',
          finished
            ? 'bg-mint/40 text-ink'
            : running
              ? 'bg-sunny/60 text-ink'
              : 'bg-white/60 text-ink',
        ].join(' ')}
        aria-live="polite"
        aria-label="Timer countdown"
      >
        {formatCountdown(remainingMs)}
      </span>
      {!finished && (
        <button
          type="button"
          onClick={running ? pause : start}
          aria-label={running ? 'Pause timer' : 'Start timer'}
          className="rounded-full w-6 h-6 flex items-center justify-center bg-white/60 backdrop-blur-sm border border-white/60 hover:bg-sunny/40 transition-colors text-xs font-bold btn-action"
        >
          {running ? '⏸' : '▶'}
        </button>
      )}
      <button
        type="button"
        onClick={reset}
        aria-label="Reset timer"
        className="rounded-full w-6 h-6 flex items-center justify-center bg-white/60 backdrop-blur-sm border border-white/60 hover:bg-white/80 transition-colors text-xs btn-action"
      >
        ↺
      </button>
    </div>
  )
}
