import { Check, X } from 'lucide-react'
import type { SitePromptCoverage } from '@/domain/site-prompt'

/** O que o prompt conseguiu reunir: quanto mais completo, mais o site parece feito sob medida. */
export function PromptCoverage({ coverage }: { readonly coverage: SitePromptCoverage }) {
  const items = [
    {
      label: coverage.photos > 0 ? `${coverage.photos} ${coverage.photos === 1 ? 'foto' : 'fotos'}` : 'Fotos',
      isDone: coverage.photos > 0,
    },
    { label: coverage.reviews > 0 ? `${coverage.reviews} depoimentos` : 'Depoimentos', isDone: coverage.reviews > 0 },
    { label: 'Horário de funcionamento', isDone: coverage.hasHours },
    { label: 'Localização para o mapa', isDone: coverage.hasLocation },
    { label: 'WhatsApp', isDone: coverage.hasWhatsApp },
    { label: 'Descrição do Google', isDone: coverage.hasDescription },
  ]

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            {item.isDone ? <Check aria-hidden className="size-4 text-sucesso" /> : <X aria-hidden className="size-4 text-ink-faint" />}
            <span className={item.isDone ? undefined : 'text-ink-muted'}>{item.label}</span>
            <span className="sr-only">{item.isDone ? '(incluído)' : '(não encontrado)'}</span>
          </li>
        ))}
      </ul>
      {coverage.pains > 0 && (
        <p className="text-caption text-ink-muted">
          Inclui {coverage.pains} {coverage.pains === 1 ? 'reclamação' : 'reclamações'} das avaliações para o site resolver.
        </p>
      )}
      <p className="text-caption text-ink-muted">O que faltar, o prompt pede para a IA marcar como [confirmar com o cliente].</p>
    </div>
  )
}
