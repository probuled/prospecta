import { describe, expect, it } from 'vitest'
import { findInstagram } from '../instagram'

describe('findInstagram', () => {
  it('extrai o usuário do link do perfil', () => {
    expect(findInstagram('https://www.instagram.com/mundoburguer/')).toEqual({
      url: 'https://www.instagram.com/mundoburguer/',
      handle: 'mundoburguer',
    })
  })

  it('aceita link sem protocolo, com parâmetros e subdomínio', () => {
    expect(findInstagram('instagram.com/seu.burguer?igsh=abc')?.handle).toBe('seu.burguer')
    expect(findInstagram('https://m.instagram.com/Rock_My_Burger')?.handle).toBe('Rock_My_Burger')
  })

  it('link de post abre o post, mas sem usuário', () => {
    expect(findInstagram('https://instagram.com/p/C1a2b3/')).toEqual({ url: 'https://instagram.com/p/C1a2b3/', handle: null })
  })

  it('ignora sites que não são do Instagram', () => {
    expect(findInstagram('https://silenestruck.com.br')).toBeNull()
    expect(findInstagram('https://facebook.com/mundoburguer')).toBeNull()
    expect(findInstagram('https://notinstagram.com/x')).toBeNull()
    expect(findInstagram('')).toBeNull()
  })
})
