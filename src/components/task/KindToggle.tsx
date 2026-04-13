import type { TaskKind } from '@/types/task'

interface KindToggleProps {
  value: TaskKind
  onChange: (kind: TaskKind) => void
}

export function KindToggle({ value, onChange }: KindToggleProps) {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-full p-1 flex gap-1 border border-white/80 inline-flex w-fit">
      <button
        type="button"
        onClick={() => onChange('once')}
        aria-pressed={value === 'once'}
        className={`rounded-full px-4 py-1.5 text-sm font-bold transition-all ${
          value === 'once' ? 'bg-coral text-white shadow-sm' : 'text-ink hover:bg-white/40'
        }`}
      >
        One-off
      </button>
      <button
        type="button"
        onClick={() => onChange('cyclic')}
        aria-pressed={value === 'cyclic'}
        aria-label="Recurring"
        className={`rounded-full px-4 py-1.5 text-sm font-bold transition-all ${
          value === 'cyclic' ? 'bg-lavender text-white shadow-sm' : 'text-ink hover:bg-white/40'
        }`}
      >
        ↻ Recurring
      </button>
    </div>
  )
}
