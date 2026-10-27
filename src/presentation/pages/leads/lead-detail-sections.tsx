import { ExternalLink, Globe, Mail, MapPin, Phone, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { ExternalButtonLink } from '@/components/prospecta/button'
import { fieldClasses } from '@/components/prospecta/input'
import { Rating } from '@/components/prospecta/rating'
import { StatusMenu } from '@/components/prospecta/status'
import type { LeadPatch } from '@/domain/lead'
import { cn } from '@/lib/utils'
import { fromDateTimeLocal, toDateTimeLocal } from '@/presentation/format'
import type { LeadView } from './lead-view'

export function Section({
  title,
  children,
  className,
  isCentered = false,
}: {
  readonly title: string
  readonly children: ReactNode
  readonly className?: string
  readonly isCentered?: boolean
}) {
  return (
    <section className={cn('space-y-4 px-5 py-5', className)}>
      <h3 className={cn('text-lg leading-6 font-bold tracking-tight', isCentered && 'text-center')}>{title}</h3>
      {children}
    </section>
  )
}

function InfoRow({ icon: Icon, children }: { readonly icon: LucideIcon; readonly children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-ink-muted" />
      <div className="min-w-0 wrap-anywhere">{children}</div>
    </div>
  )
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-label">
        {label}
      </label>
      {children}
    </div>
  )
}

export function FollowUpSection({ view, onUpdate }: { readonly view: LeadView; readonly onUpdate: (patch: LeadPatch) => void }) {
  const { lead } = view

  return (
    <Section title="Acompanhamento" isCentered>
      <div className="flex items-center justify-between">
        <span className="text-label">Status</span>
        <StatusMenu status={lead.status} onChange={(status) => onUpdate({ status })} className="border-line-strong bg-surface" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Valor (R$)" htmlFor="deal-value">
          <input
            id="deal-value"
            key={`value-${lead.id}`}
            type="number"
            min={0}
            step={50}
            placeholder="1500"
            defaultValue={lead.dealValue ?? ''}
            className={cn(fieldClasses, 'font-mono tabular-nums')}
            onBlur={(e) => {
              const dealValue = e.target.value === '' ? null : Number(e.target.value)
              if (dealValue !== (lead.dealValue ?? null)) onUpdate({ dealValue })
            }}
          />
        </Field>
        <Field label="Próximo contato" htmlFor="follow-up">
          <input
            id="follow-up"
            type="datetime-local"
            value={toDateTimeLocal(lead.followUpAt)}
            className={fieldClasses}
            onChange={(e) => onUpdate({ followUpAt: fromDateTimeLocal(e.target.value) })}
          />
        </Field>
      </div>
      <Field label="Anotações" htmlFor="notes">
        <textarea
          id="notes"
          key={`notes-${lead.id}`}
          rows={3}
          defaultValue={lead.notes}
          placeholder="Ex.: falei com a recepcionista, retornar segunda"
          className={cn(fieldClasses, 'h-auto resize-y py-2')}
          onBlur={(e) => e.target.value !== lead.notes && onUpdate({ notes: e.target.value })}
        />
      </Field>
    </Section>
  )
}

export function InfoSection({ view }: { readonly view: LeadView }) {
  const { lead } = view

  return (
    <Section title="Informações" className="border-t border-line" isCentered>
      <div className="space-y-2.5">
        {lead.rating && (
          <p>
            <Rating value={lead.rating} count={lead.reviewCount} /> <span className="text-ink-muted">avaliações no Google</span>
          </p>
        )}
        {lead.phone && (
          <InfoRow icon={Phone}>
            <span className="text-data">{lead.phone}</span>
            <span className="text-ink-muted"> · {view.phone?.isMobile ? 'celular' : 'fixo'}</span>
          </InfoRow>
        )}
        {lead.emails.length > 0 && (
          <InfoRow icon={Mail}>
            <span className="text-data">{lead.emails.join(', ')}</span>
          </InfoRow>
        )}
        {lead.website && (
          <InfoRow icon={Globe}>
            <a href={lead.website} target="_blank" rel="noreferrer" className="text-ouro-text underline-offset-4 hover:underline">
              {lead.website}
            </a>
          </InfoRow>
        )}
        {lead.address && <InfoRow icon={MapPin}>{lead.address}</InfoRow>}
      </div>
      {lead.mapsUrl && (
        <ExternalButtonLink variant="ghost" size="sm" href={lead.mapsUrl} className="-ml-2">
          <ExternalLink /> Abrir no Google Maps
        </ExternalButtonLink>
      )}
    </Section>
  )
}
