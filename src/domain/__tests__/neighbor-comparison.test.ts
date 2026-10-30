import { describe, expect, it } from 'vitest'
import { distanceKm } from '../geo'
import { createNeighborComparer } from '../neighbor-comparison'
import { makeLead } from './fixtures'

const CENTER = { lat: -7.94, lon: -34.87 }
// ~0,0090 grau de latitude ≈ 1 km.
const north = (km: number) => ({ lat: CENTER.lat + km * 0.009, lon: CENTER.lon })

describe('distanceKm', () => {
  it('mede a distância em linha reta', () => {
    expect(distanceKm(CENTER, north(1))).toBeCloseTo(1, 1)
    expect(distanceKm(CENTER, CENTER)).toBe(0)
  })
})

describe('createNeighborComparer', () => {
  const lead = makeLead({ id: 'eu', category: 'Barbearia', location: CENTER })
  const leads = [
    lead,
    makeLead({ id: 'a', category: 'barbearia ', location: north(0.5), website: 'https://a.com.br', reviewCount: 40 }),
    makeLead({ id: 'b', category: 'Barbearia', location: north(1.5), website: 'https://instagram.com/b', reviewCount: 20 }),
    makeLead({ id: 'longe', category: 'Barbearia', location: north(5), website: 'https://longe.com.br' }),
    makeLead({ id: 'outra', category: 'Pizzaria', location: north(0.2), website: 'https://pizza.com.br' }),
    makeLead({ id: 'sem-posicao', category: 'Barbearia', location: null }),
  ]

  it('compara com a mesma categoria dentro do raio', () => {
    expect(createNeighborComparer(leads)(lead)).toEqual({ radiusKm: 2, peers: 2, peersWithSite: 1, peersAverageReviews: 30 })
  })

  it('devolve null sem posição ou sem concorrentes por perto', () => {
    const compare = createNeighborComparer(leads)
    expect(compare(makeLead({ location: null }))).toBeNull()
    expect(compare(makeLead({ id: 'x', category: 'Dentista', location: CENTER }))).toBeNull()
  })
})
