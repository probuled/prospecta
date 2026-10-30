import type { NeighborhoodShare } from '@/domain/neighborhood-ranking'
import { formatCount } from '@/presentation/format'

/** Bairros com a maior parte dos negócios sem site próprio: onde vale buscar de novo. */
export function NeighborhoodsPanel({ ranking }: { readonly ranking: readonly NeighborhoodShare[] }) {
  if (ranking.length === 0) return null

  return (
    <section aria-labelledby="neighborhoods-title" className="space-y-3 rounded-lg border border-line bg-surface p-5">
      <div className="space-y-0.5">
        <h2 id="neighborhoods-title" className="font-semibold">
          Bairros sem site
        </h2>
        <p className="text-caption text-ink-muted">Onde a maioria dos negócios encontrados não tem site próprio.</p>
      </div>
      <ul className="space-y-2.5">
        {ranking.map((item) => (
          <li key={item.neighborhood} className="space-y-1">
            <div className="flex items-baseline justify-between gap-2 text-sm">
              <span className="truncate">{item.neighborhood}</span>
              <span className="text-data shrink-0 text-ink-muted">
                {formatCount(item.withoutSite)}/{formatCount(item.total)}
              </span>
            </div>
            <div
              role="meter"
              aria-label={`${item.neighborhood}: ${Math.round(item.share * 100)}% sem site`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(item.share * 100)}
              className="h-1.5 overflow-hidden rounded-full bg-surface-sunken"
            >
              <div className="h-full rounded-full bg-ouro" style={{ width: `${item.share * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
