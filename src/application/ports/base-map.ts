export type MapTheme = 'light' | 'dark'

/** Fonte do mapa de fundo (ruas, rótulos, relevo) desenhado pelo MapLibre. */
export interface BaseMap {
  /** URL de um estilo no formato MapLibre Style Spec. */
  styleUrl(theme: MapTheme): string
  /** Fonte dos rótulos do estilo, usada também nos números dos agrupamentos. */
  readonly labelFont: string
}
