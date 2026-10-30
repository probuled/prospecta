import { describe, expect, it } from 'vitest'
import { renderMessage } from '../message-template'
import { makeLead } from './fixtures'

describe('renderMessage', () => {
  it('substitui todas as variáveis', () => {
    const lead = makeLead({ rating: 4.75 })
    expect(renderMessage('{nome} ({categoria}) em {cidade}: {nota}★ — {nome}', lead)).toBe(
      'Clínica Sorriso (Dentista) em Campinas, SP: 4.8★ — Clínica Sorriso',
    )
  })
})

describe('renderMessage com {diagnostico}', () => {
  it('usa a comparação com os concorrentes do contexto', () => {
    const comparison = { radiusKm: 2, peers: 5, peersWithSite: 3, peersAverageReviews: 40 }
    expect(renderMessage('Vi que {diagnostico}.', makeLead(), { comparison })).toBe(
      'Vi que 3 de 5 concorrentes num raio de 2 km já têm site.',
    )
  })
})
