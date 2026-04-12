import type { Step } from '@/types/task'

interface StepRowProps {
  step: Step
  index: number
  total: number
  onChange: (step: Step) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

export function StepRow({ step, index, total, onChange, onRemove, onMoveUp, onMoveDown }: StepRowProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={index === 0}
          aria-label="Move step up"
          className="rounded p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-25"
        >
          ▲
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={index === total - 1}
          aria-label="Move step down"
          className="rounded p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-25"
        >
          ▼
        </button>
      </div>
      <input
        type="text"
        value={step.label}
        onChange={(e) => onChange({ ...step, label: e.target.value })}
        placeholder={`Step ${index + 1}`}
        className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="number"
        value={step.durationMinutes ?? ''}
        onChange={(e) =>
          onChange({ ...step, durationMinutes: e.target.value ? Number(e.target.value) : undefined })
        }
        placeholder="min"
        min={1}
        aria-label="Duration in minutes"
        className="w-16 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove step"
        className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
      >
        ✕
      </button>
    </div>
  )
}
