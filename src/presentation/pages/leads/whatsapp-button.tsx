import { MessageCircle } from 'lucide-react'
import { ExternalButtonLink, type ButtonSize } from '@/components/prospecta/button'
import { renderMessage } from '@/domain/message-template'
import { buildWhatsAppUrl } from '@/domain/phone'
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

/** Ícone na cor do WhatsApp dentro de um botão neutro. Telefone fixo fica com o ícone apagado. */
export function WhatsAppButton({ view, onOpen, label, size = 'sm' }: WhatsAppButtonProps) {
  const { messageTemplate } = useSettings()
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
      className={cn(isMobile ? '[&_svg]:text-whatsapp' : '[&_svg]:text-ink-faint')}
    >
      <MessageCircle />
      {label}
    </ExternalButtonLink>
  )
}
