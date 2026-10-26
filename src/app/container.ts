import type { LeadExporter } from '@/application/ports/lead-exporter'
import type { LeadRepository, SearchRepository, SettingsRepository } from '@/application/ports/repositories'
import type { ScraperGateway } from '@/application/ports/scraper-gateway'
import { DeleteSearch } from '@/application/use-cases/delete-search'
import { StartSearch } from '@/application/use-cases/start-search'
import { SyncSearch } from '@/application/use-cases/sync-search'
import { GoogleMapsEngineGateway } from '@/infrastructure/engine/google-maps-engine-gateway'
import { CsvLeadExporter } from '@/infrastructure/export/csv-lead-exporter'
import { NominatimGeocoder } from '@/infrastructure/geocoding/nominatim-geocoder'
import { LocalStorageLeadRepository } from '@/infrastructure/storage/local-storage-lead-repository'
import { LocalStorageSearchRepository } from '@/infrastructure/storage/local-storage-search-repository'
import { LocalStorageSettingsRepository } from '@/infrastructure/storage/local-storage-settings-repository'

export interface Dependencies {
  readonly scraper: ScraperGateway
  readonly leads: LeadRepository
  readonly searches: SearchRepository
  readonly settings: SettingsRepository
  readonly exporter: LeadExporter
  readonly startSearch: StartSearch
  readonly syncSearch: SyncSearch
  readonly deleteSearch: DeleteSearch
}

/** Composition root: o único lugar que conhece as implementações concretas. */
export function createDependencies(): Dependencies {
  const scraper = new GoogleMapsEngineGateway()
  const leads = new LocalStorageLeadRepository()
  const searches = new LocalStorageSearchRepository()

  return {
    scraper,
    leads,
    searches,
    settings: new LocalStorageSettingsRepository(),
    exporter: new CsvLeadExporter(),
    startSearch: new StartSearch(new NominatimGeocoder(), scraper, searches),
    syncSearch: new SyncSearch(scraper, searches, leads),
    deleteSearch: new DeleteSearch(scraper, searches, leads),
  }
}
