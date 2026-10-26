import { Search as SearchIcon, X } from 'lucide-react'
import { Button } from '@/components/prospecta/button'
import { Input } from '@/components/prospecta/input'
import { Select, type SelectOption } from '@/components/prospecta/select'
import { LEAD_STATUSES, LEAD_STATUS_LABELS } from '@/domain/lead'
import type { Search } from '@/domain/search'
import { ALL, DEFAULT_FILTERS, type LeadFilters } from './lead-filters'

const PRESENCE_OPTIONS: SelectOption<LeadFilters['presence']>[] = [
  { value: 'no-own', label: 'Sem site próprio' },
  { value: 'none', label: 'Sem nenhum site' },
  { value: 'social', label: 'Só rede social' },
  { value: 'own', label: 'Tem site' },
  { value: ALL, label: 'Qualquer presença' },
]

const LEVEL_OPTIONS: SelectOption<LeadFilters['level']>[] = [
  { value: ALL, label: 'Oportunidade' },
  { value: 'quente', label: 'Alta' },
  { value: 'morno', label: 'Média' },
  { value: 'frio', label: 'Baixa' },
]

const STATUS_OPTIONS: SelectOption<LeadFilters['status']>[] = [
  { value: ALL, label: 'Status' },
  ...LEAD_STATUSES.map((status) => ({ value: status, label: LEAD_STATUS_LABELS[status] })),
]

interface LeadFiltersBarProps {
  readonly filters: LeadFilters
  readonly searches: readonly Search[]
  readonly hideStatus?: boolean
  readonly activeCount: number
  /** "21 de 40", à direita da barra. */
  readonly resultLabel: string
  readonly onChange: <K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => void
  readonly onReset: () => void
}

export function LeadFiltersBar({ filters, searches, hideStatus = false, activeCount, resultLabel, onChange, onReset }: LeadFiltersBarProps) {
  const searchKeyword =
    filters.searchId === ALL ? null : (searches.find((search) => search.id === filters.searchId)?.keyword ?? 'removida')
  const isActive = (key: keyof LeadFilters) => filters[key] !== DEFAULT_FILTERS[key]

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        icon={SearchIcon}
        type="search"
        placeholder="Buscar nome, categoria, endereço"
        value={filters.query}
        onChange={(e) => onChange('query', e.target.value)}
        className="w-full sm:w-64"
      />
      <Select value={filters.presence} options={PRESENCE_OPTIONS} active={isActive('presence')} onChange={(v) => onChange('presence', v)} aria-label="Presença" />
      <Select value={filters.level} options={LEVEL_OPTIONS} active={isActive('level')} onChange={(v) => onChange('level', v)} aria-label="Oportunidade" />
      {!hideStatus && (
        <Select
          value={filters.status}
          options={STATUS_OPTIONS}
          active={isActive('status')}
          onChange={(v) => onChange('status', v)}
          aria-label="Status"
        />
      )}
      {searchKeyword && (
        <Button onClick={() => onChange('searchId', ALL)} className="max-w-64" aria-label={`Remover filtro da busca ${searchKeyword}`}>
          <span className="truncate">Busca: {searchKeyword}</span>
          <X />
        </Button>
      )}
      {activeCount > 0 && (
        <Button variant="ghost" onClick={onReset}>
          Limpar filtros
        </Button>
      )}
      <span className="text-data ml-auto text-ink-muted">{resultLabel}</span>
    </div>
  )
}
