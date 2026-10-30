import { describe, expect, it } from 'vitest'
import { mergeLead } from '../lead'
import { makeLead, makeProfile } from './fixtures'

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

describe('mergeLead com localização', () => {
  it('lê lead salvo antes do mapa (sem location) e passa a ter a posição da nova raspagem', () => {
    const legacy = makeLead()
    const incoming = makeLead({ location: { lat: -22.9, lon: -47.06 } })

    expect(legacy.location).toBeUndefined()
    expect(mergeLead(legacy, incoming).location).toEqual({ lat: -22.9, lon: -47.06 })
  })

  it('mantém a posição já encontrada quando a nova raspagem vem sem coordenadas', () => {
    const existing = makeLead({ location: { lat: -22.9, lon: -47.06 } })

    expect(mergeLead(existing, makeLead({ location: null })).location).toEqual({ lat: -22.9, lon: -47.06 })
  })
})

describe('mergeLead com perfil do negócio', () => {
  it('lê lead salvo antes do perfil (sem profile) e passa a ter o perfil da nova raspagem', () => {
    const legacy = makeLead({ status: 'contatado' })
    const profile = makeProfile({ description: 'Barbearia clássica', hasOwner: true })

    const merged = mergeLead(legacy, makeLead({ profile }))

    expect(legacy.profile).toBeUndefined()
    expect(merged.profile).toEqual(profile)
    expect(merged.status).toBe('contatado')
  })
})
