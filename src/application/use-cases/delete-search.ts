import type { LeadRepository, SearchRepository } from '@/application/ports/repositories'
import type { ScraperGateway } from '@/application/ports/scraper-gateway'

export class DeleteSearch {
  private readonly scraper: ScraperGateway
  private readonly searches: SearchRepository
  private readonly leads: LeadRepository

  constructor(scraper: ScraperGateway, searches: SearchRepository, leads: LeadRepository) {
    this.scraper = scraper
    this.searches = searches
    this.leads = leads
  }

  async execute(searchId: string, options: { removeLeads: boolean }): Promise<void> {
    // Apagar no motor só libera disco; se ele estiver fora do ar, removemos localmente mesmo assim.
    await this.scraper.deleteJob(searchId).catch(() => undefined)
    if (options.removeLeads) this.leads.removeFromSearch(searchId)
    this.searches.remove(searchId)
  }
}
