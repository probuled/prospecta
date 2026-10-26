import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import type { Lead } from '@/domain/lead'
import { ALL, applyLeadFilters, countActiveFilters, DEFAULT_FILTERS, type LeadFilters } from './lead-filters'
import { toLeadView } from './lead-view'

const SEARCH_PARAM = 'busca'

interface UseLeadFiltersOptions {
  /** No pipeline as colunas já separam por status, então o filtro de status não se aplica. */
  readonly ignoreStatus?: boolean
}

/** Estado dos filtros; a busca selecionada fica na URL para poder linkar "ver leads desta busca". */
export function useLeadFilters(leads: readonly Lead[], { ignoreStatus = false }: UseLeadFiltersOptions = {}) {
  const [params, setParams] = useSearchParams()
  const [localFilters, setLocalFilters] = useState<Omit<LeadFilters, 'searchId'>>(DEFAULT_FILTERS)

  const filters: LeadFilters = useMemo(
    () => ({ ...localFilters, searchId: params.get(SEARCH_PARAM) ?? ALL }),
    [localFilters, params],
  )

  const setFilter = useCallback(
    <K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => {
      if (key !== 'searchId') {
        setLocalFilters((current) => ({ ...current, [key]: value }))
        return
      }
      setParams((current) => {
        const next = new URLSearchParams(current)
        if (value === ALL) next.delete(SEARCH_PARAM)
        else next.set(SEARCH_PARAM, String(value))
        return next
      })
    },
    [setParams],
  )

  const views = useMemo(() => leads.map(toLeadView), [leads])
  const filtered = useMemo(
    () => applyLeadFilters(views, ignoreStatus ? { ...filters, status: ALL } : filters),
    [views, filters, ignoreStatus],
  )

  const resetFilters = useCallback(() => {
    setLocalFilters(DEFAULT_FILTERS)
    setParams((current) => {
      const next = new URLSearchParams(current)
      next.delete(SEARCH_PARAM)
      return next
    })
  }, [setParams])

  const activeCount = countActiveFilters(filters, { ignoreStatus })

  return { filters, setFilter, resetFilters, activeCount, views, filtered }
}
