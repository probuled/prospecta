import { useSearchParams } from 'react-router'
import { LEAD_STATUSES, type LeadStatus } from '@/domain/lead'

export const ALL = 'all'

export interface MapFilters {
  readonly status: LeadStatus | typeof ALL
  readonly searchId: string
}

const isStatus = (value: string | null): value is LeadStatus => LEAD_STATUSES.some((status) => status === value)

/** Filtros e lead selecionado na URL, para o link do mapa abrir do mesmo jeito. */
export function useMapFilters() {
  const [params, setParams] = useSearchParams()
  const status = params.get('status')
  const filters: MapFilters = { status: isStatus(status) ? status : ALL, searchId: params.get('busca') ?? ALL }
  const selectedId = params.get('lead')

  const setParam = (key: string, value: string | null) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (value === null || value === ALL) next.delete(key)
        else next.set(key, value)
        return next
      },
      { replace: true },
    )

  return {
    filters,
    selectedId,
    setStatus: (value: MapFilters['status']) => setParam('status', value),
    setSearchId: (value: string) => setParam('busca', value),
    select: (leadId: string | null) => setParam('lead', leadId),
    reset: () => setParams(new URLSearchParams(), { replace: true }),
  }
}
