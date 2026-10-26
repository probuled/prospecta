import { createContext, useContext } from 'react'
import type { EngineStatus } from '@/presentation/hooks/use-engine-status'

/** Um único polling do motor no layout, compartilhado com as páginas. */
export const EngineStatusContext = createContext<EngineStatus>('checking')

export const useSharedEngineStatus = () => useContext(EngineStatusContext)
