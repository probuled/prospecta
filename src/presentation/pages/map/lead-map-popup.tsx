import { Popup, type Map as MapLibreMap } from 'maplibre-gl'
import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { Coordinates } from '@/domain/geo'

// O MapLibre cria a moldura do popup; as classes abaixo trocam o visual padrão dele (fundo branco, ponta, fonte de 12px)
// pelo do cartão e pela tipografia do app. O CSS do MapLibre fica fora das camadas do Tailwind e ganharia das
// utilidades, por isso o `!` nas propriedades que ele define.
const POPUP_CLASSES = [
  '[&_.maplibregl-popup-content]:font-sans',
  '[&_.maplibregl-popup-content]:text-sm',
  '[&_.maplibregl-popup-content]:text-ink',
  '[&_.maplibregl-popup-content]:rounded-lg!',
  '[&_.maplibregl-popup-content]:bg-transparent!',
  '[&_.maplibregl-popup-content]:p-0!',
  '[&_.maplibregl-popup-content]:shadow-[var(--shadow-overlay)]!',
  '[&_.maplibregl-popup-tip]:hidden',
].join(' ')

const VIEW_MARGIN = 12

/** Desloca o mapa o necessário para o popup caber inteiro (no celular o mapa é baixo e o cartão cortaria). */
function keepInView(map: MapLibreMap, element: HTMLElement) {
  const box = element.getBoundingClientRect()
  const bounds = map.getContainer().getBoundingClientRect()
  const overflow = (start: number, end: number, min: number, max: number) => {
    if (start < min + VIEW_MARGIN) return start - min - VIEW_MARGIN
    if (end > max - VIEW_MARGIN) return end - max + VIEW_MARGIN
    return 0
  }
  const dx = overflow(box.left, box.right, bounds.left, bounds.right)
  const dy = overflow(box.top, box.bottom, bounds.top, bounds.bottom)
  if (dx || dy) map.panBy([dx, dy], { duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300 })
}

interface LeadMapPopupProps {
  readonly map: MapLibreMap
  readonly location: Coordinates
  readonly children: ReactNode
}

/** Popup do MapLibre preso a um ponto, com conteúdo React renderizado dentro dele. */
export function LeadMapPopup({ map, location, children }: LeadMapPopupProps) {
  const [container] = useState(() => {
    const element = document.createElement('div')
    // Largura fixa: sem ela o popup encolhe até o conteúdo e cada lead abre de um tamanho.
    element.className = 'w-[min(20rem,calc(100vw-4rem))]'
    return element
  })

  useEffect(() => {
    const popup = new Popup({
      // Fechar e trocar de lead ficam com o cartão e com o clique no mapa, que já atualizam a seleção.
      closeButton: false,
      closeOnClick: false,
      focusAfterOpen: false,
      offset: 14,
      maxWidth: 'none',
      className: POPUP_CLASSES,
    })
      .setDOMContent(container)
      .setLngLat([location.lon, location.lat])
      .addTo(map)
    // Mede depois que o React desenhar o cartão e, se a câmera estiver em movimento (a descida do globo até os leads),
    // só quando ela parar: deslocar no meio cancelaria a animação.
    const fit = () => keepInView(map, popup.getElement())
    let frame = 0
    if (map.isMoving()) map.once('moveend', fit)
    else frame = requestAnimationFrame(fit)
    return () => {
      cancelAnimationFrame(frame)
      map.off('moveend', fit)
      popup.remove()
    }
  }, [map, container, location.lon, location.lat])

  return createPortal(children, container)
}
