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
