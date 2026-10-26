import { Monitor, Moon, Sun } from 'lucide-react'
import { SegmentedControl, type SegmentOption } from '@/components/prospecta/segmented-control'
import { useTheme, type Theme } from '@/presentation/theme/theme-context'

const THEME_OPTIONS: readonly SegmentOption<Theme>[] = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'dark', label: 'Escuro', icon: Moon },
  { value: 'system', label: 'Sistema', icon: Monitor },
]

export function ThemeControl({ block = false }: { readonly block?: boolean }) {
  const { theme, setTheme } = useTheme()
  return <SegmentedControl label="Tema" iconOnly block={block} options={THEME_OPTIONS} value={theme} onChange={setTheme} />
}
