import type { BaseMap } from '@/application/ports/base-map'
import type { FileDownloader } from '@/application/ports/file-downloader'
import { BackupData } from '@/application/use-cases/backup'
import type { LeadExporter } from '@/application/ports/lead-exporter'
import type { LeadRepository, SearchRepository, SettingsRepository } from '@/application/ports/repositories'
import type { ScraperGateway } from '@/application/ports/scraper-gateway'
import { DeleteSearch } from '@/application/use-cases/delete-search'
import { LocateLeads } from '@/application/use-cases/locate-leads'
import { StartSearch } from '@/application/use-cases/start-search'
import { SyncSearch } from '@/application/use-cases/sync-search'
import { JsonBackupFile } from '@/infrastructure/backup/json-backup-file'
import { GoogleMapsEngineGateway } from '@/infrastructure/engine/google-maps-engine-gateway'
import { BrowserFileDownloader } from '@/infrastructure/export/browser-file-downloader'
import { CsvLeadExporter } from '@/infrastructure/export/csv-lead-exporter'
import { NominatimGeocoder } from '@/infrastructure/geocoding/nominatim-geocoder'
import { OpenFreeMapBaseMap } from '@/infrastructure/map/openfreemap-base-map'
import { LocalStorageLeadRepository } from '@/infrastructure/storage/local-storage-lead-repository'
import { LocalStorageSearchRepository } from '@/infrastructure/storage/local-storage-search-repository'
import { LocalStorageSettingsRepository } from '@/infrastructure/storage/local-storage-settings-repository'

export interface Dependencies {
  readonly scraper: ScraperGateway
  readonly leads: LeadRepository
  readonly searches: SearchRepository
  readonly settings: SettingsRepository
  readonly exporter: LeadExporter
  readonly files: FileDownloader
  readonly baseMap: BaseMap
  readonly startSearch: StartSearch
  readonly syncSearch: SyncSearch
  readonly deleteSearch: DeleteSearch
  readonly locateLeads: LocateLeads
  readonly backup: BackupData
}

/** Composition root: o único lugar que conhece as implementações concretas. */
export function createDependencies(): Dependencies {
  const scraper = new GoogleMapsEngineGateway()
  const leads = new LocalStorageLeadRepository()
  const searches = new LocalStorageSearchRepository()
  const geocoder = new NominatimGeocoder()
  const settings = new LocalStorageSettingsRepository()

  return {
    scraper,
    leads,
    searches,
    settings,
    exporter: new CsvLeadExporter(),
    files: new BrowserFileDownloader(),
    baseMap: new OpenFreeMapBaseMap(),
    startSearch: new StartSearch(geocoder, scraper, searches),
    syncSearch: new SyncSearch(scraper, searches, leads),
    deleteSearch: new DeleteSearch(scraper, searches, leads),
    locateLeads: new LocateLeads(scraper, geocoder, searches, leads),
    backup: new BackupData(new JsonBackupFile(), leads, searches, settings),
  }
}
