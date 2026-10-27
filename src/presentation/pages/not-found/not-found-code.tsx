import { cn } from '@/lib/utils'

/** Contorno grosso por fora do preenchimento (paint-order), como letra de adesivo. */
const DIGIT =
  'text-[120px] leading-none font-black italic tracking-tighter [paint-order:stroke_fill] [-webkit-text-stroke:6px_var(--ink)] sm:text-[160px]'

/** "404" desenhado: os 4 vazados e o 0 em ouro. */
export function NotFoundCode() {
  return (
    <p aria-label="Erro 404" className="select-none">
      <span aria-hidden className={cn(DIGIT, 'text-surface')}>
        4
      </span>
      <span aria-hidden className={cn(DIGIT, 'text-ouro')}>
        0
      </span>
      <span aria-hidden className={cn(DIGIT, 'text-surface')}>
        4
      </span>
    </p>
  )
}
