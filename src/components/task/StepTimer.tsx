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
          'font-mono text-xs tabular-nums px-2 py-0.5 rounded',
          finished
            ? 'bg-green-100 text-green-700'
            : running
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-600',
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
          className="rounded p-0.5 text-gray-400 hover:text-blue-600 transition-colors text-xs"
        >
          {running ? '⏸' : '▶'}
        </button>
      )}
      <button
        type="button"
        onClick={reset}
        aria-label="Reset timer"
        className="rounded p-0.5 text-gray-400 hover:text-gray-600 transition-colors text-xs"
      >
        ↺
      </button>
    </div>
  )
}
