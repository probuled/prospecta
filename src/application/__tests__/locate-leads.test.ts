import { describe, expect, it, vi } from 'vitest'
import { LocationNotFoundError, type Geocoder } from '@/application/ports/geocoder'
import type { LeadRepository, SearchRepository } from '@/application/ports/repositories'
import type { ScrapedPlace, ScraperGateway } from '@/application/ports/scraper-gateway'
import { LocateLeads } from '@/application/use-cases/locate-leads'
import { makeLead } from '@/domain/__tests__/fixtures'
import type { Lead, LeadPatch } from '@/domain/lead'
import type { Search } from '@/domain/search'

function leadRepository(initial: Lead[]): LeadRepository {
  let leads = initial
  return {
    getSnapshot: () => leads,
    subscribe: () => () => undefined,
    upsertMany: () => undefined,
    removeFromSearch: () => undefined,
    update: (id: string, patch: LeadPatch) => {
      leads = leads.map((lead) => (lead.id === id ? { ...lead, ...patch } : lead))
    },
  }
}

function searchRepository(searches: Search[]): SearchRepository {
  return {
    getSnapshot: () => searches,
    subscribe: () => () => undefined,
    findById: (id) => searches.find((search) => search.id === id),
    save: () => undefined,
    remove: () => undefined,
  }
}

const search: Search = {
  id: 's1',
  niche: 'Dentista',
  city: 'Campinas, SP',
  depth: 5,
  withEmails: false,
  keyword: 'Dentista em Campinas, SP',
  status: 'ok',
  leadCount: 2,
  maxTimeSeconds: 405,
  createdAt: '2026-01-01T00:00:00.000Z',
}

const place = (placeId: string, location: ScrapedPlace['location']): ScrapedPlace => ({
  placeId,
  title: placeId,
  category: '',
  address: '',
  phone: '',
  website: '',
  emails: [],
  rating: null,
  reviewCount: 0,
  mapsUrl: '',
  location,
})

function scraper(places: ScrapedPlace[] | Error): ScraperGateway {
  return {
    isAvailable: async () => true,
    createJob: async () => 'job',
    getJobStatus: async () => 'ok',
    fetchResults: async () => {
      if (places instanceof Error) throw places
      return places
    },
    deleteJob: async () => undefined,
  }
}

describe('LocateLeads', () => {
  it('usa a coordenada do motor e geocodifica pelo endereço só o que sobrou', async () => {
    const leads = leadRepository([
      makeLead({ id: 'a', address: 'Rua A, 1' }),
      makeLead({ id: 'b', address: 'Rua B, 2' }),
      makeLead({ id: 'c', address: 'Rua inexistente' }),
      makeLead({ id: 'd', location: { lat: 1, lon: 1 } }),
    ])
    const geocode = vi.fn<Geocoder['geocode']>(async (address) => {
      if (address === 'Rua B, 2') return { lat: -22.8, lon: -47.0 }
      throw new LocationNotFoundError(address)
    })
    const useCase = new LocateLeads(scraper([place('a', { lat: -22.9, lon: -47.1 })]), { geocode }, searchRepository([search]), leads)

    const result = await useCase.execute()

    expect(result).toEqual({ fromEngine: 1, fromAddress: 1, notFound: 1 })
    expect(geocode).toHaveBeenCalledTimes(2)
    expect(leads.getSnapshot().map((lead) => lead.location ?? null)).toEqual([
      { lat: -22.9, lon: -47.1 },
      { lat: -22.8, lon: -47.0 },
      null,
      { lat: 1, lon: 1 },
    ])
  })

  it('segue pelo endereço quando o motor está offline', async () => {
    const leads = leadRepository([makeLead({ id: 'a', address: 'Rua A, 1' })])
    const useCase = new LocateLeads(
      scraper(new Error('offline')),
      { geocode: async () => ({ lat: -22.9, lon: -47.1 }) },
      searchRepository([search]),
      leads,
    )

    expect(await useCase.execute()).toEqual({ fromEngine: 0, fromAddress: 1, notFound: 0 })
  })
})
