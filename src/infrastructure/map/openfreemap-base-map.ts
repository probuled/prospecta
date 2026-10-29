import type { BaseMap } from '@/application/ports/base-map'

/**
 * Tiles do OpenFreeMap (dados do OpenStreetMap): gratuitos, sem chave e sem limite de uso.
 * O Positron serve aos dois temas: é o estilo mais neutro, e o app o recolore com os tokens do tema.
 */
export class OpenFreeMapBaseMap implements BaseMap {
  readonly styleUrl = 'https://tiles.openfreemap.org/styles/positron'
  readonly labelFont = 'Noto Sans Regular'
}
