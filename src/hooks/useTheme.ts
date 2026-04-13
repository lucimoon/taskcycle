import { useState, useEffect, useCallback } from 'react'

export type Theme = 'classic' | 'dusk'

const STORAGE_KEY = 'taskcycle-theme'

function getInitialTheme(): Theme {
  return localStorage.getItem(STORAGE_KEY) === 'dusk' ? 'dusk' : 'classic'
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    if (theme === 'dusk') {
      document.documentElement.setAttribute('data-theme', 'dusk')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    localStorage.setItem(STORAGE_KEY, next)
    setThemeState(next)
  }, [])

  return { theme, setTheme }
}
