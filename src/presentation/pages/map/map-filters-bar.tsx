import { Select, type SelectOption } from '@/components/prospecta/select'
import { LEAD_STATUSES, LEAD_STATUS_LABELS } from '@/domain/lead'
import type { Search } from '@/domain/search'
import { formatCount } from '@/presentation/format'
import { ALL, type MapFilters } from './use-map-filters'

const STATUS_OPTIONS: SelectOption<MapFilters['status']>[] = [
  { value: ALL, label: 'Todos os status' },
  ...LEAD_STATUSES.map((status) => ({ value: status, label: LEAD_STATUS_LABELS[status] })),
]

interface MapFiltersBarProps {
  readonly filters: MapFilters
  readonly searches: readonly Search[]
  readonly shown: number
  readonly total: number
  readonly onStatusChange: (status: MapFilters['status']) => void
  readonly onSearchChange: (searchId: string) => void
}

export function MapFiltersBar({ filters, searches, shown, total, onStatusChange, onSearchChange }: MapFiltersBarProps) {
  const searchOptions: SelectOption<string>[] = [
    { value: ALL, label: 'Todas as buscas' },
    ...searches.filter((search) => search.status === 'ok').map((search) => ({ value: search.id, label: search.keyword })),
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={filters.searchId}
        options={searchOptions}
        active={filters.searchId !== ALL}
        onChange={onSearchChange}
        aria-label="Busca"
        className="max-w-full sm:max-w-80"
      />
      <Select
        value={filters.status}
        options={STATUS_OPTIONS}
        active={filters.status !== ALL}
        onChange={onStatusChange}
        aria-label="Status"
      />
      <span className="text-caption ml-auto text-ink-muted">
        <span className="font-mono">{formatCount(shown)}</span> de <span className="font-mono">{formatCount(total)}</span> no mapa
      </span>
    </div>
  )
}
