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
          'font-mono text-xs font-bold tabular-nums px-2 py-0.5 rounded-lg border-2 border-ink',
          finished
            ? 'bg-mint text-ink'
            : running
              ? 'bg-sunny text-ink'
              : 'bg-surface text-ink',
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
          className="rounded-lg border-2 border-ink p-0.5 w-6 h-6 flex items-center justify-center bg-surface hover:bg-sunny transition-colors text-xs font-bold"
        >
          {running ? '⏸' : '▶'}
        </button>
      )}
      <button
        type="button"
        onClick={reset}
        aria-label="Reset timer"
        className="rounded-lg border-2 border-ink p-0.5 w-6 h-6 flex items-center justify-center bg-surface hover:bg-ink/8 transition-colors text-xs"
      >
        ↺
      </button>
    </div>
  )
}
