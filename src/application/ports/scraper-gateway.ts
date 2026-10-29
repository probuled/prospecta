import type { Coordinates } from '@/domain/geo'

export interface ScrapeJobRequest {
  readonly keyword: string
  readonly coordinates: Coordinates
  readonly depth: number
  readonly withEmails: boolean
  readonly maxTimeSeconds: number
}

export type ScrapeJobStatus = 'working' | 'ok' | 'failed'

/** Um negócio como veio do Google Maps, já sem as colunas inúteis para prospecção. */
export interface ScrapedPlace {
  readonly placeId: string
  readonly title: string
  readonly category: string
  readonly address: string
  readonly phone: string
  readonly website: string
  readonly emails: readonly string[]
  readonly rating: number | null
  readonly reviewCount: number
  readonly mapsUrl: string
  readonly location: Coordinates | null
}

export interface ScraperGateway {
  isAvailable(): Promise<boolean>
  createJob(request: ScrapeJobRequest): Promise<string>
  getJobStatus(jobId: string): Promise<ScrapeJobStatus>
  fetchResults(jobId: string): Promise<ScrapedPlace[]>
  deleteJob(jobId: string): Promise<void>
}
