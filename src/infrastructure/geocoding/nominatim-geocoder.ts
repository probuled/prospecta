import { LocationNotFoundError, type Geocoder } from '@/application/ports/geocoder'
import type { Coordinates } from '@/domain/geo'

interface NominatimResult {
  readonly lat: string
  readonly lon: string
}

/** A política de uso do Nominatim permite no máximo 1 pedido por segundo. */
const MIN_INTERVAL_MS = 1_000

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (ms <= 0) return resolve()
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(signal.reason)
      },
      { once: true },
    )
  })
}

/** Geocodificação gratuita via OpenStreetMap, com cache para não repetir consultas. */
export class NominatimGeocoder implements Geocoder {
  private readonly cache = new Map<string, Coordinates>()
  private lastRequestAt = 0

  async geocode(place: string, signal?: AbortSignal): Promise<Coordinates> {
    const key = place.trim().toLowerCase()
    const cached = this.cache.get(key)
    if (cached) return cached

    await wait(this.lastRequestAt + MIN_INTERVAL_MS - Date.now(), signal)
    this.lastRequestAt = Date.now()

    const params = new URLSearchParams({ q: place, format: 'json', limit: '1', 'accept-language': 'pt-BR' })
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, { signal })
    const [result] = response.ok ? ((await response.json()) as NominatimResult[]) : []
    if (!result) throw new LocationNotFoundError(place)

    const coordinates = { lat: Number(result.lat), lon: Number(result.lon) }
    this.cache.set(key, coordinates)
    return coordinates
  }
}
