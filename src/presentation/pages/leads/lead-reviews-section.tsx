import { Quote, Star } from 'lucide-react'
import { bestReviews, excerpt, findPains } from '@/domain/review-insights'
import { Section } from './lead-detail-sections'
import type { LeadView } from './lead-view'

/** Elogios e reclamações das avaliações: o que vira `{elogio}` e `{dor}` na mensagem. */
export function LeadReviewsSection({ view }: { readonly view: LeadView }) {
  const { lead } = view
  if (!lead.profile) return null

  const [best] = bestReviews(lead, 1)
  const pains = findPains(lead)

  return (
    <Section title="O que os clientes dizem" className="border-t border-line">
      {!best && pains.length === 0 && <p className="text-ink-muted">Nenhuma avaliação escrita veio nesta busca.</p>}
      {best && (
        <figure className="space-y-1.5 rounded-md border border-line bg-surface-sunken p-3">
          <figcaption className="text-label flex items-center gap-1.5 text-ink-muted">
            <Star aria-hidden className="size-3.5 fill-ouro text-ouro" /> Melhor elogio · vira {'{elogio}'}
          </figcaption>
          <blockquote className="leading-relaxed text-pretty">“{excerpt(best.text, 220)}”</blockquote>
        </figure>
      )}
      {pains.length > 0 && (
        <div className="space-y-2">
          <p className="text-label text-ink-muted">Reclamações que o seu serviço resolve · a primeira vira {'{dor}'}</p>
          <ul className="space-y-2">
            {pains.map((pain) => (
              <li key={pain.id} className="space-y-0.5">
                <p className="font-medium">{pain.label}</p>
                <p className="flex gap-1.5 text-ink-muted">
                  <Quote aria-hidden className="mt-1 size-3 shrink-0" />
                  <span className="text-pretty">{pain.quote}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  )
}
