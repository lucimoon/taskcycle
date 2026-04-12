import { useState } from 'react'
import type { Step } from '@/types/task'
import { StepRow } from './StepRow'

interface StepListProps {
  steps: Step[]
  onChange: (steps: Step[]) => void
}

export function StepList({ steps, onChange }: StepListProps) {
  const [lastAddedId, setLastAddedId] = useState<string | null>(null)

  function addStep() {
    const newStep: Step = { id: crypto.randomUUID(), label: '' }
    onChange([...steps, newStep])
    setLastAddedId(newStep.id)
  }

  function updateStep(index: number, updated: Step) {
    const next = [...steps]
    next[index] = updated
    onChange(next)
  }

  function removeStep(index: number) {
    onChange(steps.filter((_, i) => i !== index))
  }

  function moveStep(from: number, to: number) {
    const next = [...steps]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onChange(next)
  }

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-gray-700">Steps</span>
      <div className="space-y-2">
        {steps.map((step, i) => (
          <StepRow
            key={step.id}
            step={step}
            index={i}
            total={steps.length}
            autoFocus={step.id === lastAddedId}
            onChange={(s) => updateStep(i, s)}
            onRemove={() => removeStep(i)}
            onMoveUp={() => moveStep(i, i - 1)}
            onMoveDown={() => moveStep(i, i + 1)}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={addStep}
        className="rounded-md border border-dashed border-gray-300 px-3 py-1.5 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors w-full"
      >
        + Add step
      </button>
    </div>
  )
}
