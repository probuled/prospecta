import { useState } from 'react'
import { Button } from '@/components/prospecta/button'
import { Presence } from '@/components/prospecta/presence'
import { Rating } from '@/components/prospecta/rating'
import { Score } from '@/components/prospecta/score'
import { StatusMenu } from '@/components/prospecta/status'
import type { LeadStatus } from '@/domain/lead'
import { cn } from '@/lib/utils'
import type { LeadView } from './lead-view'
import { WhatsAppButton } from './whatsapp-button'

const PAGE_SIZE = 50

interface LeadsTableProps {
  readonly views: readonly LeadView[]
  readonly selectedId: string | null
  readonly onSelect: (view: LeadView) => void
  readonly onStatusChange: (leadId: string, status: LeadStatus) => void
}

const headClass = 'bg-surface-sunken px-4 py-2.5 text-left text-xs leading-4 font-medium whitespace-nowrap text-ink-muted'
const cellClass = 'h-[var(--row-height)] px-4 align-middle'

function NoRating() {
  return <span className="text-xs text-ink-muted">sem nota</span>
}

/** No celular a tabela não cabe: cada lead vira uma linha com o essencial. */
function MobileLeadList({ views, onSelect, onContact }: { views: readonly LeadView[]; onSelect: (view: LeadView) => void; onContact: (view: LeadView) => void }) {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface sm:hidden">
      {views.map((view) => (
        <li key={view.lead.id} onClick={() => onSelect(view)} className="flex items-center gap-3 px-4 py-3 active:bg-surface-hover">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate font-medium">{view.lead.name}</p>
            <p className="truncate text-caption text-ink-muted">{view.lead.category}</p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Score value={view.opportunity.score} reasons={view.opportunity.reasons} />
              <Presence kind={view.presence} />
            </div>
          </div>
          <WhatsAppButton view={view} onOpen={() => onContact(view)} />
        </li>
      ))}
    </ul>
  )
}

export function LeadsTable({ views, selectedId, onSelect, onStatusChange }: LeadsTableProps) {
  const [visible, setVisible] = useState(PAGE_SIZE)
  const markContacted = (view: LeadView) => view.lead.status === 'novo' && onStatusChange(view.lead.id, 'contatado')
  const page = views.slice(0, visible)

  return (
    <div className="space-y-3">
      <MobileLeadList views={page} onSelect={onSelect} onContact={markContacted} />
      <div className="hidden overflow-x-auto rounded-lg border border-line bg-surface sm:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className={headClass}>Negócio</th>
              <th className={headClass}>Oportunidade</th>
              <th className={cn(headClass, 'hidden md:table-cell')}>Presença</th>
              <th className={cn(headClass, 'hidden lg:table-cell')}>Avaliação</th>
              <th className={headClass}>Contato</th>
              <th className={cn(headClass, 'text-right')}>Status</th>
            </tr>
          </thead>
          <tbody>
            {page.map((view) => (
              <tr
                key={view.lead.id}
                onClick={() => onSelect(view)}
                aria-selected={selectedId === view.lead.id}
                className="cursor-pointer border-b border-line transition-colors last:border-b-0 hover:bg-surface-hover aria-selected:bg-surface-hover"
              >
                <td className={cn(cellClass, 'max-w-72')}>
                  <b className="block truncate font-medium">{view.lead.name}</b>
                  <small className="block truncate text-caption text-ink-muted">
                    {view.lead.category} · {view.lead.city}
                  </small>
                </td>
                <td className={cellClass}>
                  <Score value={view.opportunity.score} reasons={view.opportunity.reasons} />
                </td>
                <td className={cn(cellClass, 'hidden md:table-cell')}>
                  <Presence kind={view.presence} />
                </td>
                <td className={cn(cellClass, 'hidden lg:table-cell')}>
                  {view.lead.rating ? <Rating value={view.lead.rating} count={view.lead.reviewCount} /> : <NoRating />}
                </td>
                <td className={cellClass}>
                  <span className="inline-flex items-center gap-2 whitespace-nowrap">
                    <WhatsAppButton view={view} onOpen={() => markContacted(view)} />
                    <span className="hidden text-data xl:inline">{view.lead.phone}</span>
                  </span>
                </td>
                <td className={cn(cellClass, 'text-right')} onClick={(e) => e.stopPropagation()}>
                  <StatusMenu status={view.lead.status} onChange={(status) => onStatusChange(view.lead.id, status)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {views.length > visible && (
        <Button className="w-full" onClick={() => setVisible((count) => count + PAGE_SIZE)}>
          Mostrar mais {Math.min(PAGE_SIZE, views.length - visible)}
        </Button>
      )}
    </div>
  )
}
