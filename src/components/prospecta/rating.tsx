import { Star } from 'lucide-react'
import { formatCount, formatRating } from '@/presentation/format'

/** Nota do Google Maps (4,9) com a contagem de avaliações (1.203). */
export function Rating({ value, count }: { readonly value: number; readonly count?: number }) {
  return (
    <span className="inline-flex items-baseline gap-1 whitespace-nowrap">
      <Star className="size-[13px] self-center fill-ouro text-ouro" />
      <b className="font-medium">{formatRating(value)}</b>
      {count !== undefined && <small className="text-xs text-ink-muted">({formatCount(count)})</small>}
    </span>
  )
}
