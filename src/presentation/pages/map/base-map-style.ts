import type { LayerSpecification, StyleSpecification } from 'maplibre-gl'

/** Cores do mapa de fundo, lidas dos tokens `--map-*` do tema. */
export interface MapPalette {
  readonly land: string
  readonly water: string
  readonly park: string
  readonly building: string
  readonly road: string
  readonly roadCasing: string
  readonly boundary: string
  readonly label: string
  readonly labelStrong: string
  readonly labelWater: string
  readonly labelHalo: string
}

/** O MapLibre não entende `var(--x)`: lê o valor atual de cada token do tema. */
export function readMapPalette(): MapPalette {
  const styles = getComputedStyle(document.documentElement)
  const token = (name: string) => styles.getPropertyValue(`--map-${name}`).trim()
  return {
    land: token('land'),
    water: token('water'),
    park: token('park'),
    building: token('building'),
    road: token('road'),
    roadCasing: token('road-casing'),
    boundary: token('boundary'),
    label: token('label'),
    labelStrong: token('label-strong'),
    labelWater: token('label-water'),
    labelHalo: token('label-halo'),
  }
}

// As regras usam as camadas do esquema OpenMapTiles (`source-layer`) e os nomes de camada do estilo Positron.
const sourceLayer = (layer: LayerSpecification) => ('source-layer' in layer ? layer['source-layer'] : undefined)

function fillColor(layer: LayerSpecification, palette: MapPalette): string | undefined {
  switch (sourceLayer(layer)) {
    case 'water':
      return palette.water
    case 'park':
      return palette.park
    case 'landcover':
      return layer.id.includes('wood') ? palette.park : palette.land
    case 'building':
    case 'aeroway':
      return palette.building
    case 'landuse':
    case 'transportation':
      return palette.land
  }
}

function lineColor(layer: LayerSpecification, palette: MapPalette): string | undefined {
  const { id } = layer
  switch (sourceLayer(layer)) {
    case 'waterway':
      return palette.water
    case 'boundary':
      return palette.boundary
    case 'aeroway':
      return palette.road
    case 'transportation':
      // Os tracejados dos trilhos e os píeres são desenhados na cor do chão.
      if (id.includes('dashline') || id.includes('pier')) return palette.land
      if (id.includes('casing') || id.includes('subtle') || id.startsWith('railway')) return palette.roadCasing
      return palette.road
  }
}

function textColor(layer: LayerSpecification, palette: MapPalette): string {
  if (sourceLayer(layer) === 'water_name' || layer.id.startsWith('waterway')) return palette.labelWater
  if (/^label_(city|town|state|country)/.test(layer.id)) return palette.labelStrong
  return palette.label
}

function recolorLayer(layer: LayerSpecification, palette: MapPalette): LayerSpecification {
  switch (layer.type) {
    case 'background':
      return { ...layer, paint: { ...layer.paint, 'background-color': palette.land } }
    case 'fill': {
      const color = fillColor(layer, palette)
      if (!color) return layer
      const paint = { ...layer.paint, 'fill-color': color }
      return { ...layer, paint: layer.paint?.['fill-outline-color'] ? { ...paint, 'fill-outline-color': palette.roadCasing } : paint }
    }
    case 'line': {
      const color = lineColor(layer, palette)
      return color ? { ...layer, paint: { ...layer.paint, 'line-color': color } } : layer
    }
    case 'symbol':
      // Escudos de rodovia são só ícone; mudar o texto deles apagaria o contraste com o desenho do escudo.
      if (layer.id.includes('shield')) return layer
      return {
        ...layer,
        paint: { ...layer.paint, 'text-color': textColor(layer, palette), 'text-halo-color': palette.labelHalo },
      }
    default:
      return layer
  }
}

/** Pinta o estilo de fundo com a paleta do Prospecta, mantendo geometria, larguras e rótulos do original. */
export function recolorStyle(style: StyleSpecification, palette: MapPalette): StyleSpecification {
  return { ...style, layers: style.layers.map((layer) => recolorLayer(layer, palette)) }
}
