import { toast } from 'sonner'
import { useDependencies } from '@/app/dependencies-context'
import { Logo } from '@/components/prospecta/logo'
import type { SearchRequest } from '@/domain/search'
import { EngineOfflineAlert } from '@/presentation/components/engine-offline-alert'
import { useLeads, useSearches } from '@/presentation/hooks/use-store'
import { useSharedEngineStatus } from '@/presentation/layout/engine-status-context'
import { LeadsSummary } from './leads-summary'
import { SearchActivity } from './search-activity'
import { SearchForm } from './search-form'

export function SearchPage() {
  const { startSearch } = useDependencies()
  const searches = useSearches()
  const leads = useLeads()
  const engineStatus = useSharedEngineStatus()

  const handleSubmit = async (request: SearchRequest) => {
    try {
      const search = await startSearch.execute(request)
      toast('Busca iniciada', { description: `${search.keyword}. Leva alguns minutos; avisamos quando terminar.` })
    } catch (error) {
      toast.error('Não foi possível iniciar a busca', { description: (error as Error).message })
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 sm:pt-6">
      <header className="flex flex-col items-center gap-3 text-center">
        <Logo height={60} className="mb-5 hidden sm:inline-block" />
        <h1 className="text-display text-balance">Que negócio você quer prospectar hoje?</h1>
        <p className="max-w-md text-pretty text-ink-muted">
          Negócios locais do Google Maps, ordenados por oportunidade: quem não tem site e é bem avaliado aparece primeiro.
        </p>
      </header>
      {engineStatus === 'offline' && <EngineOfflineAlert />}
      <SearchForm disabled={engineStatus === 'offline'} onSubmit={handleSubmit} />
      <div className="grid items-start gap-4 pt-6 md:grid-cols-2">
        <SearchActivity searches={searches} />
        <LeadsSummary leads={leads} />
      </div>
    </div>
  )
}
