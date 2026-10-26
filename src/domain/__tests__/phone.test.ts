import { describe, expect, it } from 'vitest'
import { buildWhatsAppUrl, parsePhone } from '../phone'

describe('parsePhone', () => {
  it('reconhece celular brasileiro sem DDI', () => {
    expect(parsePhone('(19) 99876-5432')).toEqual({ digits: '5519998765432', isMobile: true })
  })

  it('mantém o DDI quando já vem no número', () => {
    expect(parsePhone('+55 11 98765-4321')).toEqual({ digits: '5511987654321', isMobile: true })
  })

  it('marca telefone fixo como não celular', () => {
    expect(parsePhone('(19) 3232-1234')).toEqual({ digits: '551932321234', isMobile: false })
  })

  it('ignora números curtos demais', () => {
    expect(parsePhone('123')).toBeNull()
  })
})

describe('buildWhatsAppUrl', () => {
  it('codifica a mensagem na URL', () => {
    expect(buildWhatsAppUrl({ digits: '5519998765432', isMobile: true }, 'Olá, tudo bem?')).toBe(
      'https://wa.me/5519998765432?text=Ol%C3%A1%2C%20tudo%20bem%3F',
    )
  })
})
