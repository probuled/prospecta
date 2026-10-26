import { placeToLead } from '@/application/mappers/place-to-lead'
import type { LeadRepository, SearchRepository } from '@/application/ports/repositories'
import type { ScraperGateway } from '@/application/ports/scraper-gateway'
import type { Search } from '@/domain/search'

/** Consulta o job no motor e, quando termina, importa os resultados como leads. */
export class SyncSearch {
  private readonly scraper: ScraperGateway
  private readonly searches: SearchRepository
  private readonly leads: LeadRepository

  constructor(scraper: ScraperGateway, searches: SearchRepository, leads: LeadRepository) {
    this.scraper = scraper
    this.searches = searches
    this.leads = leads
  }

  async execute(search: Search): Promise<Search> {
    const status = await this.scraper.getJobStatus(search.id)
    if (status === 'working') return search

    const finishedAt = new Date().toISOString()
    if (status === 'failed') {
      return this.persist({ ...search, status: 'failed', finishedAt })
    }

    const places = await this.scraper.fetchResults(search.id)
    this.leads.upsertMany(places.map((place) => placeToLead(place, search, finishedAt)))
    return this.persist({ ...search, status: 'ok', leadCount: places.length, finishedAt })
  }

  private persist(search: Search): Search {
    this.searches.save(search)
    return search
  }
}
