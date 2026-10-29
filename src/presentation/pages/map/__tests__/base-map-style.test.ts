import type { LayerSpecification, StyleSpecification } from 'maplibre-gl'
import { describe, expect, it } from 'vitest'
import { recolorStyle, type MapPalette } from '../base-map-style'

const palette: MapPalette = {
  land: 'land',
  water: 'water',
  park: 'park',
  building: 'building',
  road: 'road',
  roadCasing: 'casing',
  boundary: 'boundary',
  label: 'label',
  labelStrong: 'strong',
  labelWater: 'label-water',
  labelHalo: 'halo',
}

const omt = { source: 'openmaptiles' } as const

function recolor(...layers: LayerSpecification[]) {
  const style: StyleSpecification = { version: 8, sources: {}, layers }
  return recolorStyle(style, palette).layers
}

const paintOf = (layer: LayerSpecification | undefined) => (layer && 'paint' in layer ? layer.paint : undefined)

describe('recolorStyle', () => {
  it('pinta chão, água, parque e prédio com a paleta', () => {
    const [background, water, wood, building] = recolor(
      { id: 'background', type: 'background', paint: { 'background-color': '#f00' } },
      { id: 'water', type: 'fill', ...omt, 'source-layer': 'water', paint: { 'fill-color': '#f00' } },
      { id: 'landcover_wood', type: 'fill', ...omt, 'source-layer': 'landcover', paint: { 'fill-color': '#f00' } },
      { id: 'building', type: 'fill', ...omt, 'source-layer': 'building', paint: { 'fill-color': '#f00', 'fill-outline-color': '#f00' } },
    )
    expect(paintOf(background)).toEqual({ 'background-color': 'land' })
    expect(paintOf(water)).toEqual({ 'fill-color': 'water' })
    expect(paintOf(wood)).toEqual({ 'fill-color': 'park' })
    expect(paintOf(building)).toEqual({ 'fill-color': 'building', 'fill-outline-color': 'casing' })
  })

  it('separa contorno, miolo e tracejado das vias, mantendo a largura', () => {
    const [casing, inner, dashline] = recolor(
      {
        id: 'highway_major_casing',
        type: 'line',
        ...omt,
        'source-layer': 'transportation',
        paint: { 'line-color': '#f00', 'line-width': 3 },
      },
      { id: 'highway_major_inner', type: 'line', ...omt, 'source-layer': 'transportation', paint: { 'line-color': '#f00' } },
      { id: 'railway_dashline', type: 'line', ...omt, 'source-layer': 'transportation', paint: { 'line-color': '#f00' } },
    )
    expect(paintOf(casing)).toEqual({ 'line-color': 'casing', 'line-width': 3 })
    expect(paintOf(inner)).toEqual({ 'line-color': 'road' })
    expect(paintOf(dashline)).toEqual({ 'line-color': 'land' })
  })

  it('destaca nomes de cidade, pinta nomes de água e não mexe nos escudos', () => {
    const shield: LayerSpecification = { id: 'highway-shield-non-us', type: 'symbol', ...omt, 'source-layer': 'transportation_name' }
    const [city, water, street, sameShield] = recolor(
      { id: 'label_city', type: 'symbol', ...omt, 'source-layer': 'place' },
      { id: 'water_name_point_label', type: 'symbol', ...omt, 'source-layer': 'water_name' },
      { id: 'highway-name-minor', type: 'symbol', ...omt, 'source-layer': 'transportation_name' },
      shield,
    )
    expect(paintOf(city)).toEqual({ 'text-color': 'strong', 'text-halo-color': 'halo' })
    expect(paintOf(water)).toEqual({ 'text-color': 'label-water', 'text-halo-color': 'halo' })
    expect(paintOf(street)).toEqual({ 'text-color': 'label', 'text-halo-color': 'halo' })
    expect(sameShield).toBe(shield)
  })

  it('deixa intactas camadas que não reconhece', () => {
    const unknown: LayerSpecification = { id: 'x', type: 'fill', ...omt, 'source-layer': 'mountain_peak', paint: { 'fill-color': '#f00' } }
    expect(recolor(unknown)[0]).toBe(unknown)
  })
})
