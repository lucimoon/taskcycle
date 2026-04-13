import type { Priority, Urgency } from '@/types/task'

const PRIORITY_LABELS: Record<Priority, string> = {
  1: 'High impact',
  2: 'Contributes to goals',
  3: 'Nice to have',
  4: 'Low impact',
}

const URGENCY_LABELS: Record<Urgency, string> = {
  1: 'Needs to happen today',
  2: 'This week',
  3: 'This month',
  4: 'Whenever',
}

const LEVEL_COLORS: Record<1 | 2 | 3 | 4, { selected: string; idle: string }> = {
  1: { selected: 'bg-coral text-white shadow-md scale-[1.04]',    idle: 'bg-white/60 backdrop-blur-sm border border-white/80 text-ink hover:bg-coral/10' },
  2: { selected: 'bg-amber text-white shadow-md scale-[1.04]',    idle: 'bg-white/60 backdrop-blur-sm border border-white/80 text-ink hover:bg-amber/10' },
  3: { selected: 'bg-sunny text-ink shadow-md scale-[1.04]',      idle: 'bg-white/60 backdrop-blur-sm border border-white/80 text-ink hover:bg-sunny/30' },
  4: { selected: 'bg-ink/15 text-ink shadow-md scale-[1.04]',     idle: 'bg-white/60 backdrop-blur-sm border border-white/80 text-ink hover:bg-ink/8' },
}

interface PickerRowProps<T extends number> {
  label: string
  value: T
  labels: Record<T, string>
  levels: T[]
  onChange: (v: T) => void
}

function PickerRow<T extends 1 | 2 | 3 | 4>({ label, value, labels, levels, onChange }: PickerRowProps<T>) {
  return (
    <div className="space-y-2">
      <span className="text-sm font-bold text-ink">{label}</span>
      <div className="flex gap-2">
        {levels.map((level) => {
          const colors = LEVEL_COLORS[level]
          const isSelected = value === level
          return (
            <button
              key={level}
              type="button"
              onClick={() => onChange(level)}
              aria-pressed={isSelected}
              className={[
                'flex flex-col items-center rounded-2xl px-3 py-2 text-xs transition-all min-w-[80px]',
                isSelected ? colors.selected : colors.idle,
              ].join(' ')}
            >
              <span className="font-display font-bold text-base">{level}</span>
              <span className="text-center leading-tight mt-0.5 font-medium">{labels[level]}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface PriorityUrgencyPickerProps {
  priority: Priority
  urgency: Urgency
  onChange: (priority: Priority, urgency: Urgency) => void
}

export function PriorityUrgencyPicker({ priority, urgency, onChange }: PriorityUrgencyPickerProps) {
  return (
    <div className="space-y-4">
      <PickerRow
        label="Priority"
        value={priority}
        labels={PRIORITY_LABELS}
        levels={[1, 2, 3, 4] as Priority[]}
        onChange={(p) => onChange(p, urgency)}
      />
      <PickerRow
        label="Urgency"
        value={urgency}
        labels={URGENCY_LABELS}
        levels={[1, 2, 3, 4] as Urgency[]}
        onChange={(u) => onChange(priority, u)}
      />
    </div>
  )
}
