import type {
  ScrapedPlace,
  ScrapeJobRequest,
  ScrapeJobStatus,
  ScraperGateway,
} from '@/application/ports/scraper-gateway'
import { parsePlacesCsv } from './place-csv-parser'

export class EngineRequestError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EngineRequestError'
  }
}

interface EngineJobResponse {
  readonly ID?: string
  readonly Status?: string
}

// O motor só aceita código de idioma com 2 letras ("pt-BR" retorna 422 invalid lang).
const ENGINE_LANGUAGE = 'pt'
const CITY_ZOOM = 15
const SEARCH_RADIUS_METERS = 10_000

/**
 * Adaptador para a API REST do gosom/google-maps-scraper.
 * Fala com `/engine`, que o Vite encaminha para o container Docker (ver vite.config.ts).
 */
export class GoogleMapsEngineGateway implements ScraperGateway {
  private readonly baseUrl: string

  constructor(baseUrl = '/engine/api/v1') {
    this.baseUrl = baseUrl
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/jobs`)
      return response.ok
    } catch {
      return false
    }
  }

  async createJob(request: ScrapeJobRequest): Promise<string> {
    const response = await this.request('/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: request.keyword,
        keywords: [request.keyword],
        lang: ENGINE_LANGUAGE,
        zoom: CITY_ZOOM,
        radius: SEARCH_RADIUS_METERS,
        lat: String(request.coordinates.lat),
        lon: String(request.coordinates.lon),
        depth: request.depth,
        email: request.withEmails,
        fast_mode: false,
        max_time: request.maxTimeSeconds,
      }),
    })
    const { id } = (await response.json()) as { id: string }
    return id
  }

  async getJobStatus(jobId: string): Promise<ScrapeJobStatus> {
    const response = await this.request(`/jobs/${jobId}`)
    const job = (await response.json()) as EngineJobResponse
    return toJobStatus(job.Status)
  }

  async fetchResults(jobId: string): Promise<ScrapedPlace[]> {
    const response = await this.request(`/jobs/${jobId}/download`)
    return parsePlacesCsv(await response.text())
  }

  async deleteJob(jobId: string): Promise<void> {
    await this.request(`/jobs/${jobId}`, { method: 'DELETE' })
  }

  private async request(path: string, init?: RequestInit): Promise<Response> {
    let response: Response
    try {
      response = await fetch(`${this.baseUrl}${path}`, init)
    } catch {
      throw new EngineRequestError('O motor de scraping está offline. Rode "docker compose up -d".')
    }
    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      throw new EngineRequestError(`O motor respondeu ${response.status}. ${detail}`.trim())
    }
    return response
  }
}

function toJobStatus(engineStatus = ''): ScrapeJobStatus {
  if (engineStatus === 'ok') return 'ok'
  if (engineStatus === 'failed') return 'failed'
  return 'working'
}
