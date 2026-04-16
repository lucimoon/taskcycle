import { useState } from 'react'
import type { Task } from '@/types/task'
import { StepTimer } from './StepTimer'
import { StepCompleteFlash } from '@/components/feedback/StepCompleteFlash'
import { useSettingsStore } from '@/store/settingsStore'

interface StepChecklistProps {
  task: Task
  onCompleteStep: (stepId: string) => void
  onUncompleteStep?: (stepId: string) => void
}

export function StepChecklist({ task, onCompleteStep, onUncompleteStep }: StepChecklistProps) {
  const [flashingStepId, setFlashingStepId] = useState<string | null>(null)
  const animationsEnabled = useSettingsStore((s) => s.settings.animationsEnabled)

  function handleCompleteStep(stepId: string) {
    if (animationsEnabled) {
      setFlashingStepId(stepId)
      setTimeout(() => setFlashingStepId(null), 500)
    }
    onCompleteStep(stepId)
  }

  if (task.steps.length === 0) return null

  return (
    <ul className="space-y-2.5 pt-1">
      {task.steps.map((step) => {
        const done = Boolean(step.completedAt)
        return (
          <li key={step.id}>
            <StepCompleteFlash active={flashingStepId === step.id}>
              <div className="flex items-center gap-3 px-1 py-0.5">
                <input
                  type="checkbox"
                  id={`step-${step.id}`}
                  checked={done}
                  onChange={() => done ? onUncompleteStep?.(step.id) : handleCompleteStep(step.id)}
                  disabled={done && !onUncompleteStep}
                  className="h-4 w-4 rounded border border-ink/30 accent-mint cursor-pointer disabled:cursor-default"
                />
                <label
                  htmlFor={`step-${step.id}`}
                  className={[
                    'text-sm flex-1 font-medium cursor-pointer',
                    done ? 'line-through text-mint' : 'text-ink',
                  ].join(' ')}
                >
                  {step.label}
                </label>
                {!done && step.durationMinutes && (
                  <StepTimer
                    durationMinutes={step.durationMinutes}
                    onComplete={() => handleCompleteStep(step.id)}
                  />
                )}
              </div>
            </StepCompleteFlash>
          </li>
        )
      })}
    </ul>
  )
}
