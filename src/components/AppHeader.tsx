import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { Theme } from '@/hooks/useTheme'
import { ThemeToggle } from '@/components/ThemeToggle'

const NAV_LINKS = [
  { label: 'Tasks',      path: '/',           exact: true  },
  { label: 'Matrix',     path: '/matrix',     exact: false },
  { label: 'Wheels',     path: '/wheels',     exact: false },
  { label: 'Categories', path: '/categories', exact: false },
  { label: 'Analytics',  path: '/analytics',  exact: false },
  { label: 'Rewards',    path: '/rewards',    exact: false },
  { label: 'Settings',   path: '/settings',   exact: false },
] as const

interface Props {
  theme: Theme
  onThemeToggle: () => void
}

export function AppHeader({ theme, onThemeToggle }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    setNavOpen(false)
  }, [location.pathname])

  function isActive(path: string, exact: boolean) {
    if (exact) return location.pathname === '/' || location.pathname === '/taskcycle'
    return location.pathname.startsWith(path)
  }

  return (
    <header className="bg-white/50 backdrop-blur-lg border-b border-white/60 shadow-sm sticky top-0 z-40 overflow-x-clip">
      <div className="px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
        <span className="font-display font-bold text-xl text-ink tracking-tight shrink-0">
          TaskCycle
        </span>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {NAV_LINKS.map(({ label, path, exact }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-all btn-action ${
                isActive(path, exact)
                  ? 'bg-ink text-white shadow-sm'
                  : 'text-ink/60 hover:bg-ink/8 hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          <button
            onClick={() => navigate('/tasks/new')}
            className="rounded-full bg-coral text-white px-5 py-2 text-sm font-semibold btn-action shadow-md"
          >
            + New Task
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setNavOpen((o) => !o)}
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={navOpen}
          className="lg:hidden rounded-full p-2 min-h-[44px] min-w-[44px] text-ink/60 hover:bg-ink/8 hover:text-ink transition-colors btn-action"
        >
          {navOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile drawer */}
      {navOpen && (
        <div className="lg:hidden border-t border-white/60 px-4 py-3 flex flex-col gap-2">
          <button
            onClick={() => navigate('/tasks/new')}
            className="rounded-full bg-coral text-white px-5 py-3 text-sm font-semibold btn-action shadow-md w-full"
          >
            + New Task
          </button>
          {NAV_LINKS.map(({ label, path, exact }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`rounded-full px-4 py-3 text-sm font-semibold transition-all btn-action w-full ${
                isActive(path, exact)
                  ? 'bg-ink text-white shadow-sm'
                  : 'bg-white/60 backdrop-blur-sm border border-white/80 text-ink hover:bg-white/80'
              }`}
            >
              {label}
            </button>
          ))}
          <div className="flex justify-center pt-1">
            <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          </div>
        </div>
      )}
    </header>
  )
}
