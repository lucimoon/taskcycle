import { useEffect } from 'react'
import type { Task } from '@/types/task'
import type { Category } from '@/types/category'
import { CategoryBadge } from '@/components/category/CategoryBadge'
import { fireConfetti } from '@/components/feedback/ConfettiEffect'
import { playTaskSelected } from '@/services/audio/audioService'

interface Props {
  task: Task
  category?: Category
  onComplete: () => void
  onSkip: () => void
}

export function SpinResult({ task, category, onComplete, onSkip }: Props) {
  useEffect(() => {
    playTaskSelected()
    fireConfetti()
  }, [])

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center pointer-events-none">
      <div
        className="pointer-events-auto w-full max-w-lg mx-auto px-4 pb-8"
        style={{ animation: 'slide-up 320ms cubic-bezier(0.34, 1.56, 0.64, 1) both' }}
      >
        <div className="card-glass rounded-3xl p-6 space-y-4 shadow-2xl border border-white/90">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5 flex-1 min-w-0">
              <p className="text-xs font-semibold text-ink/40 uppercase tracking-widest">You got</p>
              <h2 className="font-display font-bold text-2xl text-ink leading-tight break-words">
                {task.title}
              </h2>
            </div>
            <div className="shrink-0 text-4xl mt-1">🎯</div>
          </div>

          {(task.categoryIds?.length || task.estimatedMinutes || task.notes) && (
            <div className="flex flex-wrap items-center gap-2">
              {category && <CategoryBadge category={category} />}
              {task.estimatedMinutes && (
                <span className="rounded-full bg-amber/15 text-amber px-3 py-1 text-xs font-semibold">
                  ~{task.estimatedMinutes} min
                </span>
              )}
            </div>
          )}

          {task.notes && (
            <p className="text-sm text-ink/55 leading-relaxed line-clamp-2">{task.notes}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={onSkip}
              className="flex-1 rounded-full bg-white/70 border border-white/80 text-ink py-3 text-sm font-semibold btn-action"
            >
              Skip
            </button>
            <button
              onClick={onComplete}
              className="flex-2 rounded-full bg-coral text-white py-3 px-8 text-sm font-semibold btn-action shadow-md"
              style={{ flex: 2 }}
            >
              Complete ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
