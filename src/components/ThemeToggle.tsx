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
      className="rounded-full bg-white/60 backdrop-blur-sm border border-white/80 px-4 py-1.5 text-xs font-semibold text-ink hover:bg-white/80 transition-colors btn-action"
    >
      {isDusk ? '☀️ Classic' : '🌙 Dusk'}
    </button>
  )
}
