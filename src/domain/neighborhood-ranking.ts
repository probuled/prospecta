import type { Lead } from './lead'
import { classifyWebsite } from './website-presence'

export interface NeighborhoodShare {
  readonly neighborhood: string
  readonly total: number
  readonly withoutSite: number
  /** De 0 a 1. */
  readonly share: number
}

/** Abaixo disso a porcentagem engana (1 de 1 = 100%). */
const MIN_LEADS_PER_NEIGHBORHOOD = 3

/** Bairros onde a maior parte dos negócios encontrados não tem site próprio: onde vale buscar mais. */
export function rankNeighborhoodsWithoutSite(leads: readonly Lead[], limit = 5): readonly NeighborhoodShare[] {
  const groups = new Map<string, { total: number; withoutSite: number }>()
  for (const lead of leads) {
    const neighborhood = lead.profile?.neighborhood.trim()
    if (!neighborhood) continue
    const group = groups.get(neighborhood) ?? { total: 0, withoutSite: 0 }
    group.total += 1
    if (classifyWebsite(lead.website) !== 'own') group.withoutSite += 1
    groups.set(neighborhood, group)
  }

  return [...groups]
    .filter(([, group]) => group.total >= MIN_LEADS_PER_NEIGHBORHOOD)
    .map(([neighborhood, group]) => ({ neighborhood, ...group, share: group.withoutSite / group.total }))
    .sort((a, b) => b.share - a.share || b.withoutSite - a.withoutSite || a.neighborhood.localeCompare(b.neighborhood, 'pt-BR'))
    .slice(0, limit)
}
