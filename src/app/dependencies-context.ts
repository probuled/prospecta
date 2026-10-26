import { createContext, useContext } from 'react'
import type { Dependencies } from './container'

export const DependenciesContext = createContext<Dependencies | null>(null)

export function useDependencies(): Dependencies {
  const dependencies = useContext(DependenciesContext)
  if (!dependencies) throw new Error('useDependencies precisa estar dentro de <AppProviders>')
  return dependencies
}
