import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useDependencies } from '@/app/dependencies-context'
import type { Search } from '@/domain/search'

const SYNC_INTERVAL_MS = 5_000

function notifyFinished(search: Search) {
  if (search.status === 'ok') {
    toast.success(`Busca concluída: ${search.keyword}`, { description: `${search.leadCount} leads encontrados.` })
  } else if (search.status === 'failed') {
    toast.error(`A busca falhou: ${search.keyword}`, { description: 'Tente de novo com menos profundidade.' })
  }
}

/** Acompanha em segundo plano as buscas em andamento, em qualquer página do app. */
export function useSearchSync(): void {
  const { searches, syncSearch } = useDependencies()
  const running = useRef(false)

  useEffect(() => {
    const tick = async () => {
      if (running.current) return
      running.current = true
      try {
        const pending = searches.getSnapshot().filter((search) => search.status === 'working')
        for (const search of pending) {
          const updated = await syncSearch.execute(search).catch(() => search)
          notifyFinished(updated)
        }
      } finally {
        running.current = false
      }
    }
    const timer = setInterval(tick, SYNC_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [searches, syncSearch])
}
