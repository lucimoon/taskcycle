import { useTaskStore } from '@/store/taskStore'
import { useFocusStore } from '@/store/focusStore'
import { useFocusAutoAdvance } from '@/hooks/useFocusAutoAdvance'
import { StepTimer } from './StepTimer'
import type { Task } from '@/types/task'

interface FocusCardProps {
  task: Task
}

export function FocusCard({ task }: FocusCardProps) {
  const { completeStep, uncompleteStep, completeTask } = useTaskStore()
  const { clearFocus } = useFocusStore()
  const { advance } = useFocusAutoAdvance()

  const activeStep = task.steps.find((s) => !s.completedAt) ?? null
  const allDone = task.steps.length > 0 && task.steps.every((s) => s.completedAt)

  async function handleCompleteStep(stepId: string) {
    await completeStep(task.id, stepId)
    // advance uses the pre-completion steps list; find the step after this one
    const idx = task.steps.findIndex((s) => s.id === stepId)
    const remaining = task.steps.slice(idx + 1)
    advance(remaining)
  }

  async function handleManualDone() {
    if (activeStep) {
      await handleCompleteStep(activeStep.id)
    }
  }

  async function handleEndFocus() {
    clearFocus()
  }

  async function handleCompleteTask() {
    await completeTask(task.id)
    clearFocus()
  }

  return (
    <div className="card-glass rounded-2xl p-5 space-y-4 border-2 border-sunny/60 shadow-lg">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-sunny uppercase tracking-wider">⚡ In Focus</p>
          <h2 className="text-lg font-bold text-ink">{task.title}</h2>
        </div>
        <button
          type="button"
          onClick={handleEndFocus}
          className="text-xs text-ink/40 hover:text-ink underline transition-colors shrink-0 mt-1"
        >
          End focus
        </button>
      </div>

      {task.steps.length === 0 && (
        <div className="flex items-center gap-3">
          {!allDone && (
            <button
              type="button"
              onClick={handleCompleteTask}
              className="rounded-full bg-mint/40 hover:bg-mint/60 border border-white/80 px-4 py-1.5 text-sm font-semibold text-ink transition-colors"
            >
              ✓ Mark done
            </button>
          )}
          {allDone && (
            <span className="text-sm text-mint font-semibold">✓ Complete!</span>
          )}
        </div>
      )}

      {task.steps.length > 0 && (
        <ul className="space-y-3">
          {task.steps.map((step) => {
            const done = Boolean(step.completedAt)
            const isActive = step.id === activeStep?.id

            return (
              <li
                key={step.id}
                className={[
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors',
                  isActive ? 'bg-sunny/20 border border-sunny/40' : 'opacity-60',
                  done ? 'opacity-40' : '',
                ].join(' ')}
              >
                <input
                  type="checkbox"
                  id={`focus-step-${step.id}`}
                  checked={done}
                  onChange={() =>
                    done ? uncompleteStep(task.id, step.id) : handleCompleteStep(step.id)
                  }
                  className="h-4 w-4 rounded border border-ink/30 accent-mint cursor-pointer shrink-0"
                />
                <label
                  htmlFor={`focus-step-${step.id}`}
                  className={[
                    'text-sm flex-1 font-medium cursor-pointer',
                    done ? 'line-through text-mint' : 'text-ink',
                  ].join(' ')}
                >
                  {step.label}
                </label>
                {isActive && !done && step.durationMinutes && (
                  <StepTimer
                    durationMinutes={step.durationMinutes}
                    onComplete={() => handleCompleteStep(step.id)}
                  />
                )}
                {isActive && !done && !step.durationMinutes && (
                  <button
                    type="button"
                    onClick={handleManualDone}
                    className="rounded-full bg-white/60 backdrop-blur-sm border border-white/80 px-3 py-0.5 text-xs font-semibold text-ink hover:bg-mint/40 transition-colors shrink-0"
                  >
                    Done
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
