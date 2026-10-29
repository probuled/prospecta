import { ArrowUpRight, MapPin, Phone, X } from 'lucide-react'
import { leadDetail } from '@/app/routes'
import { Button, ButtonLink, ExternalButtonLink } from '@/components/prospecta/button'
import { Rating } from '@/components/prospecta/rating'
import { StatusMenu } from '@/components/prospecta/status'
import type { Lead, LeadStatus } from '@/domain/lead'

interface SelectedLeadCardProps {
  readonly lead: Lead
  readonly onStatusChange: (status: LeadStatus) => void
  readonly onClose: () => void
}

export function SelectedLeadCard({ lead, onStatusChange, onClose }: SelectedLeadCardProps) {
  return (
    <section aria-label={`Lead selecionado: ${lead.name}`} className="space-y-4 rounded-lg border border-line bg-surface p-5">
      <header className="flex items-start gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="text-title wrap-anywhere">{lead.name}</h2>
          <p className="text-ink-muted">{lead.category}</p>
        </div>
        <Button variant="ghost" size="sm" iconOnly icon={X} onClick={onClose} aria-label="Fechar lead selecionado" />
      </header>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <StatusMenu status={lead.status} onChange={onStatusChange} className="-ml-2" />
        {lead.rating !== null && <Rating value={lead.rating} count={lead.reviewCount} />}
      </div>

      <dl className="space-y-2 text-sm">
        {lead.address && (
          <div className="flex items-start gap-2">
            <dt>
              <MapPin aria-label="Endereço" className="mt-0.5 size-4 text-ink-muted" />
            </dt>
            <dd className="min-w-0 wrap-anywhere">{lead.address}</dd>
          </div>
        )}
        <div className="flex items-start gap-2">
          <dt>
            <Phone aria-label="Telefone" className="mt-0.5 size-4 text-ink-muted" />
          </dt>
          <dd className={lead.phone ? 'font-mono' : 'text-ink-muted'}>{lead.phone || 'Sem telefone'}</dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-2">
        <ButtonLink to={leadDetail(lead.id)} variant="primary" size="sm">
          Ver detalhes
        </ButtonLink>
        {lead.mapsUrl && (
          <ExternalButtonLink href={lead.mapsUrl} size="sm">
            Google Maps <ArrowUpRight />
          </ExternalButtonLink>
        )}
      </div>
    </section>
  )
}
