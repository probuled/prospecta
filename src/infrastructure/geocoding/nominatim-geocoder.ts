import { LocationNotFoundError, type Geocoder } from '@/application/ports/geocoder'
import type { Coordinates } from '@/domain/geo'

interface NominatimResult {
  readonly lat: string
  readonly lon: string
}

/** Geocodificação gratuita via OpenStreetMap, com cache para não repetir consultas. */
export class NominatimGeocoder implements Geocoder {
  private readonly cache = new Map<string, Coordinates>()

  async geocode(place: string): Promise<Coordinates> {
    const key = place.trim().toLowerCase()
    const cached = this.cache.get(key)
    if (cached) return cached

    const params = new URLSearchParams({ q: place, format: 'json', limit: '1', 'accept-language': 'pt-BR' })
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`)
    const [result] = response.ok ? ((await response.json()) as NominatimResult[]) : []
    if (!result) throw new LocationNotFoundError(place)

    const coordinates = { lat: Number(result.lat), lon: Number(result.lon) }
    this.cache.set(key, coordinates)
    return coordinates
  }
}
