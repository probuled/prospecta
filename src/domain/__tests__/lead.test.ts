import { describe, expect, it } from 'vitest'
import { mergeLead } from '../lead'
import { makeLead } from './fixtures'

describe('mergeLead', () => {
  it('preserva o trabalho de prospecção e atualiza os dados públicos', () => {
    const existing = makeLead({
      status: 'respondeu',
      notes: 'ligar segunda',
      dealValue: 1800,
      followUpAt: '2026-11-02T12:00:00.000Z',
      rating: 4.1,
      searchIds: ['s1'],
    })
    const incoming = makeLead({ rating: 4.6, searchIds: ['s2'], createdAt: '2026-05-05T00:00:00.000Z' })

    const merged = mergeLead(existing, incoming)

    expect(merged).toMatchObject({
      status: 'respondeu',
      notes: 'ligar segunda',
      dealValue: 1800,
      followUpAt: '2026-11-02T12:00:00.000Z',
      rating: 4.6,
    })
    expect(merged.searchIds).toEqual(['s1', 's2'])
    expect(merged.createdAt).toBe(existing.createdAt)
  })
})
