import type { TaskKind } from '@/types/task'

interface KindToggleProps {
  value: TaskKind
  onChange: (kind: TaskKind) => void
}

export function KindToggle({ value, onChange }: KindToggleProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-gray-100 p-1 w-fit">
      {(['once', 'cyclic'] as TaskKind[]).map((kind) => (
        <button
          key={kind}
          type="button"
          onClick={() => onChange(kind)}
          aria-pressed={value === kind}
          className={[
            'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
            value === kind
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700',
          ].join(' ')}
        >
          {kind === 'once' ? 'One-off' : 'Recurring'}
        </button>
      ))}
    </div>
  )
}
