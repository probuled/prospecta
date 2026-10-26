import { useSearchParams } from 'react-router'

export type LeadsViewMode = 'lista' | 'pipeline'

const VIEW_PARAM = 'visao'

/** A visão fica na URL para sobreviver a recarregamentos e poder ser linkada. */
export function useLeadsViewMode(): [LeadsViewMode, (mode: LeadsViewMode) => void] {
  const [params, setParams] = useSearchParams()
  const mode: LeadsViewMode = params.get(VIEW_PARAM) === 'pipeline' ? 'pipeline' : 'lista'

  const setMode = (next: LeadsViewMode) =>
    setParams((current) => {
      const updated = new URLSearchParams(current)
      if (next === 'lista') updated.delete(VIEW_PARAM)
      else updated.set(VIEW_PARAM, next)
      return updated
    })

  return [mode, setMode]
}
