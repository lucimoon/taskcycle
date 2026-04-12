import type { Task } from '@/types/task'
import { StepTimer } from './StepTimer'

interface StepChecklistProps {
  task: Task
  onCompleteStep: (stepId: string) => void
}

export function StepChecklist({ task, onCompleteStep }: StepChecklistProps) {
  if (task.steps.length === 0) return null

  return (
    <ul className="space-y-2 pt-1">
      {task.steps.map((step) => {
        const done = Boolean(step.completedAt)
        return (
          <li key={step.id} className="flex items-center gap-2.5">
            <input
              type="checkbox"
              id={`step-${step.id}`}
              checked={done}
              onChange={() => !done && onCompleteStep(step.id)}
              disabled={done}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:cursor-default"
            />
            <label
              htmlFor={`step-${step.id}`}
              className={[
                'text-sm flex-1 cursor-pointer',
                done ? 'line-through text-gray-400' : 'text-gray-700',
              ].join(' ')}
            >
              {step.label}
            </label>
            {!done && step.durationMinutes && (
              <StepTimer
                durationMinutes={step.durationMinutes}
                onComplete={() => onCompleteStep(step.id)}
              />
            )}
          </li>
        )
      })}
    </ul>
  )
}
