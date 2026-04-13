import type { Step } from '@/types/task'

const inputCls = 'rounded-xl border-2 border-ink px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-coral/40 font-body'

interface StepRowProps {
  step: Step
  index: number
  total: number
  autoFocus?: boolean
  onChange: (step: Step) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

export function StepRow({ step, index, total, autoFocus, onChange, onRemove, onMoveUp, onMoveDown }: StepRowProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={index === 0}
          aria-label="Move step up"
          className="rounded-lg p-0.5 text-ink/30 hover:text-ink disabled:opacity-20 text-xs"
        >
          ▲
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={index === total - 1}
          aria-label="Move step down"
          className="rounded-lg p-0.5 text-ink/30 hover:text-ink disabled:opacity-20 text-xs"
        >
          ▼
        </button>
      </div>
      <input
        type="text"
        value={step.label}
        onChange={(e) => onChange({ ...step, label: e.target.value })}
        placeholder={`Step ${index + 1}`}
        autoFocus={autoFocus}
        className={`flex-1 ${inputCls}`}
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
        className={`w-16 ${inputCls}`}
      />
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove step"
        className="rounded-lg p-1.5 text-ink/30 hover:bg-coral/10 hover:text-coral transition-colors font-bold text-sm"
      >
        ✕
      </button>
    </div>
  )
}
