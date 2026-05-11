import { useState, useEffect, useCallback } from 'react'

export type Theme = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'taskcycle-theme'

function migrateStoredValue(raw: string | null): Theme {
  if (raw === 'classic') return 'light'
  if (raw === 'dusk') return 'dark'
  if (raw === 'light' || raw === 'dark' || raw === 'system') return raw
  return 'system'
}

function getInitialTheme(): Theme {
  return migrateStoredValue(localStorage.getItem(STORAGE_KEY))
}

function applyTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
    return
  }
  if (theme === 'light') {
    document.documentElement.removeAttribute('data-theme')
    return
  }
  // system
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (prefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)

    if (theme !== 'system') return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme('system')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    localStorage.setItem(STORAGE_KEY, next)
    setThemeState(next)
  }, [])

  return { theme, setTheme }
}
