import { LocationNotFoundError, type Geocoder } from '@/application/ports/geocoder'
import { leadIdOf } from '@/application/mappers/place-to-lead'
import type { LeadRepository, SearchRepository } from '@/application/ports/repositories'
import type { ScraperGateway } from '@/application/ports/scraper-gateway'
import type { Coordinates } from '@/domain/geo'
import type { Lead } from '@/domain/lead'

export interface LocateLeadsProgress {
  readonly done: number
  readonly total: number
}

export interface LocateLeadsResult {
  readonly fromEngine: number
  readonly fromAddress: number
  readonly notFound: number
}

interface LocateLeadsOptions {
  readonly signal?: AbortSignal
  readonly onProgress?: (progress: LocateLeadsProgress) => void
}

/**
 * Dá posição aos leads salvos antes do mapa. Primeiro relê os resultados das buscas no motor,
 * que trazem a coordenada exata; o que sobrar é geocodificado pelo endereço.
 */
export class LocateLeads {
  private readonly scraper: ScraperGateway
  private readonly geocoder: Geocoder
  private readonly searches: SearchRepository
  private readonly leads: LeadRepository

  constructor(scraper: ScraperGateway, geocoder: Geocoder, searches: SearchRepository, leads: LeadRepository) {
    this.scraper = scraper
    this.geocoder = geocoder
    this.searches = searches
    this.leads = leads
  }

  async execute({ signal, onProgress }: LocateLeadsOptions = {}): Promise<LocateLeadsResult> {
    const fromEngine = await this.locateFromEngine(signal)

    const pending = this.unlocated().filter((lead) => lead.address.trim())
    let fromAddress = 0
    for (const [index, lead] of pending.entries()) {
      onProgress?.({ done: index, total: pending.length })
      const location = await this.geocodeAddress(lead.address, signal)
      if (location) {
        this.leads.update(lead.id, { location })
        fromAddress++
      }
    }
    onProgress?.({ done: pending.length, total: pending.length })

    return { fromEngine, fromAddress, notFound: this.unlocated().length }
  }

  private unlocated(): Lead[] {
    return this.leads.getSnapshot().filter((lead) => !lead.location)
  }

  private async locateFromEngine(signal?: AbortSignal): Promise<number> {
    const missing = new Set(this.unlocated().flatMap((lead) => lead.searchIds))
    const searches = this.searches.getSnapshot().filter((search) => search.status === 'ok' && missing.has(search.id))

    const found = new Map<string, Coordinates>()
    for (const search of searches) {
      signal?.throwIfAborted()
      // Job apagado do motor ou motor offline: esses leads seguem para o endereço.
      const places = await this.scraper.fetchResults(search.id).catch(() => [])
      for (const place of places) if (place.location) found.set(leadIdOf(place), place.location)
    }

    const located = this.unlocated().filter((lead) => found.has(lead.id))
    for (const lead of located) this.leads.update(lead.id, { location: found.get(lead.id) })
    return located.length
  }

  private async geocodeAddress(address: string, signal?: AbortSignal): Promise<Coordinates | null> {
    try {
      return await this.geocoder.geocode(address, signal)
    } catch (error) {
      if (error instanceof LocationNotFoundError) return null
      throw error
    }
  }
}
