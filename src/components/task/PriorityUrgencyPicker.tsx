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

const LEVEL_COLORS: Record<1 | 2 | 3 | 4, { selected: string; default: string }> = {
  1: { selected: 'bg-red-500 text-white ring-red-500', default: 'hover:bg-red-50 text-gray-600' },
  2: { selected: 'bg-orange-400 text-white ring-orange-400', default: 'hover:bg-orange-50 text-gray-600' },
  3: { selected: 'bg-yellow-400 text-white ring-yellow-400', default: 'hover:bg-yellow-50 text-gray-600' },
  4: { selected: 'bg-gray-300 text-gray-800 ring-gray-300', default: 'hover:bg-gray-50 text-gray-600' },
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
    <div className="space-y-1.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
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
                'flex flex-col items-center rounded-lg border px-3 py-2 text-xs transition-colors min-w-[80px]',
                isSelected ? `${colors.selected} border-transparent ring-2` : `${colors.default} border-gray-200`,
              ].join(' ')}
            >
              <span className="font-bold text-sm">{level}</span>
              <span className="text-center leading-tight mt-0.5">{labels[level]}</span>
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
