import { distanceKm, isValidCoordinates } from './geo'
import type { Lead } from './lead'
import { classifyWebsite } from './website-presence'

export const NEIGHBOR_RADIUS_KM = 2

/** Como o lead se compara aos negócios da mesma categoria por perto. */
export interface NeighborComparison {
  readonly radiusKm: number
  /** Concorrentes encontrados no raio, sem contar o próprio lead. */
  readonly peers: number
  readonly peersWithSite: number
  readonly peersAverageReviews: number
}

const categoryKey = (lead: Lead) => lead.category.trim().toLowerCase()

/**
 * Agrupa os leads por categoria uma vez e devolve a função que compara cada lead com os vizinhos.
 * Assim a lista inteira não é percorrida de novo para cada lead.
 */
export function createNeighborComparer(leads: readonly Lead[], radiusKm = NEIGHBOR_RADIUS_KM): (lead: Lead) => NeighborComparison | null {
  const byCategory = new Map<string, Lead[]>()
  for (const lead of leads) {
    if (!lead.location || !isValidCoordinates(lead.location) || !categoryKey(lead)) continue
    const group = byCategory.get(categoryKey(lead)) ?? []
    group.push(lead)
    byCategory.set(categoryKey(lead), group)
  }

  return (lead) => {
    const origin = lead.location
    if (!origin || !isValidCoordinates(origin)) return null
    const peers = (byCategory.get(categoryKey(lead)) ?? []).filter(
      (other) => other.id !== lead.id && other.location && distanceKm(origin, other.location) <= radiusKm,
    )
    if (peers.length === 0) return null
    return {
      radiusKm,
      peers: peers.length,
      peersWithSite: peers.filter((peer) => classifyWebsite(peer.website) === 'own').length,
      peersAverageReviews: Math.round(peers.reduce((total, peer) => total + peer.reviewCount, 0) / peers.length),
    }
  }
}
