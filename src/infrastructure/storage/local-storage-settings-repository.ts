import type { SettingsRepository } from '@/application/ports/repositories'
import { DEFAULT_SETTINGS, type Settings } from '@/domain/settings'
import { LocalStorageStore } from './local-storage-store'

export class LocalStorageSettingsRepository implements SettingsRepository {
  private readonly store = new LocalStorageStore<Settings>('prospecta:settings', DEFAULT_SETTINGS, 'garimpo:settings')

  getSnapshot = () => this.store.getSnapshot()
  subscribe = (listener: () => void) => this.store.subscribe(listener)

  save(settings: Settings): void {
    this.store.set(settings)
  }
}
