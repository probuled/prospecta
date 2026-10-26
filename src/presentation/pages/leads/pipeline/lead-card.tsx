import { useDraggable } from '@dnd-kit/core'
import { Rating } from '@/components/prospecta/rating'
import { Score } from '@/components/prospecta/score'
import type { LeadStatus } from '@/domain/lead'
import { cn } from '@/lib/utils'
import { FollowUpTag } from '@/presentation/components/follow-up-tag'
import { formatCurrency } from '@/presentation/format'
import type { LeadView } from '../lead-view'
import { WhatsAppButton } from '../whatsapp-button'

interface LeadCardContentProps {
  readonly view: LeadView
  readonly onMove?: (leadId: string, status: LeadStatus) => void
  /** Cópia que segue o cursor: eleva com shadow-overlay e inclina 1°. */
  readonly dragging?: boolean
}

/** Conteúdo fixo do card: nome, categoria · cidade, rodapé com Score, Rating e WhatsApp. O status não se repete: a coluna já diz. */
export function LeadCardContent({ view, onMove, dragging = false }: LeadCardContentProps) {
  const { lead } = view
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-md border border-line bg-surface px-3 pt-3 pb-2 transition-[border-color] hover:border-line-strong',
        dragging && '-rotate-1 shadow-[var(--shadow-overlay)]',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium">{lead.name}</p>
          <p className="truncate text-caption text-ink-muted">
            {lead.category} · {lead.city}
          </p>
        </div>
        {lead.dealValue ? <span className="shrink-0 text-data font-medium">{formatCurrency(lead.dealValue)}</span> : null}
      </div>
      <FollowUpTag followUpAt={lead.followUpAt} />
      <div className="flex items-center justify-between gap-2 border-t border-line pt-2">
        <Score value={view.opportunity.score} reasons={view.opportunity.reasons} variant="badge" showWord={false} />
        <span className="inline-flex items-center gap-2">
          {lead.rating ? <Rating value={lead.rating} /> : null}
          <WhatsAppButton view={view} onOpen={() => lead.status === 'novo' && onMove?.(lead.id, 'contatado')} />
        </span>
      </div>
    </div>
  )
}

interface LeadCardProps {
  readonly view: LeadView
  readonly onSelect: (view: LeadView) => void
  readonly onMove: (leadId: string, status: LeadStatus) => void
}

export function LeadCard({ view, onSelect, onMove }: LeadCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: view.lead.id })

  return (
    <article
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => onSelect(view)}
      aria-label={`${view.lead.name}. Arraste para mudar de etapa ou pressione Enter para abrir.`}
      className={cn('cursor-grab touch-manipulation rounded-md outline-none active:cursor-grabbing', isDragging && 'opacity-40')}
    >
      <LeadCardContent view={view} onMove={onMove} />
    </article>
  )
}
