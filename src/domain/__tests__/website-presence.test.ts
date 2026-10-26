import { describe, expect, it } from 'vitest'
import { classifyWebsite } from '../website-presence'

describe('classifyWebsite', () => {
  it.each([
    ['', 'none'],
    ['   ', 'none'],
    ['https://www.instagram.com/clinicasorriso', 'social'],
    ['linktr.ee/clinica', 'social'],
    ['https://m.facebook.com/clinica', 'social'],
    ['https://www.ifood.com.br/delivery/x', 'social'],
    ['https://clinicasorriso.com.br', 'own'],
    ['clinicasorriso.com.br', 'own'],
  ])('%s → %s', (website, expected) => {
    expect(classifyWebsite(website)).toBe(expected)
  })
})
