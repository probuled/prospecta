import { Search as SearchIcon } from 'lucide-react'
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
  { value: ALL, label: 'Qualquer oportunidade' },
  { value: 'quente', label: 'Alta' },
  { value: 'morno', label: 'Média' },
  { value: 'frio', label: 'Baixa' },
]

const STATUS_OPTIONS: SelectOption<LeadFilters['status']>[] = [
  { value: ALL, label: 'Qualquer status' },
  ...LEAD_STATUSES.map((status) => ({ value: status, label: LEAD_STATUS_LABELS[status] })),
]

type PhoneFilter = 'any' | 'mobile'
const PHONE_OPTIONS: SelectOption<PhoneFilter>[] = [
  { value: 'any', label: 'Qualquer telefone' },
  { value: 'mobile', label: 'Só celular' },
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

export function LeadFiltersBar({
  filters,
  searches,
  hideStatus = false,
  activeCount,
  resultLabel,
  onChange,
  onReset,
}: LeadFiltersBarProps) {
  const searchOptions: SelectOption<string>[] = [
    { value: ALL, label: 'Todas as buscas' },
    ...searches.map((search) => ({ value: search.id, label: search.keyword })),
  ]
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
      <Select
        value={filters.searchId}
        options={searchOptions}
        active={isActive('searchId')}
        onChange={(v) => onChange('searchId', v)}
        className="max-w-64"
        aria-label="Busca"
      />
      <Select
        value={filters.mobileOnly ? 'mobile' : 'any'}
        options={PHONE_OPTIONS}
        active={filters.mobileOnly}
        onChange={(v) => onChange('mobileOnly', v === 'mobile')}
        aria-label="Telefone"
      />
      {activeCount > 0 && (
        <Button variant="ghost" onClick={onReset}>
          Limpar filtros
        </Button>
      )}
      <span className="text-data ml-auto text-ink-muted">{resultLabel}</span>
    </div>
  )
}
