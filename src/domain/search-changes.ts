import type { Lead } from './lead'
import type { Search } from './search'
import { classifyWebsite } from './website-presence'

/** O que mudou na região desde a última vez que a mesma busca foi feita. */
export interface SearchChanges {
  /** Negócios que nenhuma busca tinha trazido: abriram há pouco ou entraram no Google agora. */
  readonly newLeads: number
  /** Leads que não tinham site próprio e agora têm: saem da lista de oportunidades. */
  readonly gainedSite: number
}

export function diffResults(existing: readonly Lead[], incoming: readonly Lead[]): SearchChanges {
  const byId = new Map(existing.map((lead) => [lead.id, lead]))
  let newLeads = 0
  let gainedSite = 0
  for (const lead of incoming) {
    const before = byId.get(lead.id)
    if (!before) newLeads += 1
    else if (classifyWebsite(before.website) !== 'own' && classifyWebsite(lead.website) === 'own') gainedSite += 1
  }
  return { newLeads, gainedSite }
}

const normalizeKeyword = (keyword: string) => keyword.trim().toLowerCase().replace(/\s+/g, ' ')

/** Já houve uma busca concluída com o mesmo termo antes desta? Só aí a comparação faz sentido. */
export function isRepeatSearch(search: Search, searches: readonly Search[]): boolean {
  return searches.some(
    (other) =>
      other.id !== search.id &&
      other.status === 'ok' &&
      other.createdAt < search.createdAt &&
      normalizeKeyword(other.keyword) === normalizeKeyword(search.keyword),
  )
}

export function describeChanges({ newLeads, gainedSite }: SearchChanges): string {
  const parts = [
    `${newLeads} ${newLeads === 1 ? 'novo' : 'novos'} na região`,
    ...(gainedSite > 0 ? [`${gainedSite} ${gainedSite === 1 ? 'ganhou' : 'ganharam'} site`] : []),
  ]
  return parts.join(' · ')
}
