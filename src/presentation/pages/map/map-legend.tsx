import { StatusMark } from '@/components/prospecta/status'
import { LEAD_STATUSES, LEAD_STATUS_LABELS } from '@/domain/lead'

export function MapLegend() {
  return (
    <section aria-label="Legenda" className="space-y-3 rounded-lg border border-line bg-surface p-5">
      <p className="text-pretty text-ink-muted">Clique num ponto para ver o lead. Os círculos dourados agrupam leads próximos.</p>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {LEAD_STATUSES.map((status) => (
          <li key={status} className="flex items-center gap-2">
            <StatusMark status={status} className="size-2.5 rounded-full" />
            {LEAD_STATUS_LABELS[status]}
          </li>
        ))}
      </ul>
    </section>
  )
}
