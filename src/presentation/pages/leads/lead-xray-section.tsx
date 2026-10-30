import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCount } from '@/presentation/format'
import { Section } from './lead-detail-sections'
import type { LeadView } from './lead-view'

/** Checklist do perfil no Google e comparação com os concorrentes: os argumentos da abordagem. */
export function LeadXRaySection({ view }: { readonly view: LeadView }) {
  const { checklist, comparison, lead } = view

  return (
    <Section title="Raio-x do perfil" className="border-t border-line">
      {comparison ? (
        <p className="text-pretty">
          <span className="font-mono font-medium">{formatCount(comparison.peersWithSite)}</span> de{' '}
          <span className="font-mono">{formatCount(comparison.peers)}</span> {comparison.peers === 1 ? 'concorrente' : 'concorrentes'} num
          raio de {comparison.radiusKm} km {comparison.peersWithSite === 1 ? 'tem' : 'têm'} site próprio. Eles têm em média{' '}
          <span className="font-mono">{formatCount(comparison.peersAverageReviews)}</span> avaliações; este tem{' '}
          <span className="font-mono">{formatCount(lead.reviewCount)}</span>.
        </p>
      ) : (
        <p className="text-ink-muted">Nenhum concorrente da mesma categoria encontrado num raio de 2 km.</p>
      )}
      {checklist ? (
        <ul className="grid gap-2 sm:grid-cols-2">
          {checklist.map((item) => (
            <li key={item.id} className="flex items-center gap-2">
              {item.isDone ? (
                <Check aria-hidden className="size-4 shrink-0 text-sucesso" />
              ) : (
                <X aria-hidden className="size-4 shrink-0 text-perigo" />
              )}
              <span className={cn(!item.isDone && 'font-medium')}>{item.label}</span>
              <span className="sr-only">{item.isDone ? '(tem)' : '(falta)'}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-ink-muted">
          Este lead foi salvo antes do raio-x. Faça a busca de novo para carregar o perfil completo do Google.
        </p>
      )}
    </Section>
  )
}
