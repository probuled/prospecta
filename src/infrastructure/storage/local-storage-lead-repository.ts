import type { LeadRepository } from '@/application/ports/repositories'
import { mergeLead, type Lead, type LeadPatch } from '@/domain/lead'
import { LocalStorageStore } from './local-storage-store'

/** Status que existiam em versões anteriores do funil e o equivalente atual. */
const LEGACY_STATUSES: Record<string, Lead['status']> = { descartado: 'perdido' }

function migrateLegacyStatuses(leads: readonly Lead[]): readonly Lead[] | null {
  if (!leads.some((lead) => lead.status in LEGACY_STATUSES)) return null
  return leads.map((lead) => (lead.status in LEGACY_STATUSES ? { ...lead, status: LEGACY_STATUSES[lead.status] } : lead))
}

export class LocalStorageLeadRepository implements LeadRepository {
  private readonly store = new LocalStorageStore<readonly Lead[]>('prospecta:leads', [], 'garimpo:leads')

  constructor() {
    const migrated = migrateLegacyStatuses(this.store.getSnapshot())
    if (migrated) this.store.set(migrated)
  }

  getSnapshot = () => this.store.getSnapshot()
  subscribe = (listener: () => void) => this.store.subscribe(listener)

  upsertMany(incoming: readonly Lead[]): void {
    const byId = new Map(this.store.getSnapshot().map((lead) => [lead.id, lead]))
    for (const lead of incoming) {
      const existing = byId.get(lead.id)
      byId.set(lead.id, existing ? mergeLead(existing, lead) : lead)
    }
    this.store.set([...byId.values()])
  }

  update(id: string, patch: LeadPatch): void {
    const updatedAt = new Date().toISOString()
    this.store.set(this.store.getSnapshot().map((lead) => (lead.id === id ? { ...lead, ...patch, updatedAt } : lead)))
  }

  /** Tira a busca dos leads; quem não pertence a mais nenhuma busca é removido. */
  removeFromSearch(searchId: string): void {
    this.store.set(
      this.store
        .getSnapshot()
        .map((lead) => ({ ...lead, searchIds: lead.searchIds.filter((id) => id !== searchId) }))
        .filter((lead) => lead.searchIds.length > 0),
    )
  }
}
