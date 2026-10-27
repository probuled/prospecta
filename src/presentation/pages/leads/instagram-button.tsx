import instagramLogo from '@/assets/brand/instagram.webp'
import { InstagramIcon } from '@/components/prospecta/brand-icons'
import { ExternalButtonLink, type ButtonSize } from '@/components/prospecta/button'
import { cn } from '@/lib/utils'
import type { LeadView } from './lead-view'

interface InstagramButtonProps {
  readonly view: LeadView
  /** Sem rótulo vira botão só de ícone. */
  readonly label?: string
  readonly size?: ButtonSize
  /** Botão cheio, com o degradê do Instagram, para a ação principal. */
  readonly isProminent?: boolean
}

/** Logo do Instagram num botão neutro (ou no degradê da marca, se `isProminent`), no formato do botão de WhatsApp. */
export function InstagramButton({ view, label, size = 'sm', isProminent = false }: InstagramButtonProps) {
  if (!view.instagram) return null

  const { url, handle } = view.instagram
  return (
    <ExternalButtonLink
      href={url}
      onClick={(event) => event.stopPropagation()}
      variant={isProminent ? 'instagram' : 'secondary'}
      size={size}
      className={cn(isProminent && 'h-auto min-h-11 gap-3 px-[22px] py-4 text-sm sm:px-7 sm:py-[18px] sm:text-[15px] [&_svg]:size-6')}
      iconOnly={!label}
      aria-label={`Abrir Instagram de ${view.lead.name}`}
      title={handle ? `Abrir @${handle} no Instagram` : 'Abrir no Instagram'}
    >
      {isProminent ? <InstagramIcon /> : <img src={instagramLogo} alt="" className="size-4 shrink-0" />}
      {label}
    </ExternalButtonLink>
  )
}
