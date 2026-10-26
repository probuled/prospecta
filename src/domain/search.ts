export type SearchStatus = 'working' | 'ok' | 'failed'

export interface SearchRequest {
  readonly niche: string
  readonly city: string
  readonly depth: number
  readonly withEmails: boolean
}

export interface Search extends SearchRequest {
  readonly id: string
  readonly keyword: string
  readonly status: SearchStatus
  readonly leadCount: number
  readonly maxTimeSeconds: number
  readonly createdAt: string
  readonly finishedAt?: string
}

export const DEPTH_LIMITS = { min: 1, max: 20, default: 5 } as const

/** Cada nível de profundidade rola a lista do Maps e traz, em média, uns 6 negócios a mais. */
export const RESULTS_PER_DEPTH = 6

/** Quantidades oferecidas na tela de busca. 30 equivale à profundidade padrão. */
export const RESULT_COUNT_OPTIONS = [10, 20, 30, 60, 100] as const
export const DEFAULT_RESULT_COUNT = 30

/** Profundidade necessária para chegar perto da quantidade pedida, dentro dos limites do motor. */
export function depthForResultCount(count: number): number {
  return Math.min(DEPTH_LIMITS.max, Math.max(DEPTH_LIMITS.min, Math.ceil(count / RESULTS_PER_DEPTH)))
}

export function buildKeyword(niche: string, city: string): string {
  return `${niche.trim()} em ${city.trim()}`
}

/** Tempo máximo do job: mais profundidade e busca de emails pedem mais tempo. */
export function estimateMaxTimeSeconds({ depth, withEmails }: Pick<SearchRequest, 'depth' | 'withEmails'>): number {
  const BASE_SECONDS = 180
  const PER_DEPTH_SECONDS = 45
  const EMAIL_SECONDS = 240
  return BASE_SECONDS + depth * PER_DEPTH_SECONDS + (withEmails ? EMAIL_SECONDS : 0)
}
