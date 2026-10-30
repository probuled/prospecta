import { describe, expect, it } from 'vitest'
import type { Search } from '../search'
import { describeChanges, diffResults, isRepeatSearch } from '../search-changes'
import { makeLead } from './fixtures'

const search = (id: string, keyword: string, createdAt: string, status: Search['status'] = 'ok'): Search => ({
  id,
  niche: '',
  city: '',
  depth: 5,
  withEmails: false,
  keyword,
  status,
  leadCount: 0,
  maxTimeSeconds: 400,
  createdAt,
})

describe('diffResults', () => {
  it('conta negócios novos e os que ganharam site', () => {
    const existing = [makeLead({ id: 'a' }), makeLead({ id: 'b', website: 'https://instagram.com/b' }), makeLead({ id: 'c' })]
    const incoming = [
      makeLead({ id: 'a' }),
      makeLead({ id: 'b', website: 'https://b.com.br' }),
      makeLead({ id: 'd' }),
      makeLead({ id: 'e' }),
    ]
    expect(diffResults(existing, incoming)).toEqual({ newLeads: 2, gainedSite: 1 })
  })
})

describe('isRepeatSearch', () => {
  const current = search('s3', 'Barbearias em Recife, PE', '2026-10-30T00:00:00.000Z', 'working')

  it('reconhece o mesmo termo já buscado antes, sem diferença de maiúsculas e espaços', () => {
    expect(isRepeatSearch(current, [current, search('s1', '  barbearias em  Recife, PE', '2026-10-01T00:00:00.000Z')])).toBe(true)
  })

  it('ignora busca diferente, que falhou ou que é mais nova', () => {
    expect(
      isRepeatSearch(current, [
        current,
        search('s1', 'Pizzarias em Recife, PE', '2026-10-01T00:00:00.000Z'),
        search('s2', 'Barbearias em Recife, PE', '2026-10-02T00:00:00.000Z', 'failed'),
        search('s4', 'Barbearias em Recife, PE', '2026-10-31T00:00:00.000Z'),
      ]),
    ).toBe(false)
  })
})

describe('describeChanges', () => {
  it('só cita quem ganhou site quando houver', () => {
    expect(describeChanges({ newLeads: 1, gainedSite: 0 })).toBe('1 novo na região')
    expect(describeChanges({ newLeads: 5, gainedSite: 2 })).toBe('5 novos na região · 2 ganharam site')
  })
})
