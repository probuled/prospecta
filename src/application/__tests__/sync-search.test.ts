import { describe, expect, it } from 'vitest'
import type { LeadRepository, SearchRepository } from '@/application/ports/repositories'
import type { ScrapedPlace, ScraperGateway } from '@/application/ports/scraper-gateway'
import { SyncSearch } from '@/application/use-cases/sync-search'
import { makeLead, makeProfile } from '@/domain/__tests__/fixtures'
import type { Lead } from '@/domain/lead'
import type { Search } from '@/domain/search'

const place = (placeId: string, website = ''): ScrapedPlace => ({
  placeId,
  title: placeId,
  category: 'Barbearia',
  address: '',
  phone: '',
  website,
  emails: [],
  rating: null,
  reviewCount: 0,
  mapsUrl: '',
  location: null,
  profile: makeProfile(),
})

const search = (id: string, createdAt: string, status: Search['status']): Search => ({
  id,
  niche: 'Barbearia',
  city: 'Recife, PE',
  depth: 5,
  withEmails: false,
  keyword: 'Barbearia em Recife, PE',
  status,
  leadCount: 0,
  maxTimeSeconds: 400,
  createdAt,
})

function setup(existingLeads: Lead[], existingSearches: Search[], places: ScrapedPlace[]) {
  let leads = existingLeads
  let searches = existingSearches
  const leadRepository: LeadRepository = {
    getSnapshot: () => leads,
    subscribe: () => () => undefined,
    upsertMany: (incoming) => {
      leads = [...leads.filter((lead) => !incoming.some((other) => other.id === lead.id)), ...incoming]
    },
    update: () => undefined,
    removeFromSearch: () => undefined,
    replaceAll: (next) => {
      leads = [...next]
    },
  }
  const searchRepository: SearchRepository = {
    getSnapshot: () => searches,
    subscribe: () => () => undefined,
    findById: (id) => searches.find((s) => s.id === id),
    save: (saved) => {
      searches = [saved, ...searches.filter((s) => s.id !== saved.id)]
    },
    remove: () => undefined,
    replaceAll: () => undefined,
  }
  const scraper: ScraperGateway = {
    isAvailable: async () => true,
    createJob: async () => 'job',
    getJobStatus: async () => 'ok',
    fetchResults: async () => places,
    deleteJob: async () => undefined,
  }
  return new SyncSearch(scraper, searchRepository, leadRepository)
}

describe('SyncSearch', () => {
  const first = search('s1', '2026-10-01T00:00:00.000Z', 'ok')
  const repeat = search('s2', '2026-10-30T00:00:00.000Z', 'working')

  it('na busca repetida, guarda o que mudou desde a anterior', async () => {
    const sync = setup(
      [makeLead({ id: 'a' }), makeLead({ id: 'b' })],
      [repeat, first],
      [place('a'), place('b', 'https://b.com.br'), place('c')],
    )

    const result = await sync.execute(repeat)

    expect(result).toMatchObject({ status: 'ok', leadCount: 3, changes: { newLeads: 1, gainedSite: 1 } })
  })

  it('na primeira busca de um termo, não compara', async () => {
    const sync = setup([], [repeat], [place('a')])
    expect((await sync.execute(repeat)).changes).toBeUndefined()
  })
})
