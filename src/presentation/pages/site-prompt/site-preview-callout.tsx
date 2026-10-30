import { Sparkles } from 'lucide-react'
import type { Lead } from '@/domain/lead'

/** Nota curta: o prompt serve para fazer a prévia do site e mandar para o lead. */
export function SitePreviewCallout({ lead }: { readonly lead: Lead }) {
  return (
    <p role="note" className="flex items-start gap-2.5 rounded-md border border-ouro/40 bg-ouro-soft px-4 py-3 text-sm text-pretty">
      <Sparkles aria-hidden className="mt-0.5 size-4 shrink-0 text-ouro-text" />
      <span>
        <strong className="font-semibold">Faça uma prévia do site para {lead.name}:</strong> copie o prompt, cole numa IA (Claude, ChatGPT,
        Lovable ou v0) e mande o resultado para o dono. Ver o próprio site pronto aumenta as chances de fechar o negócio.
      </span>
    </p>
  )
}
