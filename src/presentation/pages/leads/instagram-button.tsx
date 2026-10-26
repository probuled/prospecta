import instagramLogo from '@/assets/brand/instagram.webp'
import { ExternalButtonLink, type ButtonSize } from '@/components/prospecta/button'
import type { LeadView } from './lead-view'

interface InstagramButtonProps {
  readonly view: LeadView
  /** Sem rótulo vira botão só de ícone. */
  readonly label?: string
  readonly size?: ButtonSize
}

/** Logo do Instagram dentro de um botão neutro, no mesmo formato do botão de WhatsApp. */
export function InstagramButton({ view, label, size = 'sm' }: InstagramButtonProps) {
  if (!view.instagram) return null

  const { url, handle } = view.instagram
  return (
    <ExternalButtonLink
      href={url}
      onClick={(event) => event.stopPropagation()}
      size={size}
      iconOnly={!label}
      aria-label={`Abrir Instagram de ${view.lead.name}`}
      title={handle ? `Abrir @${handle} no Instagram` : 'Abrir no Instagram'}
    >
      <img src={instagramLogo} alt="" className="size-4 shrink-0" />
      {label}
    </ExternalButtonLink>
  )
}
