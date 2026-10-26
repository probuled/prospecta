import { cn } from '@/lib/utils'

export interface Metric {
  readonly label: string
  /** Já formatado em pt-BR ("R$ 4.800"). */
  readonly value: string
  /** Um fato que explica o número ("39 sem abordagem"), nunca um conselho. */
  readonly note?: string
}

/** Faixa de 3–5 números-chave. Sem ícones, sem cor no número. */
export function MetricStrip({ items }: { readonly items: readonly Metric[] }) {
  return (
    <dl className="grid grid-cols-2 rounded-lg border border-line bg-surface lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-none">
      {items.map(({ label, value, note }, index) => (
        <div
          key={label}
          className={cn(
            'flex min-w-0 flex-col gap-0.5 px-5 py-4',
            index % 2 === 1 && 'border-l border-line',
            index >= 2 && 'border-t border-line lg:border-t-0',
            index > 0 && 'lg:border-l',
          )}
        >
          <dt className="text-label text-ink-muted">{label}</dt>
          <dd className="text-metric mt-1">{value}</dd>
          {note && <dd className="text-caption text-ink-muted">{note}</dd>}
        </div>
      ))}
    </dl>
  )
}
