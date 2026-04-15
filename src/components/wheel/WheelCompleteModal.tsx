import { useEffect } from 'react'
import { fireConfetti } from '@/components/feedback/ConfettiEffect'
import { playWheelComplete } from '@/services/audio/audioService'
import type { Wheel } from '@/types/wheel'

interface Props {
  wheel: Wheel
  taskTitles: string[]
  onRestart: () => void
  onDismiss: () => void
}

export function WheelCompleteModal({ wheel, taskTitles, onRestart, onDismiss }: Props) {
  useEffect(() => {
    playWheelComplete()
    fireConfetti()
    const second = setTimeout(() => fireConfetti(), 700)
    return () => clearTimeout(second)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
        onClick={onDismiss}
      />

      {/* Modal */}
      <div
        className="relative card-glass rounded-3xl p-8 w-full max-w-sm text-center space-y-5 shadow-2xl"
        style={{ animation: 'bounce-in 400ms cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        <div className="text-6xl">🏆</div>

        <div className="space-y-1">
          <h2 className="font-display font-bold text-2xl text-ink">Wheel complete!</h2>
          <p className="text-ink/50 text-sm">{wheel.name}</p>
        </div>

        {taskTitles.length > 0 && (
          <div className="bg-white/50 rounded-2xl p-4 text-left space-y-1.5">
            <p className="text-xs font-semibold text-ink/40 uppercase tracking-wider mb-2">
              {taskTitles.length} task{taskTitles.length !== 1 ? 's' : ''} knocked out
            </p>
            {taskTitles.map((title, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-ink/70">
                <span className="text-mint font-bold">✓</span>
                <span className="line-clamp-1">{title}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <button
            onClick={onDismiss}
            className="flex-1 rounded-full bg-white/70 border border-white/80 text-ink py-3 text-sm font-semibold btn-action"
          >
            Done
          </button>
          <button
            onClick={onRestart}
            className="flex-1 rounded-full bg-mint text-white py-3 text-sm font-semibold btn-action shadow-md"
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  )
}
