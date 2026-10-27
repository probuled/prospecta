import { AtSign, GlobeOff, Link, type LucideIcon } from 'lucide-react'
import { WEBSITE_PRESENCE_LABELS, type WebsitePresence } from '@/domain/website-presence'
import { cn } from '@/lib/utils'

const ICONS: Record<WebsitePresence, LucideIcon> = { none: GlobeOff, social: AtSign, own: Link }

/** Sem site é a oportunidade: ganha peso e ícone em ouro. O resto é neutro — hierarquia por peso, não por cor. */
export function Presence({ kind }: { readonly kind: WebsitePresence }) {
  const Icon = ICONS[kind]
  const isOpportunity = kind === 'none'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-[13px] whitespace-nowrap',
        isOpportunity ? 'font-medium text-ink' : 'text-ink-muted',
      )}
    >
      <Icon className={cn('size-4', isOpportunity && 'text-ouro-text')} />
      {WEBSITE_PRESENCE_LABELS[kind]}
    </span>
  )
}
