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
