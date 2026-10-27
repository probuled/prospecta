import { ArrowRight } from 'lucide-react'
import { ROUTES } from '@/app/routes'
import { ButtonLink } from '@/components/prospecta/button'
import { Panel } from '@/components/prospecta/panel'
import type { Lead } from '@/domain/lead'
import { evaluateOpportunity } from '@/domain/opportunity'
import { classifyWebsite } from '@/domain/website-presence'
import { cn } from '@/lib/utils'
import { formatCount } from '@/presentation/format'

interface SummaryItem {
  readonly value: number
  readonly note: string
  readonly isHighlight?: boolean
}

function summarize(leads: readonly Lead[]): SummaryItem[] {
  const count = (predicate: (lead: Lead) => boolean) => leads.filter(predicate).length
  return [
    { value: leads.length, note: `${formatCount(count((lead) => lead.status === 'novo'))} sem abordagem` },
    { value: count((lead) => classifyWebsite(lead.website) !== 'own'), note: 'sem site próprio' },
    {
      value: count((lead) => evaluateOpportunity(lead).level === 'quente'),
      note: 'alta oportunidade',
      isHighlight: true,
    },
  ]
}

/** Resumo dos leads salvos, com atalho para a tela de Leads. */
export function LeadsSummary({ leads }: { readonly leads: readonly Lead[] }) {
  return (
    <Panel
      title="Seus leads"
      action={
        leads.length > 0 && (
          <ButtonLink to={ROUTES.leads} variant="ghost" size="sm">
            Abrir leads <ArrowRight />
          </ButtonLink>
        )
      }
      bodyClassName={leads.length ? 'p-0' : undefined}
    >
      {leads.length ? (
        <dl className="grid grid-cols-3">
          {summarize(leads).map(({ value, note, isHighlight }, index) => (
            <div key={note} className={cn('flex min-w-0 flex-col gap-1 px-5 py-4', index > 0 && 'border-l border-line')}>
              <dt className="sr-only">{note}</dt>
              <dd className="text-metric">
                <span className={cn(isHighlight && 'text-quente')}>{formatCount(value)}</span>
              </dd>
              <dd aria-hidden className="text-caption text-ink-muted">
                {note}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-ink-muted">Nenhum lead ainda. Os negócios encontrados nas buscas aparecem aqui.</p>
      )}
    </Panel>
  )
}
