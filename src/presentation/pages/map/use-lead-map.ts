import { Map as MapLibreMap, type GeoJSONSource } from 'maplibre-gl'
import { useEffect, useRef, useState, type RefObject } from 'react'
import type { BaseMap, MapTheme } from '@/application/ports/base-map'
import {
  addLeadLayers,
  CLUSTER_LAYER,
  POINT_LAYER,
  SELECTED_LAYER,
  selectedFilter,
  SOURCE_ID,
  toFeatureCollection,
  type LocatedLead,
} from './lead-map-layers'
import { fitToLeads, MAP_LOCALE, supportsWebGL } from './map-setup'
import { readMapPalette, recolorStyle } from './base-map-style'

export type LeadMapStatus = 'loading' | 'ready' | 'error'

const LOAD_TIMEOUT_MS = 20_000

interface UseLeadMapOptions {
  readonly container: RefObject<HTMLDivElement | null>
  readonly baseMap: BaseMap
  readonly theme: MapTheme
  readonly leads: readonly LocatedLead[]
  readonly selectedId: string | null
  /** Muda quando o conjunto de leads muda (filtros): o mapa reenquadra. Mudar só o status de um lead não mexe na câmera. */
  readonly fitKey: string
  readonly onSelect: (leadId: string | null) => void
}

/** Cria o mapa uma vez e mantém fonte, destaque, tema e enquadramento em dia com as props. */
export function useLeadMap({ container, baseMap, theme, leads, selectedId, fitKey, onSelect }: UseLeadMapOptions) {
  const mapRef = useRef<MapLibreMap | null>(null)
  // O mesmo mapa, só que em estado: quem desenha por cima dele (o popup) precisa renderizar de novo quando ele fica pronto.
  const [readyMap, setReadyMap] = useState<MapLibreMap | null>(null)
  const [status, setStatus] = useState<LeadMapStatus>(() => (supportsWebGL() ? 'loading' : 'error'))
  // O mapa vive fora do React: os eventos leem sempre o valor mais recente por aqui.
  const latest = useRef({ leads, selectedId, onSelect })
  useEffect(() => {
    latest.current = { leads, selectedId, onSelect }
  })
  const [isGlobe, setIsGlobe] = useState(true)
  const projection = useRef(isGlobe)
  const appliedTheme = useRef(theme)
  const fittedKey = useRef(fitKey)

  useEffect(() => {
    if (!container.current || !supportsWebGL()) return
    let map: MapLibreMap
    try {
      map = new MapLibreMap({
        container: container.current,
        center: [-47.9, -15.8],
        zoom: 1.6,
        attributionControl: { compact: true },
        locale: MAP_LOCALE,
      })
    } catch {
      // Falha ao criar o contexto WebGL mesmo com suporte (GPU bloqueada, por exemplo).
      queueMicrotask(() => setStatus('error'))
      return
    }
    mapRef.current = map
    applyBaseStyle(map, baseMap.styleUrl)
    let hasStyle = false
    // Falhas depois do estilo (worker que não sobe, tiles que não chegam) não emitem erro que dê para separar de um tile
    // perdido: sem o `load` a tempo, o mapa desiste em vez de ficar carregando para sempre.
    const loadTimeout = setTimeout(() => setStatus('error'), LOAD_TIMEOUT_MS)

    map.on('style.load', () => {
      hasStyle = true
      map.setProjection({ type: projection.current ? 'globe' : 'mercator' })
      addLeadLayers(map, toFeatureCollection(latest.current.leads), latest.current.selectedId, baseMap.labelFont)
    })
    map.once('load', () => {
      clearTimeout(loadTimeout)
      setStatus('ready')
      setReadyMap(map)
      // Começa no globo e desce até os leads.
      fitToLeads(map, latest.current.leads, 2500)
    })
    map.on('error', () => {
      if (hasStyle) return
      clearTimeout(loadTimeout)
      setStatus('error')
    })

    map.on('click', CLUSTER_LAYER, async (event) => {
      const [feature] = event.features ?? []
      const clusterId = feature?.properties.cluster_id
      if (feature?.geometry.type !== 'Point' || typeof clusterId !== 'number') return
      const zoom = await map.getSource<GeoJSONSource>(SOURCE_ID)?.getClusterExpansionZoom(clusterId)
      map.easeTo({ center: feature.geometry.coordinates as [number, number], zoom })
    })
    map.on('click', (event) => {
      const [feature] = map.queryRenderedFeatures(event.point, { layers: [POINT_LAYER] })
      const leadId = feature?.properties.id
      latest.current.onSelect(typeof leadId === 'string' ? leadId : null)
    })
    for (const layer of [CLUSTER_LAYER, POINT_LAYER]) {
      map.on('mouseenter', layer, () => (map.getCanvas().style.cursor = 'pointer'))
      map.on('mouseleave', layer, () => (map.getCanvas().style.cursor = ''))
    }

    return () => {
      clearTimeout(loadTimeout)
      setReadyMap(null)
      map.remove()
      mapRef.current = null
    }
  }, [container, baseMap])

  // Trocar o estilo apaga as camadas; o `style.load` acima as recria com as cores do novo tema.
  useEffect(() => {
    if (theme === appliedTheme.current) return
    appliedTheme.current = theme
    if (mapRef.current) applyBaseStyle(mapRef.current, baseMap.styleUrl)
  }, [theme, baseMap])

  useEffect(() => {
    mapRef.current?.getSource<GeoJSONSource>(SOURCE_ID)?.setData(toFeatureCollection(leads))
  }, [leads])

  useEffect(() => {
    const map = mapRef.current
    if (!map || status !== 'ready' || fitKey === fittedKey.current) return
    fittedKey.current = fitKey
    fitToLeads(map, latest.current.leads, 600)
  }, [fitKey, status])

  useEffect(() => {
    const map = mapRef.current
    if (map?.getLayer(SELECTED_LAYER)) map.setFilter(SELECTED_LAYER, ['all', ['!', ['has', 'point_count']], selectedFilter(selectedId)])
  }, [selectedId])

  const toggleGlobe = () => {
    projection.current = !projection.current
    setIsGlobe(projection.current)
    mapRef.current?.setProjection({ type: projection.current ? 'globe' : 'mercator' })
  }

  return {
    status,
    map: readyMap,
    isGlobe,
    zoomIn: () => mapRef.current?.zoomIn(),
    zoomOut: () => mapRef.current?.zoomOut(),
    toggleGlobe,
  }
}

/** Carrega o estilo de fundo já com as cores do tema atual. */
function applyBaseStyle(map: MapLibreMap, styleUrl: string) {
  map.setStyle(styleUrl, { diff: false, transformStyle: (_previous, next) => recolorStyle(next, readMapPalette()) })
}
