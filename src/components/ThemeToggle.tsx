import type { Theme } from '@/hooks/useTheme'

interface Props {
  theme: Theme
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: Props) {
  const isDusk = theme === 'dusk'
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDusk ? 'Switch to Classic theme' : 'Switch to Dusk theme'}
      title={isDusk ? 'Switch to Classic' : 'Switch to Dusk'}
      className="rounded-xl border-2 border-ink px-3 py-1.5 text-xs font-bold bg-surface text-ink hover:bg-lavender/20 transition-colors shadow-hard-sm"
    >
      {isDusk ? '☀️ Classic' : '🌙 Dusk'}
    </button>
  )
}
