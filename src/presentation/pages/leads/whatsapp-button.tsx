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
  /** Mensagem já pronta; sem ela, usa o modelo em uso. */
  readonly message?: string
  /** Sem rótulo vira botão só de ícone. */
  readonly label?: string
  readonly size?: ButtonSize
  /** Botão cheio, verde do WhatsApp, para a ação principal. */
  readonly isProminent?: boolean
}

/** Logo do WhatsApp num botão neutro (ou verde, se `isProminent`). Telefone fixo fica com a logo apagada (cinza). */
export function WhatsAppButton({ view, onOpen, message, label, size = 'sm', isProminent = false }: WhatsAppButtonProps) {
  const messageTemplate = activeTemplate(useSettings()).body
  if (!view.phone) return null

  const { isMobile } = view.phone
  return (
    <ExternalButtonLink
      href={buildWhatsAppUrl(view.phone, message ?? renderMessage(messageTemplate, view.lead))}
      onClick={(event) => {
        event.stopPropagation()
        onOpen?.()
      }}
      variant={isProminent ? 'whatsapp' : 'secondary'}
      size={size}
      iconOnly={!label}
      aria-label={`Abrir WhatsApp de ${view.lead.name}`}
      title={isMobile ? 'Abrir WhatsApp' : 'Telefone fixo: pode não ter WhatsApp'}
    >
      <img
        src={whatsappLogo}
        alt=""
        className={cn('size-4 shrink-0', isProminent && 'size-5 brightness-0 invert dark:invert-0', !isMobile && 'opacity-50 grayscale')}
      />
      {label}
    </ExternalButtonLink>
  )
}
