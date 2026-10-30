import { Columns3, Download, List, Search as SearchIcon, Users } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { useDependencies } from '@/app/dependencies-context'
import { ROUTES } from '@/app/routes'
import { Button, ButtonLink } from '@/components/prospecta/button'
import { EmptyState } from '@/components/prospecta/empty-state'
import { PageHeader } from '@/components/prospecta/page-header'
import { BackupActions } from '@/presentation/components/backup-actions'
import { SegmentedControl, type SegmentOption } from '@/components/prospecta/segmented-control'
import type { LeadPatch, LeadStatus } from '@/domain/lead'
import { formatCount } from '@/presentation/format'
import { useLeads, useSearches } from '@/presentation/hooks/use-store'
import { LeadDetailDialog } from './lead-detail-dialog'
import { LeadFiltersBar } from './lead-filters-bar'
import { LeadStats } from './lead-stats'
import type { LeadView } from './lead-view'
import { LeadsTable } from './leads-table'
import { PipelineBoard } from './pipeline/pipeline-board'
import { useLeadFilters } from './use-lead-filters'
import { useLeadsViewMode, type LeadsViewMode } from './use-leads-view-mode'

const LEAD_PARAM = 'lead'

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
  const [params, setParams] = useSearchParams()
  // O lead aberto fica na URL para o mapa (e outras telas) poderem linkar direto para ele.
  const selectedId = params.get(LEAD_PARAM)
  const setSelectedId = (leadId: string | null) =>
    setParams((current) => {
      const next = new URLSearchParams(current)
      if (leadId) next.set(LEAD_PARAM, leadId)
      else next.delete(LEAD_PARAM)
      return next
    })

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
          description="Os negócios encontrados aparecem aqui, ordenados por oportunidade. Trocou de navegador? Restaure seu backup."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <ButtonLink to={ROUTES.search} variant="primary">
                <SearchIcon /> Buscar leads
              </ButtonLink>
              <BackupActions canDownload={false} />
            </div>
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
            <Button icon={Download} onClick={exportFiltered} disabled={filtered.length === 0}>
              Exportar CSV
            </Button>
            <BackupActions />
          </>
        }
      />
      <LeadStats views={views} />
      <div className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <SegmentedControl
            label="Modo de visualização"
            showLabel
            variant="outline"
            size="md"
            options={VIEW_OPTIONS}
            value={viewMode}
            onChange={setViewMode}
            className="self-start"
          />
          <div aria-hidden className="hidden h-6 w-px shrink-0 self-end bg-line lg:mb-1.5 lg:block" />
          <div className="min-w-0 flex-1">
            <LeadFiltersBar
              filters={filters}
              searches={searches}
              hideStatus={isPipeline}
              activeCount={activeCount}
              resultLabel={`${formatCount(filtered.length)} de ${formatCount(views.length)}`}
              onChange={setFilter}
              onReset={resetFilters}
            />
          </div>
        </div>
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
          <LeadsTable
            key={JSON.stringify(filters)}
            views={filtered}
            selectedId={selectedId}
            onSelect={selectLead}
            onStatusChange={moveLead}
          />
        )}
      </div>
      <LeadDetailDialog view={selected} onClose={() => setSelectedId(null)} onUpdate={updateLead} />
    </>
  )
}
