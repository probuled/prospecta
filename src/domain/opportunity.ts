import type { Lead } from './lead'
import { parsePhone } from './phone'
import { classifyWebsite } from './website-presence'

export type OpportunityLevel = 'quente' | 'morno' | 'frio'

export interface Opportunity {
  readonly score: number
  readonly level: OpportunityLevel
  readonly reasons: readonly string[]
}

/**
 * Cada regra é independente: para mudar a pontuação basta adicionar
 * ou remover uma regra da lista, sem mexer no cálculo (Open/Closed).
 */
export interface OpportunityRule {
  readonly reason: string
  readonly points: number
  applies(lead: Lead): boolean
}

export const DEFAULT_OPPORTUNITY_RULES: readonly OpportunityRule[] = [
  { reason: 'Não tem site', points: 45, applies: (lead) => classifyWebsite(lead.website) === 'none' },
  { reason: 'Só tem rede social ou plataforma', points: 35, applies: (lead) => classifyWebsite(lead.website) === 'social' },
  { reason: 'Nota alta (4.5+)', points: 15, applies: (lead) => (lead.rating ?? 0) >= 4.5 },
  { reason: 'Muitas avaliações (negócio ativo)', points: 15, applies: (lead) => lead.reviewCount >= 50 },
  { reason: 'Algumas avaliações', points: 5, applies: (lead) => lead.reviewCount >= 10 && lead.reviewCount < 50 },
  { reason: 'Celular (provável WhatsApp)', points: 15, applies: (lead) => parsePhone(lead.phone)?.isMobile ?? false },
  { reason: 'Tem email', points: 5, applies: (lead) => lead.emails.length > 0 },
]

const MAX_SCORE = 100
const HOT_THRESHOLD = 80
const WARM_THRESHOLD = 50

/** Faixas do design system: quente ≥ 80, morno 50–79, frio < 50. */
export function temperatureOf(score: number): OpportunityLevel {
  if (score >= HOT_THRESHOLD) return 'quente'
  if (score >= WARM_THRESHOLD) return 'morno'
  return 'frio'
}

export function evaluateOpportunity(lead: Lead, rules: readonly OpportunityRule[] = DEFAULT_OPPORTUNITY_RULES): Opportunity {
  const matched = rules.filter((rule) => rule.applies(lead))
  const score = Math.min(
    MAX_SCORE,
    matched.reduce((total, rule) => total + rule.points, 0),
  )
  return { score, level: temperatureOf(score), reasons: matched.map((rule) => rule.reason) }
}
