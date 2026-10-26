import { Outlet } from 'react-router'
import { ROUTES } from '@/app/routes'
import { useEngineStatus } from '@/presentation/hooks/use-engine-status'
import { useSearchSync } from '@/presentation/hooks/use-search-sync'
import { useLeads, useSearches } from '@/presentation/hooks/use-store'
import { EngineStatusContext } from './engine-status-context'
import { MobileBottomNav, MobileTopBar } from './mobile-nav'
import { Sidebar } from './sidebar'

export function AppLayout() {
  const engineStatus = useEngineStatus()
  const leads = useLeads()
  const searches = useSearches()
  useSearchSync()

  const counts = {
    [ROUTES.leads]: leads.length,
    [ROUTES.search]: searches.filter((search) => search.status === 'working').length,
  }

  return (
    <EngineStatusContext value={engineStatus}>
      <div className="flex min-h-svh bg-bg text-ink">
        <Sidebar engineStatus={engineStatus} counts={counts} />
        <div className="flex min-w-0 flex-1 flex-col">
          <MobileTopBar engineStatus={engineStatus} />
          <main className="mx-auto w-full max-w-[var(--content-max)] flex-1 space-y-8 px-4 pt-6 pb-24 sm:px-6 lg:px-12 lg:pt-12 lg:pb-12">
            <Outlet />
          </main>
        </div>
        <MobileBottomNav />
      </div>
    </EngineStatusContext>
  )
}
