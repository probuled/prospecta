import type { Geocoder } from '@/application/ports/geocoder'
import type { SearchRepository } from '@/application/ports/repositories'
import type { ScraperGateway } from '@/application/ports/scraper-gateway'
import { buildKeyword, estimateMaxTimeSeconds, type Search, type SearchRequest } from '@/domain/search'

export class StartSearch {
  private readonly geocoder: Geocoder
  private readonly scraper: ScraperGateway
  private readonly searches: SearchRepository

  constructor(geocoder: Geocoder, scraper: ScraperGateway, searches: SearchRepository) {
    this.geocoder = geocoder
    this.scraper = scraper
    this.searches = searches
  }

  async execute(request: SearchRequest): Promise<Search> {
    const coordinates = await this.geocoder.geocode(request.city)
    const keyword = buildKeyword(request.niche, request.city)
    const maxTimeSeconds = estimateMaxTimeSeconds(request)

    const jobId = await this.scraper.createJob({
      keyword,
      coordinates,
      depth: request.depth,
      withEmails: request.withEmails,
      maxTimeSeconds,
    })

    const search: Search = {
      ...request,
      id: jobId,
      keyword,
      status: 'working',
      leadCount: 0,
      maxTimeSeconds,
      createdAt: new Date().toISOString(),
    }
    this.searches.save(search)
    return search
  }
}
