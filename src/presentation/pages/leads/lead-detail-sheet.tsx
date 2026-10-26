import { Check, Copy, ExternalLink, Globe, Mail, MapPin, Phone, type LucideIcon } from 'lucide-react'
import { useRef, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { Button, ExternalButtonLink } from '@/components/prospecta/button'
import { fieldClasses } from '@/components/prospecta/input'
import { Presence } from '@/components/prospecta/presence'
import { Rating } from '@/components/prospecta/rating'
import { Score } from '@/components/prospecta/score'
import { StatusMenu } from '@/components/prospecta/status'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { LeadPatch } from '@/domain/lead'
import { renderMessage } from '@/domain/message-template'
import { cn } from '@/lib/utils'
import { fromDateTimeLocal, toDateTimeLocal } from '@/presentation/format'
import { useSettings } from '@/presentation/hooks/use-store'
import type { LeadView } from './lead-view'
import { WhatsAppButton } from './whatsapp-button'

interface LeadDetailSheetProps {
  readonly view: LeadView | null
  readonly onClose: () => void
  readonly onUpdate: (leadId: string, patch: LeadPatch) => void
}

function Section({ title, children }: { readonly title: string; readonly children: ReactNode }) {
  return (
    <section className="space-y-3 border-t border-line px-5 py-5">
      <h3 className="text-overline text-ink-muted">{title}</h3>
      {children}
    </section>
  )
}

function InfoRow({ icon: Icon, children }: { readonly icon: LucideIcon; readonly children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-ink-muted" />
      <div className="min-w-0 break-words">{children}</div>
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

function CopyButton({ text }: { readonly text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Mensagem copiada')
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <Button icon={copied ? Check : Copy} onClick={copy}>
      Copiar
    </Button>
  )
}

export function LeadDetailSheet({ view, onClose, onUpdate }: LeadDetailSheetProps) {
  const { messageTemplate } = useSettings()
  // Foco inicial no cabeçalho: evita o anel de foco num botão ao abrir pelo mouse.
  const headerRef = useRef<HTMLDivElement>(null)

  return (
    <Sheet open={view !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent initialFocus={headerRef} className="w-full gap-0 overflow-y-auto border-line bg-surface p-0 sm:max-w-md">
        <div ref={headerRef} tabIndex={-1} className="outline-none">
          {view && <LeadDetailBody view={view} message={renderMessage(messageTemplate, view.lead)} onUpdate={onUpdate} />}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function LeadDetailBody({ view, message, onUpdate }: { view: LeadView; message: string; onUpdate: LeadDetailSheetProps['onUpdate'] }) {
  const { lead } = view
  const update = (patch: LeadPatch) => onUpdate(lead.id, patch)

  return (
    <>
      <SheetHeader className="gap-3 p-5 pr-12">
        <div className="space-y-0.5">
          <SheetTitle className="text-title">{lead.name}</SheetTitle>
          <SheetDescription className="text-caption text-ink-muted">
            {lead.category} · {lead.city}
          </SheetDescription>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Score value={view.opportunity.score} reasons={view.opportunity.reasons} />
          <Presence kind={view.presence} />
        </div>
      </SheetHeader>

      <Section title="Abordagem">
        <p className="rounded-md border border-line bg-surface-sunken p-3 leading-relaxed whitespace-pre-wrap">{message}</p>
        <div className="flex flex-wrap gap-2">
          <WhatsAppButton
            view={view}
            size="md"
            label="Enviar no WhatsApp"
            onOpen={() => lead.status === 'novo' && update({ status: 'contatado' })}
          />
          <CopyButton text={message} />
        </div>
      </Section>

      <Section title="Acompanhamento">
        <div className="flex items-center justify-between">
          <span className="text-label">Status</span>
          <StatusMenu status={lead.status} onChange={(status) => update({ status })} className="border-line-strong bg-surface" />
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
                if (dealValue !== (lead.dealValue ?? null)) update({ dealValue })
              }}
            />
          </Field>
          <Field label="Próximo contato" htmlFor="follow-up">
            <input
              id="follow-up"
              type="datetime-local"
              value={toDateTimeLocal(lead.followUpAt)}
              className={fieldClasses}
              onChange={(e) => update({ followUpAt: fromDateTimeLocal(e.target.value) })}
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
            onBlur={(e) => e.target.value !== lead.notes && update({ notes: e.target.value })}
          />
        </Field>
      </Section>

      <Section title="Informações">
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
    </>
  )
}
