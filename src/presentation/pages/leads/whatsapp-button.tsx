import whatsappLogo from '@/assets/brand/whatsapp.webp'
import { ExternalButtonLink, type ButtonSize } from '@/components/prospecta/button'
import { renderMessage } from '@/domain/message-template'
import { buildWhatsAppUrl } from '@/domain/phone'
import { activeTemplate } from '@/domain/settings'
import { cn } from '@/lib/utils'
import { useSettings } from '@/presentation/hooks/use-store'
import type { LeadView } from './lead-view'

interface WhatsAppButtonProps {
  readonly view: LeadView
  readonly onOpen?: () => void
  /** Sem rótulo vira botão só de ícone. */
  readonly label?: string
  readonly size?: ButtonSize
}

/** Logo do WhatsApp dentro de um botão neutro. Telefone fixo fica com a logo apagada (cinza). */
export function WhatsAppButton({ view, onOpen, label, size = 'sm' }: WhatsAppButtonProps) {
  const messageTemplate = activeTemplate(useSettings()).body
  if (!view.phone) return null

  const { isMobile } = view.phone
  return (
    <ExternalButtonLink
      href={buildWhatsAppUrl(view.phone, renderMessage(messageTemplate, view.lead))}
      onClick={(event) => {
        event.stopPropagation()
        onOpen?.()
      }}
      size={size}
      iconOnly={!label}
      aria-label={`Abrir WhatsApp de ${view.lead.name}`}
      title={isMobile ? 'Abrir WhatsApp' : 'Telefone fixo: pode não ter WhatsApp'}
    >
      <img src={whatsappLogo} alt="" className={cn('size-4 shrink-0', !isMobile && 'opacity-50 grayscale')} />
      {label}
    </ExternalButtonLink>
  )
}
