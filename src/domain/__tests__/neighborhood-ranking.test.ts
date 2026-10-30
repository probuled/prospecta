import { describe, expect, it } from 'vitest'
import { rankNeighborhoodsWithoutSite } from '../neighborhood-ranking'
import { makeLead, makeProfile } from './fixtures'

const inNeighborhood = (neighborhood: string, website = '') =>
  makeLead({ id: crypto.randomUUID(), website, profile: makeProfile({ neighborhood }) })

describe('rankNeighborhoodsWithoutSite', () => {
  it('ordena pela parcela sem site e ignora bairros com poucos leads', () => {
    const leads = [
      inNeighborhood('Centro'),
      inNeighborhood('Centro'),
      inNeighborhood('Centro', 'https://a.com.br'),
      inNeighborhood('Nobre'),
      inNeighborhood('Nobre', 'https://instagram.com/b'),
      inNeighborhood('Nobre'),
      inNeighborhood('Janga'),
      inNeighborhood('Janga'),
      makeLead({ id: 'antigo' }),
    ]

    expect(rankNeighborhoodsWithoutSite(leads)).toEqual([
      { neighborhood: 'Nobre', total: 3, withoutSite: 3, share: 1 },
      { neighborhood: 'Centro', total: 3, withoutSite: 2, share: 2 / 3 },
    ])
  })
})
