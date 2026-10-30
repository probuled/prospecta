import { describe, expect, it } from 'vitest'
import { evaluateOpportunity, temperatureOf } from '../opportunity'
import { makeLead, makeProfile } from './fixtures'

describe('temperatureOf', () => {
  it.each([
    [100, 'quente'],
    [80, 'quente'],
    [79, 'morno'],
    [50, 'morno'],
    [49, 'frio'],
    [0, 'frio'],
  ])('%i → %s', (score, level) => {
    expect(temperatureOf(score)).toBe(level)
  })
})

describe('evaluateOpportunity', () => {
  it('lead sem site, bem avaliado e com celular é quente', () => {
    const lead = makeLead({ rating: 4.8, reviewCount: 120, phone: '(19) 99876-5432' })
    const opportunity = evaluateOpportunity(lead)
    expect(opportunity.level).toBe('quente')
    expect(opportunity.score).toBe(90)
    expect(opportunity.reasons).toContain('Não tem site')
  })

  it('lead com site próprio e sem tração é frio', () => {
    const lead = makeLead({ website: 'https://clinica.com.br', rating: 3.9, reviewCount: 3 })
    expect(evaluateOpportunity(lead)).toEqual({ score: 0, level: 'frio', reasons: [] })
  })

  it('nunca passa de 100', () => {
    const lead = makeLead({ rating: 5, reviewCount: 999, phone: '(19) 99876-5432', emails: ['a@b.com'] })
    expect(evaluateOpportunity(lead).score).toBe(95)
    const rules = [{ reason: 'x', points: 200, applies: () => true }]
    expect(evaluateOpportunity(lead, rules).score).toBe(100)
  })
})

describe('evaluateOpportunity com perfil do Google', () => {
  it('soma pontos quando falta horário ou foto no perfil', () => {
    const incomplete = makeLead({ website: 'https://x.com.br', profile: makeProfile() })
    expect(evaluateOpportunity(incomplete).reasons).toEqual(['Perfil do Google incompleto'])
    expect(evaluateOpportunity(makeLead({ website: 'https://x.com.br' })).reasons).toEqual([])
  })
})
