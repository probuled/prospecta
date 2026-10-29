import type { FeatureCollection, Point } from 'geojson'
import type { ExpressionSpecification, Map as MapLibreMap } from 'maplibre-gl'
import type { Coordinates } from '@/domain/geo'
import { LEAD_STATUSES, type Lead, type LeadStatus } from '@/domain/lead'

export const SOURCE_ID = 'leads'
export const CLUSTER_LAYER = 'lead-clusters'
export const POINT_LAYER = 'lead-points'
export const SELECTED_LAYER = 'lead-selected'
const COUNT_LAYER = 'lead-cluster-count'

/** Lead que tem posição, pronto para virar ponto no mapa. */
export type LocatedLead = Lead & { readonly location: Coordinates }

export const isLocated = (lead: Lead): lead is LocatedLead => Boolean(lead.location)

/** Mesmos tokens do `StatusMark`, para a legenda e o mapa falarem a mesma língua. */
const STATUS_TOKENS: Record<LeadStatus, string> = {
  novo: '--surface',
  contatado: '--info',
  respondeu: '--ouro',
  negociando: '--ameixa',
  fechado: '--sucesso',
  perdido: '--ink-faint',
}

/** O MapLibre desenha em WebGL e não entende `var(--x)`: lê o valor atual de cada token do tema. */
function readTokens() {
  const styles = getComputedStyle(document.documentElement)
  const token = (name: string) => styles.getPropertyValue(name).trim()
  return {
    status: Object.fromEntries(LEAD_STATUSES.map((status) => [status, token(STATUS_TOKENS[status])])) as Record<LeadStatus, string>,
    surface: token('--surface'),
    ink: token('--ink'),
    inkMuted: token('--ink-muted'),
    ouro: token('--ouro'),
    onOuro: token('--on-ouro'),
    focus: token('--focus'),
  }
}

export function toFeatureCollection(leads: readonly LocatedLead[]): FeatureCollection<Point> {
  return {
    type: 'FeatureCollection',
    features: leads.map((lead) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [lead.location.lon, lead.location.lat] },
      properties: { id: lead.id, status: lead.status },
    })),
  }
}

export const selectedFilter = (leadId: string | null): ExpressionSpecification => ['==', ['get', 'id'], leadId ?? '']

/** Fonte agrupada + camadas de agrupamento, ponto e destaque. Chamado a cada troca de estilo (tema). */
export function addLeadLayers(map: MapLibreMap, data: FeatureCollection<Point>, selectedId: string | null, font: string) {
  const tokens = readTokens()
  const { status } = tokens
  const statusColor: ExpressionSpecification = [
    'match',
    ['get', 'status'],
    'novo',
    status.novo,
    'contatado',
    status.contatado,
    'respondeu',
    status.respondeu,
    'negociando',
    status.negociando,
    'fechado',
    status.fechado,
    'perdido',
    status.perdido,
    tokens.inkMuted,
  ]

  map.addSource(SOURCE_ID, { type: 'geojson', data, cluster: true, clusterRadius: 44, clusterMaxZoom: 15 })
  map.addLayer({
    id: CLUSTER_LAYER,
    type: 'circle',
    source: SOURCE_ID,
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': tokens.ouro,
      'circle-radius': ['step', ['get', 'point_count'], 14, 10, 18, 50, 24],
      'circle-stroke-width': 2,
      'circle-stroke-color': tokens.surface,
    },
  })
  map.addLayer({
    id: COUNT_LAYER,
    type: 'symbol',
    source: SOURCE_ID,
    filter: ['has', 'point_count'],
    layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-font': [font], 'text-size': 12 },
    paint: { 'text-color': tokens.onOuro },
  })
  map.addLayer({
    id: SELECTED_LAYER,
    type: 'circle',
    source: SOURCE_ID,
    filter: ['all', ['!', ['has', 'point_count']], selectedFilter(selectedId)],
    paint: { 'circle-radius': 13, 'circle-color': 'transparent', 'circle-stroke-width': 3, 'circle-stroke-color': tokens.focus },
  })
  map.addLayer({
    id: POINT_LAYER,
    type: 'circle',
    source: SOURCE_ID,
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': statusColor,
      'circle-radius': 7,
      'circle-stroke-width': 1.5,
      // "Novo" é só contorno, como no StatusMark.
      'circle-stroke-color': ['match', ['get', 'status'], 'novo', tokens.inkMuted, tokens.surface],
    },
  })
}
