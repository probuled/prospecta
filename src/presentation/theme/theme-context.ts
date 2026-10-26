import { createContext, useContext } from 'react'

export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = Exclude<Theme, 'system'>

export interface ThemeState {
  readonly theme: Theme
  readonly resolvedTheme: ResolvedTheme
  setTheme(theme: Theme): void
}

export const THEME_STORAGE_KEY = 'prospecta:theme'

export const ThemeContext = createContext<ThemeState | null>(null)

export function useTheme(): ThemeState {
  const state = useContext(ThemeContext)
  if (!state) throw new Error('useTheme precisa estar dentro de <ThemeProvider>')
  return state
}
