import type { LeadStatus } from '@/domain/lead'
import type { OpportunityLevel } from '@/domain/opportunity'
import type { WebsitePresence } from '@/domain/website-presence'
import type { LeadView } from './lead-view'

export const ALL = 'all'
type OrAll<T> = T | typeof ALL

export interface LeadFilters {
  readonly query: string
  readonly presence: OrAll<WebsitePresence | 'no-own'>
  readonly level: OrAll<OpportunityLevel>
  readonly status: OrAll<LeadStatus>
  readonly searchId: OrAll<string>
  readonly mobileOnly: boolean
}

export const DEFAULT_FILTERS: LeadFilters = {
  query: '',
  presence: 'no-own',
  level: ALL,
  status: ALL,
  searchId: ALL,
  mobileOnly: false,
}

type Predicate = (view: LeadView, filters: LeadFilters) => boolean

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

const PREDICATES: readonly Predicate[] = [
  ({ lead }, { query }) => !query.trim() || normalize(`${lead.name} ${lead.category} ${lead.address}`).includes(normalize(query.trim())),
  ({ presence }, filters) =>
    filters.presence === ALL || (filters.presence === 'no-own' ? presence !== 'own' : presence === filters.presence),
  ({ opportunity }, { level }) => level === ALL || opportunity.level === level,
  ({ lead }, { status }) => status === ALL || lead.status === status,
  ({ lead }, { searchId }) => searchId === ALL || lead.searchIds.includes(searchId),
  ({ phone }, { mobileOnly }) => !mobileOnly || (phone?.isMobile ?? false),
]

/** Quantos filtros estão diferentes do padrão (a busca selecionada conta como filtro). */
export function countActiveFilters(filters: LeadFilters, { ignoreStatus = false } = {}): number {
  return (Object.keys(DEFAULT_FILTERS) as (keyof LeadFilters)[]).filter((key) => {
    if (key === 'status' && ignoreStatus) return false
    if (key === 'query') return filters.query.trim() !== ''
    return filters[key] !== DEFAULT_FILTERS[key]
  }).length
}

export function applyLeadFilters(views: readonly LeadView[], filters: LeadFilters): LeadView[] {
  return views
    .filter((view) => PREDICATES.every((matches) => matches(view, filters)))
    .sort((a, b) => b.opportunity.score - a.opportunity.score || b.lead.reviewCount - a.lead.reviewCount)
}
