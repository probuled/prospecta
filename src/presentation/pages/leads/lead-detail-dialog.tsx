import { useRef } from 'react'
import { Presence } from '@/components/prospecta/presence'
import { Score } from '@/components/prospecta/score'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { LeadPatch } from '@/domain/lead'
import { LeadApproach } from './lead-approach'
import { FollowUpSection, InfoSection } from './lead-detail-sections'
import type { LeadView } from './lead-view'

interface LeadDetailDialogProps {
  readonly view: LeadView | null
  readonly onClose: () => void
  readonly onUpdate: (leadId: string, patch: LeadPatch) => void
}

export function LeadDetailDialog({ view, onClose, onUpdate }: LeadDetailDialogProps) {
  // Foco inicial no cabeçalho: evita o anel de foco num botão ao abrir pelo mouse.
  const headerRef = useRef<HTMLDivElement>(null)

  return (
    <Dialog open={view !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        initialFocus={headerRef}
        className="block max-h-[90dvh] gap-0 overflow-y-auto rounded-lg bg-surface p-0 ring-line sm:max-w-5xl"
      >
        <div ref={headerRef} tabIndex={-1} className="outline-none">
          {view && <LeadDetailBody key={view.lead.id} view={view} onUpdate={onUpdate} />}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function LeadDetailBody({ view, onUpdate }: { view: LeadView; onUpdate: LeadDetailDialogProps['onUpdate'] }) {
  const { lead } = view
  const update = (patch: LeadPatch) => onUpdate(lead.id, patch)

  return (
    <>
      <DialogHeader className="gap-3 border-b border-line p-5 pr-12">
        <div className="space-y-1">
          <DialogTitle className="text-2xl leading-8 font-bold tracking-tight">{lead.name}</DialogTitle>
          <DialogDescription className="text-ink-muted">
            {lead.category} · {lead.city}
          </DialogDescription>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Score value={view.opportunity.score} reasons={view.opportunity.reasons} />
          <Presence kind={view.presence} />
        </div>
      </DialogHeader>

      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <LeadApproach view={view} onContact={() => lead.status === 'novo' && update({ status: 'contatado' })} />
        <div className="border-t border-line md:border-t-0 md:border-l">
          <FollowUpSection view={view} onUpdate={update} />
          <InfoSection view={view} />
        </div>
      </div>
    </>
  )
}
