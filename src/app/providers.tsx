import { useState, type ReactNode } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/presentation/theme/theme-provider'
import { createDependencies } from './container'
import { DependenciesContext } from './dependencies-context'

export function AppProviders({ children }: { children: ReactNode }) {
  const [dependencies] = useState(createDependencies)

  return (
    <ThemeProvider>
      <DependenciesContext value={dependencies}>
        {children}
        <Toaster position="bottom-right" />
      </DependenciesContext>
    </ThemeProvider>
  )
}
