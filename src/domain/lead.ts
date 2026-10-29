import type { Coordinates } from './geo'

export const LEAD_STATUSES = ['novo', 'contatado', 'respondeu', 'negociando', 'fechado', 'perdido'] as const

export type LeadStatus = (typeof LEAD_STATUSES)[number]

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  novo: 'Novo',
  contatado: 'Contatado',
  respondeu: 'Respondeu',
  negociando: 'Negociando',
  fechado: 'Fechado',
  perdido: 'Perdido',
}

export interface Lead {
  readonly id: string
  readonly name: string
  readonly category: string
  readonly address: string
  readonly city: string
  readonly phone: string
  readonly emails: readonly string[]
  readonly website: string
  readonly rating: number | null
  readonly reviewCount: number
  readonly mapsUrl: string
  readonly searchIds: readonly string[]
  readonly status: LeadStatus
  readonly notes: string
  /** Valor da proposta em reais. Opcional: leads salvos antes do pipeline não têm. */
  readonly dealValue?: number | null
  /** Data/hora ISO do próximo contato combinado. */
  readonly followUpAt?: string | null
  /** Posição do negócio. Opcional: leads salvos antes do mapa não têm; `null` quando não foi possível localizar. */
  readonly location?: Coordinates | null
  readonly createdAt: string
  readonly updatedAt: string
}

export type LeadPatch = Partial<Pick<Lead, 'status' | 'notes' | 'dealValue' | 'followUpAt' | 'location'>>

/**
 * Junta um lead recém-raspado com o que já existe salvo, preservando o trabalho
 * de prospecção (status, notas, valor, próximo contato) e atualizando os dados públicos do negócio.
 */
export function mergeLead(existing: Lead, incoming: Lead): Lead {
  return {
    ...incoming,
    searchIds: [...new Set([...existing.searchIds, ...incoming.searchIds])],
    status: existing.status,
    notes: existing.notes,
    dealValue: existing.dealValue,
    followUpAt: existing.followUpAt,
    // Uma raspagem sem coordenadas não apaga a posição já encontrada.
    location: incoming.location ?? existing.location,
    createdAt: existing.createdAt,
  }
}
