import { useDependencies } from '@/app/dependencies-context'
import { useObservable } from './use-observable'

export const useLeads = () => useObservable(useDependencies().leads)
export const useSearches = () => useObservable(useDependencies().searches)
export const useSettings = () => useObservable(useDependencies().settings)
