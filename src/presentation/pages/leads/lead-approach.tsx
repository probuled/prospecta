import { useState } from 'react'
import { Select, type SelectOption } from '@/components/prospecta/select'
import { renderMessage } from '@/domain/message-template'
import { activeTemplate } from '@/domain/settings'
import { useSettings } from '@/presentation/hooks/use-store'
import { InstagramButton } from './instagram-button'
import { Section } from './lead-detail-sections'
import type { LeadView } from './lead-view'
import { WhatsAppButton } from './whatsapp-button'

interface LeadApproachProps {
  readonly view: LeadView
  /** Chamado ao abrir o WhatsApp: o lead novo passa a contatado. */
  readonly onContact: () => void
}

/** Mensagem do modelo escolhido. A escolha vale só para este envio; o modelo em uso continua o mesmo. */
export function LeadApproach({ view, onContact }: LeadApproachProps) {
  const settings = useSettings()
  const [chosenId, setChosenId] = useState(() => activeTemplate(settings).id)
  const template = settings.messageTemplates.find(({ id }) => id === chosenId) ?? activeTemplate(settings)
  const message = renderMessage(template.body, view.lead)
  const options: SelectOption<string>[] = settings.messageTemplates.map(({ id, name }) => ({ value: id, label: name }))

  return (
    <Section title="Mensagem de abordagem">
      {options.length > 1 && (
        <Select
          label="Modelo:"
          value={template.id}
          options={options}
          onChange={setChosenId}
          aria-label="Modelo de mensagem"
          className="max-w-full"
        />
      )}
      <p className="rounded-md border border-line bg-surface-sunken p-3 leading-relaxed whitespace-pre-wrap">{message}</p>
      <div className="flex flex-wrap gap-2">
        <WhatsAppButton view={view} message={message} size="lg" label="Enviar no WhatsApp" onOpen={onContact} isProminent />
        <InstagramButton view={view} size="lg" label="Abrir Instagram" />
      </div>
    </Section>
  )
}
