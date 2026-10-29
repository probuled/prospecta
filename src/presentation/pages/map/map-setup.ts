import { setWorkerUrl, type Map as MapLibreMap } from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import { boundingBoxOf } from '@/domain/geo'
import type { LocatedLead } from './lead-map-layers'

// O MapLibre procura o worker ao lado do próprio arquivo, o que quebra com o bundle do Vite.
setWorkerUrl(workerUrl)

export function supportsWebGL(): boolean {
  try {
    return document.createElement('canvas').getContext('webgl2') !== null
  } catch {
    return false
  }
}

/** Textos dos controles do MapLibre em português. */
export const MAP_LOCALE: Record<string, string> = {
  'Map.Title': 'Mapa com a posição dos leads',
  'AttributionControl.ToggleAttribution': 'Mostrar créditos do mapa',
}

const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

export function fitToLeads(map: MapLibreMap, leads: readonly LocatedLead[], duration: number) {
  const box = boundingBoxOf(leads.map((lead) => lead.location))
  if (!box) return
  map.fitBounds(
    [
      [box.southWest.lon, box.southWest.lat],
      [box.northEast.lon, box.northEast.lat],
    ],
    { padding: 64, maxZoom: 15, duration: prefersReducedMotion() ? 0 : duration },
  )
}
