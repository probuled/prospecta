import type { Lead, LeadPatch } from '@/domain/lead'
import type { Search } from '@/domain/search'
import type { Settings } from '@/domain/settings'

/** Fonte de dados observável, no formato que o `useSyncExternalStore` do React espera. */
export interface Observable<T> {
  getSnapshot(): T
  subscribe(listener: () => void): () => void
}

export interface LeadRepository extends Observable<readonly Lead[]> {
  upsertMany(leads: readonly Lead[]): void
  update(id: string, patch: LeadPatch): void
  removeFromSearch(searchId: string): void
  /** Troca a lista inteira (restauração de backup). */
  replaceAll(leads: readonly Lead[]): void
}

export interface SearchRepository extends Observable<readonly Search[]> {
  findById(id: string): Search | undefined
  save(search: Search): void
  remove(id: string): void
  /** Troca a lista inteira (restauração de backup). */
  replaceAll(searches: readonly Search[]): void
}

export interface SettingsRepository extends Observable<Settings> {
  save(settings: Settings): void
}
