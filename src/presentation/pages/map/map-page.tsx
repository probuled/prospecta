import { Earth, MapPinOff, Search as SearchIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useDependencies } from '@/app/dependencies-context'
import { ROUTES } from '@/app/routes'
import { Button, ButtonLink } from '@/components/prospecta/button'
import { EmptyState } from '@/components/prospecta/empty-state'
import { PageHeader } from '@/components/prospecta/page-header'
import { useLeads, useSearches } from '@/presentation/hooks/use-store'
import { useSharedEngineStatus } from '@/presentation/layout/engine-status-context'
import { LeadMap } from './lead-map'
import { isLocated } from './lead-map-layers'
import { LocateLeadsButton } from './locate-leads-button'
import { MapFiltersPanel } from './map-filters-panel'
import { MapLegend } from './map-legend'
import { SelectedLeadCard } from './selected-lead-card'
import { ALL, useMapFilters } from './use-map-filters'

export function MapPage() {
  const { leads: leadRepository } = useDependencies()
  const leads = useLeads()
  const searches = useSearches()
  const engineStatus = useSharedEngineStatus()
  const { filters, selectedId, setStatus, setSearchId, select, reset } = useMapFilters()
  const [mapAttempt, setMapAttempt] = useState(0)

  const located = useMemo(() => leads.filter(isLocated), [leads])
  const visible = useMemo(
    () =>
      located.filter(
        (lead) =>
          (filters.status === ALL || lead.status === filters.status) &&
          (filters.searchId === ALL || lead.searchIds.includes(filters.searchId)),
      ),
    [located, filters.status, filters.searchId],
  )
  const selected = visible.find((lead) => lead.id === selectedId) ?? null
  const unlocatedCount = leads.length - located.length

  if (leads.length === 0) {
    return (
      <>
        <PageHeader title="Mapa" />
        <EmptyState
          icon={Earth}
          title="Nenhum lead ainda. Faça uma busca."
          description="Cada negócio encontrado vira um ponto no mapa, colorido pela etapa do funil."
          action={
            <ButtonLink to={ROUTES.search} variant="primary">
              <SearchIcon /> Buscar leads
            </ButtonLink>
          }
        />
      </>
    )
  }

  if (located.length === 0) {
    return (
      <>
        <PageHeader title="Mapa" />
        <EmptyState
          icon={MapPinOff}
          title="Nenhum lead com posição ainda."
          description="Os leads salvos antes do mapa não guardaram a posição. Localize agora: primeiro pelo motor, depois pelo endereço."
          action={<LocateLeadsButton unlocatedCount={unlocatedCount} variant="primary" />}
        />
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Mapa"
        description={
          unlocatedCount > 0 && engineStatus === 'offline'
            ? 'O motor está parado: a posição dos leads antigos vai vir só do endereço, que é menos precisa.'
            : 'Onde ficam os negócios que você encontrou.'
        }
        actions={unlocatedCount > 0 && <LocateLeadsButton unlocatedCount={unlocatedCount} />}
      />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="h-[60svh] lg:h-[calc(100svh-12rem)]">
          <LeadMap
            key={mapAttempt}
            leads={visible}
            selectedId={selected?.id ?? null}
            fitKey={`${filters.status}|${filters.searchId}`}
            onSelect={select}
            popup={
              selected && {
                location: selected.location,
                content: (
                  <SelectedLeadCard
                    lead={selected}
                    onStatusChange={(status) => leadRepository.update(selected.id, { status })}
                    onClose={() => select(null)}
                  />
                ),
              }
            }
            onRetry={() => setMapAttempt((attempt) => attempt + 1)}
          />
        </div>
        <aside className="space-y-4">
          <MapLegend />
          <MapFiltersPanel
            filters={filters}
            searches={searches}
            shown={visible.length}
            total={located.length}
            onStatusChange={setStatus}
            onSearchChange={setSearchId}
          />
          {visible.length === 0 && (
            <div role="status" className="space-y-3 rounded-lg border border-dashed border-line-strong p-5">
              <p className="font-medium">Nenhum lead com esses filtros.</p>
              <Button size="sm" onClick={reset}>
                Limpar filtros
              </Button>
            </div>
          )}
        </aside>
      </div>
    </>
  )
}
