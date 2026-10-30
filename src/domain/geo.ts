export interface Coordinates {
  readonly lat: number
  readonly lon: number
}

export interface BoundingBox {
  readonly southWest: Coordinates
  readonly northEast: Coordinates
}

/** Coordenada utilizável: dentro dos limites e diferente do (0, 0) que o motor usa quando não acha o lugar. */
export function isValidCoordinates({ lat, lon }: Coordinates): boolean {
  return Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180 && (lat !== 0 || lon !== 0)
}

/** Menor retângulo que contém todos os pontos; `null` sem pontos. */
export function boundingBoxOf(points: readonly Coordinates[]): BoundingBox | null {
  if (points.length === 0) return null
  const lats = points.map((point) => point.lat)
  const lons = points.map((point) => point.lon)
  return {
    southWest: { lat: Math.min(...lats), lon: Math.min(...lons) },
    northEast: { lat: Math.max(...lats), lon: Math.max(...lons) },
  }
}

const EARTH_RADIUS_KM = 6371

/** Distância em linha reta (fórmula de haversine), em quilômetros. */
export function distanceKm(a: Coordinates, b: Coordinates): number {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180
  const dLat = toRadians(b.lat - a.lat)
  const dLon = toRadians(b.lon - a.lon)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * Math.sin(dLon / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}
