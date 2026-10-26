import { useEffect, useState } from 'react'
import { useDependencies } from '@/app/dependencies-context'

export type EngineStatus = 'checking' | 'online' | 'offline'

const CHECK_INTERVAL_MS = 10_000

export function useEngineStatus(): EngineStatus {
  const { scraper } = useDependencies()
  const [status, setStatus] = useState<EngineStatus>('checking')

  useEffect(() => {
    let active = true
    const check = async () => {
      const available = await scraper.isAvailable()
      if (active) setStatus(available ? 'online' : 'offline')
    }
    check()
    const timer = setInterval(check, CHECK_INTERVAL_MS)
    return () => {
      active = false
      clearInterval(timer)
    }
  }, [scraper])

  return status
}
