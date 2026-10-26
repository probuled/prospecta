import type { SearchRepository } from '@/application/ports/repositories'
import type { Search } from '@/domain/search'
import { LocalStorageStore } from './local-storage-store'

export class LocalStorageSearchRepository implements SearchRepository {
  private readonly store = new LocalStorageStore<readonly Search[]>('prospecta:searches', [], 'garimpo:searches')

  getSnapshot = () => this.store.getSnapshot()
  subscribe = (listener: () => void) => this.store.subscribe(listener)

  findById(id: string): Search | undefined {
    return this.store.getSnapshot().find((search) => search.id === id)
  }

  save(search: Search): void {
    const others = this.store.getSnapshot().filter((existing) => existing.id !== search.id)
    const sorted = [search, ...others].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    this.store.set(sorted)
  }

  remove(id: string): void {
    this.store.set(this.store.getSnapshot().filter((search) => search.id !== id))
  }
}
