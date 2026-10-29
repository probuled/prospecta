import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useDependencies } from '@/app/dependencies-context'
import type { LocateLeadsProgress } from '@/application/use-cases/locate-leads'
import { formatCount } from '@/presentation/format'

/** Roda a localização dos leads antigos com progresso; sair da tela cancela. */
export function useLocateLeads() {
  const { locateLeads } = useDependencies()
  const [progress, setProgress] = useState<LocateLeadsProgress | null>(null)
  const controller = useRef<AbortController | null>(null)

  useEffect(() => () => controller.current?.abort(), [])

  const start = async () => {
    controller.current = new AbortController()
    setProgress({ done: 0, total: 0 })
    try {
      const result = await locateLeads.execute({ signal: controller.current.signal, onProgress: setProgress })
      const located = result.fromEngine + result.fromAddress
      const missing = result.notFound ? ` ${formatCount(result.notFound)} ficaram sem posição.` : ''
      toast.success(`${formatCount(located)} leads localizados.${missing}`)
    } catch (error) {
      if (controller.current.signal.aborted) return
      toast.error('Não consegui localizar os leads.', { description: error instanceof Error ? error.message : undefined })
    } finally {
      setProgress(null)
    }
  }

  return { start, progress, isRunning: progress !== null }
}
