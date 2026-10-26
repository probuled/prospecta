import { useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react'
import { THEME_STORAGE_KEY, ThemeContext, type ResolvedTheme, type Theme } from './theme-context'

const DARK_QUERY = '(prefers-color-scheme: dark)'

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : 'system'
  } catch {
    return 'system'
  }
}

function subscribeToSystemTheme(listener: () => void) {
  const media = matchMedia(DARK_QUERY)
  media.addEventListener('change', listener)
  return () => media.removeEventListener('change', listener)
}

const systemTheme = (): ResolvedTheme => (matchMedia(DARK_QUERY).matches ? 'dark' : 'light')

export function ThemeProvider({ children }: { readonly children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)
  const system = useSyncExternalStore(subscribeToSystemTheme, systemTheme)
  const resolvedTheme = theme === 'system' ? system : theme

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme
  }, [resolvedTheme])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme: (next: Theme) => {
        setThemeState(next)
        try {
          localStorage.setItem(THEME_STORAGE_KEY, next)
        } catch {
          // Sem armazenamento: o tema vale só nesta sessão.
        }
      },
    }),
    [theme, resolvedTheme],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}
