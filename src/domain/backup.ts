import type { Lead } from './lead'
import type { Search } from './search'
import { MAX_MESSAGE_TEMPLATES, type Settings } from './settings'

export const BACKUP_FORMAT = 'prospecta-backup'
export const BACKUP_VERSION = 1

/** Tudo o que o Prospecta guarda no navegador, num arquivo só. */
export interface Backup {
  readonly format: typeof BACKUP_FORMAT
  readonly version: typeof BACKUP_VERSION
  readonly exportedAt: string
  readonly leads: readonly Lead[]
  readonly searches: readonly Search[]
  readonly settings: Settings
}

export interface AppData {
  readonly leads: readonly Lead[]
  readonly searches: readonly Search[]
  readonly settings: Settings
}

export interface RestoreSummary {
  readonly leadsAdded: number
  readonly leadsUpdated: number
  readonly searchesAdded: number
  readonly templatesAdded: number
}

export function createBackup(data: AppData, now: Date): Backup {
  return { format: BACKUP_FORMAT, version: BACKUP_VERSION, exportedAt: now.toISOString(), ...data }
}

/**
 * Junta o backup com o que já está no navegador, sem apagar nada.
 * No mesmo lead vence a versão alterada por último: um backup antigo não desfaz trabalho mais novo.
 * Modelos de mensagem do backup entram até o limite; o modelo em uso continua o mesmo.
 */
export function mergeBackup(current: AppData, backup: Backup): { readonly data: AppData; readonly summary: RestoreSummary } {
  const leads = new Map(current.leads.map((lead) => [lead.id, lead]))
  let leadsAdded = 0
  let leadsUpdated = 0
  for (const lead of backup.leads) {
    const existing = leads.get(lead.id)
    if (!existing) leadsAdded += 1
    else if (lead.updatedAt > existing.updatedAt) leadsUpdated += 1
    else continue
    leads.set(lead.id, lead)
  }

  const knownSearchIds = new Set(current.searches.map((search) => search.id))
  const newSearches = backup.searches.filter((search) => !knownSearchIds.has(search.id))
  const searches = [...current.searches, ...newSearches].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const knownTemplateIds = new Set(current.settings.messageTemplates.map((template) => template.id))
  const room = MAX_MESSAGE_TEMPLATES - current.settings.messageTemplates.length
  const newTemplates = backup.settings.messageTemplates.filter((template) => !knownTemplateIds.has(template.id)).slice(0, Math.max(0, room))

  return {
    data: {
      leads: [...leads.values()],
      searches,
      settings: { ...current.settings, messageTemplates: [...current.settings.messageTemplates, ...newTemplates] },
    },
    summary: { leadsAdded, leadsUpdated, searchesAdded: newSearches.length, templatesAdded: newTemplates.length },
  }
}
