import type { TaskKind } from '@/types/task'

interface KindToggleProps {
  value: TaskKind
  onChange: (kind: TaskKind) => void
}

export function KindToggle({ value, onChange }: KindToggleProps) {
  return (
    <div className="inline-flex rounded-xl border-2 border-ink overflow-hidden shadow-hard-sm">
      <button
        type="button"
        onClick={() => onChange('once')}
        aria-pressed={value === 'once'}
        className={`px-4 py-1.5 text-sm font-bold transition-colors ${
          value === 'once' ? 'bg-coral text-white' : 'bg-cream text-ink hover:bg-coral/10'
        }`}
      >
        One-off
      </button>
      <button
        type="button"
        onClick={() => onChange('cyclic')}
        aria-pressed={value === 'cyclic'}
        aria-label="Recurring"
        className={`border-l-2 border-ink px-4 py-1.5 text-sm font-bold transition-colors ${
          value === 'cyclic' ? 'bg-lavender text-ink' : 'bg-cream text-ink hover:bg-lavender/20'
        }`}
      >
        ↻ Recurring
      </button>
    </div>
  )
}
