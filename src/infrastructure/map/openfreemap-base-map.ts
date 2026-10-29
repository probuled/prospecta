import type { BaseMap, MapTheme } from '@/application/ports/base-map'

const STYLES: Record<MapTheme, string> = {
  light: 'positron',
  dark: 'dark',
}

/** Tiles do OpenFreeMap (dados do OpenStreetMap): gratuitos, sem chave e sem limite de uso. */
export class OpenFreeMapBaseMap implements BaseMap {
  readonly labelFont = 'Noto Sans Regular'

  styleUrl(theme: MapTheme): string {
    return `https://tiles.openfreemap.org/styles/${STYLES[theme]}`
  }
}
