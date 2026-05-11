import type { Theme } from '@/hooks/useTheme'

interface Props {
  theme: Theme
  onThemeChange: (theme: Theme) => void
}

const OPTIONS: { value: Theme; label: string }[] = [
  { value: 'light', label: '☀️' },
  { value: 'system', label: 'Auto' },
  { value: 'dark', label: '🌙' },
]

export function ThemeToggle({ theme, onThemeChange }: Props) {
  return (
    <div className="flex items-center rounded-full bg-white/60 backdrop-blur-sm border border-white/80 p-0.5 gap-0.5">
      {OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onThemeChange(value)}
          aria-label={`${value} theme`}
          aria-pressed={theme === value}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition-all btn-action ${
            theme === value
              ? 'bg-ink text-white shadow-sm'
              : 'text-ink/60 hover:text-ink'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
