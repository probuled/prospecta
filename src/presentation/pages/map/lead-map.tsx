import 'maplibre-gl/dist/maplibre-gl.css'
import { Earth, LoaderCircle, Map as MapIcon, Minus, Plus, TriangleAlert } from 'lucide-react'
import { useRef } from 'react'
import { useDependencies } from '@/app/dependencies-context'
import { Button } from '@/components/prospecta/button'
import { useTheme } from '@/presentation/theme/theme-context'
import type { LocatedLead } from './lead-map-layers'
import { useLeadMap } from './use-lead-map'

interface LeadMapProps {
  readonly leads: readonly LocatedLead[]
  readonly selectedId: string | null
  readonly fitKey: string
  readonly onSelect: (leadId: string | null) => void
  /** Remonta o mapa do zero (depois de um erro). */
  readonly onRetry: () => void
}

export function LeadMap({ leads, selectedId, fitKey, onSelect, onRetry }: LeadMapProps) {
  const { baseMap } = useDependencies()
  const { resolvedTheme } = useTheme()
  const container = useRef<HTMLDivElement>(null)
  const { status, isGlobe, zoomIn, zoomOut, toggleGlobe } = useLeadMap({
    container,
    baseMap,
    theme: resolvedTheme,
    leads,
    selectedId,
    fitKey,
    onSelect,
  })

  return (
    <div className="relative h-full min-h-80 overflow-hidden rounded-lg border border-line bg-surface-sunken">
      {/* O CSS do MapLibre fixa `position: relative` no contêiner; por isso `size-full` e não `absolute`. */}
      <div ref={container} className="size-full" />
      {status === 'ready' && (
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <div className="flex flex-col overflow-hidden rounded-md shadow-[var(--shadow-overlay)]">
            <Button size="sm" iconOnly icon={Plus} onClick={zoomIn} aria-label="Aproximar" className="rounded-b-none" />
            <Button size="sm" iconOnly icon={Minus} onClick={zoomOut} aria-label="Afastar" className="-mt-px rounded-t-none" />
          </div>
          <Button
            size="sm"
            iconOnly
            icon={isGlobe ? MapIcon : Earth}
            onClick={toggleGlobe}
            aria-label={isGlobe ? 'Ver como mapa plano' : 'Ver como globo'}
            className="shadow-[var(--shadow-overlay)]"
          />
        </div>
      )}
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 text-ink-muted">
          <LoaderCircle className="size-4 animate-spin" /> Carregando mapa…
        </div>
      )}
      {status === 'error' && (
        <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-sunken p-6 text-center">
          <TriangleAlert className="size-6 text-perigo" />
          <div className="space-y-1">
            <p className="font-medium">Não foi possível carregar o mapa.</p>
            <p className="max-w-sm text-pretty text-ink-muted">
              Confira a conexão com a internet: o mapa de fundo vem do OpenFreeMap. Navegadores sem WebGL também não conseguem desenhar o
              mapa.
            </p>
          </div>
          <Button onClick={onRetry}>Tentar de novo</Button>
        </div>
      )}
    </div>
  )
}
