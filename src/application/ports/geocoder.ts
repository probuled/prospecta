import type { Coordinates } from '@/domain/geo'

export interface Geocoder {
  /** Lança `LocationNotFoundError` quando o lugar não existe. */
  geocode(place: string): Promise<Coordinates>
}

export class LocationNotFoundError extends Error {
  constructor(place: string) {
    super(`Não encontrei a cidade "${place}". Tente no formato "Cidade, UF".`)
    this.name = 'LocationNotFoundError'
  }
}
