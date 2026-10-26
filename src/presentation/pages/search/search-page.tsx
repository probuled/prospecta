import { toast } from 'sonner'
import { useDependencies } from '@/app/dependencies-context'
import { PageHeader } from '@/components/prospecta/page-header'
import type { SearchRequest } from '@/domain/search'
import { EngineOfflineAlert } from '@/presentation/components/engine-offline-alert'
import { useSearches } from '@/presentation/hooks/use-store'
import { useSharedEngineStatus } from '@/presentation/layout/engine-status-context'
import { SearchActivity } from './search-activity'
import { SearchForm } from './search-form'

export function SearchPage() {
  const { startSearch } = useDependencies()
  const searches = useSearches()
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
    <>
      <PageHeader title="Buscar leads" description="Negócios locais do Google Maps, ordenados por oportunidade: quem não tem site e é bem avaliado aparece primeiro." />
      {engineStatus === 'offline' && <EngineOfflineAlert />}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <SearchForm disabled={engineStatus === 'offline'} onSubmit={handleSubmit} />
        <SearchActivity searches={searches} />
      </div>
    </>
  )
}
