import { MetricStrip, type Metric } from '@/components/prospecta/metric-strip'
import { formatCount, formatCurrency } from '@/presentation/format'
import type { LeadView } from './lead-view'

const percentFormatter = new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 0 })

function computeMetrics(views: readonly LeadView[]): Metric[] {
  const count = (predicate: (view: LeadView) => boolean) => views.filter(predicate).length
  const withoutSite = count((v) => v.presence !== 'own')
  const closed = views.filter((v) => v.lead.status === 'fechado')
  const closedValue = closed.reduce((total, v) => total + (v.lead.dealValue ?? 0), 0)

  return [
    { label: 'Leads', value: formatCount(views.length), note: `${formatCount(count((v) => v.lead.status === 'novo'))} sem abordagem` },
    {
      label: 'Sem site próprio',
      value: formatCount(withoutSite),
      note: `${percentFormatter.format(views.length ? withoutSite / views.length : 0)} do total`,
    },
    { label: 'Quentes', value: formatCount(count((v) => v.opportunity.level === 'quente')), note: 'score ≥ 80' },
    {
      label: 'Fechados',
      value: formatCurrency(closedValue),
      note: `${formatCount(closed.length)} ${closed.length === 1 ? 'cliente' : 'clientes'} · ${formatCount(count((v) => v.lead.status === 'negociando'))} negociando`,
    },
  ]
}

export function LeadStats({ views }: { readonly views: readonly LeadView[] }) {
  return <MetricStrip items={computeMetrics(views)} />
}
