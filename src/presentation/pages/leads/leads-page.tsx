import { Columns3, Download, List, Search as SearchIcon, Users } from 'lucide-react'
import { useState } from 'react'
import { useDependencies } from '@/app/dependencies-context'
import { ROUTES } from '@/app/routes'
import { Button, ButtonLink } from '@/components/prospecta/button'
import { EmptyState } from '@/components/prospecta/empty-state'
import { PageHeader } from '@/components/prospecta/page-header'
import { SegmentedControl, type SegmentOption } from '@/components/prospecta/segmented-control'
import type { LeadPatch, LeadStatus } from '@/domain/lead'
import { formatCount } from '@/presentation/format'
import { useLeads, useSearches } from '@/presentation/hooks/use-store'
import { LeadDetailSheet } from './lead-detail-sheet'
import { LeadFiltersBar } from './lead-filters-bar'
import { LeadStats } from './lead-stats'
import type { LeadView } from './lead-view'
import { LeadsTable } from './leads-table'
import { PipelineBoard } from './pipeline/pipeline-board'
import { useLeadFilters } from './use-lead-filters'
import { useLeadsViewMode, type LeadsViewMode } from './use-leads-view-mode'

const VIEW_OPTIONS: readonly SegmentOption<LeadsViewMode>[] = [
  { value: 'lista', label: 'Lista', icon: List },
  { value: 'pipeline', label: 'Pipeline', icon: Columns3 },
]

export function LeadsPage() {
  const { leads: leadRepository, exporter } = useDependencies()
  const leads = useLeads()
  const searches = useSearches()
  const [viewMode, setViewMode] = useLeadsViewMode()
  const isPipeline = viewMode === 'pipeline'
  const { filters, setFilter, resetFilters, activeCount, views, filtered } = useLeadFilters(leads, { ignoreStatus: isPipeline })
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = views.find((view) => view.lead.id === selectedId) ?? null
  const updateLead = (leadId: string, patch: LeadPatch) => leadRepository.update(leadId, patch)
  const moveLead = (leadId: string, status: LeadStatus) => updateLead(leadId, { status })
  const selectLead = (view: LeadView) => setSelectedId(view.lead.id)
  const exportFiltered = () =>
    exporter.export(
      filtered.map((view) => view.lead),
      `leads-${new Date().toISOString().slice(0, 10)}.csv`,
    )

  if (leads.length === 0) {
    return (
      <>
        <PageHeader title="Leads" />
        <EmptyState
          icon={Users}
          title="Nenhum lead ainda. Faça uma busca."
          description="Os negócios encontrados aparecem aqui, ordenados por oportunidade."
          action={
            <ButtonLink to={ROUTES.search} variant="primary">
              <SearchIcon /> Buscar leads
            </ButtonLink>
          }
        />
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Leads"
        description={isPipeline ? 'Arraste os cards entre as etapas do funil.' : 'Quem não tem site e é bem avaliado aparece primeiro.'}
        actions={
          <>
            <SegmentedControl label="Visualização" options={VIEW_OPTIONS} value={viewMode} onChange={setViewMode} />
            <Button icon={Download} onClick={exportFiltered} disabled={filtered.length === 0}>
              Exportar
            </Button>
          </>
        }
      />
      <LeadStats views={views} />
      <div className="space-y-4">
        <LeadFiltersBar
          filters={filters}
          searches={searches}
          hideStatus={isPipeline}
          activeCount={activeCount}
          resultLabel={`${formatCount(filtered.length)} de ${formatCount(views.length)}`}
          onChange={setFilter}
          onReset={resetFilters}
        />
        {filtered.length === 0 ? (
          <EmptyState
            icon={SearchIcon}
            title="Nenhum lead com esses filtros."
            description="Limpe os filtros para ver todos os leads."
            action={<Button onClick={resetFilters}>Limpar filtros</Button>}
          />
        ) : isPipeline ? (
          <PipelineBoard key={JSON.stringify(filters)} views={filtered} onSelect={selectLead} onMove={moveLead} />
        ) : (
          <LeadsTable key={JSON.stringify(filters)} views={filtered} selectedId={selectedId} onSelect={selectLead} onStatusChange={moveLead} />
        )}
      </div>
      <LeadDetailSheet view={selected} onClose={() => setSelectedId(null)} onUpdate={updateLead} />
    </>
  )
}
