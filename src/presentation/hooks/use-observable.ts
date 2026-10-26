import { useSyncExternalStore } from 'react'
import type { Observable } from '@/application/ports/repositories'

export function useObservable<T>(observable: Observable<T>): T {
  return useSyncExternalStore(observable.subscribe, observable.getSnapshot)
}
