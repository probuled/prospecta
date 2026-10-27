import whatsappLogo from '@/assets/brand/whatsapp.webp'
import { WhatsAppIcon } from '@/components/prospecta/brand-icons'
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
      className={cn(isProminent && 'h-auto min-h-11 gap-3 px-[22px] py-4 text-sm sm:px-7 sm:py-[18px] sm:text-[15px] [&_svg]:size-6')}
      iconOnly={!label}
      aria-label={`Abrir WhatsApp de ${view.lead.name}`}
      title={isMobile ? 'Abrir WhatsApp' : 'Telefone fixo: pode não ter WhatsApp'}
    >
      {isProminent ? (
        <WhatsAppIcon />
      ) : (
        <img src={whatsappLogo} alt="" className={cn('size-4 shrink-0', !isMobile && 'opacity-50 grayscale')} />
      )}
      {label}
    </ExternalButtonLink>
  )
}
