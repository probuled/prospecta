import { useDroppable } from '@dnd-kit/core'
import { useState } from 'react'
import { Button } from '@/components/prospecta/button'
import { StatusMark } from '@/components/prospecta/status'
import { LEAD_STATUS_LABELS, type LeadStatus } from '@/domain/lead'
import type { PipelineColumn as Column } from '@/domain/pipeline'
import { cn } from '@/lib/utils'
import { formatCount, formatCurrency } from '@/presentation/format'
import type { LeadView } from '../lead-view'
import { LeadCard } from './lead-card'

/** Colunas como "Novo" podem ter centenas de leads; renderizamos aos poucos. */
const PAGE_SIZE = 25

interface PipelineColumnProps {
  readonly column: Column<LeadView>
  readonly onSelect: (view: LeadView) => void
  readonly onMove: (leadId: string, status: LeadStatus) => void
}

export function PipelineColumn({ column, onSelect, onMove }: PipelineColumnProps) {
  const [visible, setVisible] = useState(PAGE_SIZE)
  const { setNodeRef, isOver } = useDroppable({ id: column.status })

  return (
    <section
      ref={setNodeRef}
      aria-label={LEAD_STATUS_LABELS[column.status]}
      className={cn(
        'flex min-h-[120px] flex-col gap-2 rounded-lg bg-surface-sunken p-2 transition-shadow',
        isOver && 'shadow-[inset_0_0_0_1px_var(--line-strong)]',
      )}
    >
      <header className="flex items-center gap-2 px-2 py-1.5 text-[13px] font-semibold">
        <StatusMark status={column.status} />
        {LEAD_STATUS_LABELS[column.status]}
        <span className="font-mono text-xs font-normal text-ink-muted">{formatCount(column.items.length)}</span>
        {column.totalValue > 0 && <span className="ml-auto font-mono text-xs font-normal text-ink-muted">{formatCurrency(column.totalValue)}</span>}
      </header>

      {column.items.slice(0, visible).map((view) => (
        <LeadCard key={view.lead.id} view={view} onSelect={onSelect} onMove={onMove} />
      ))}
      {column.items.length === 0 && (
        <p className="rounded-md border border-dashed border-line-strong px-3 py-6 text-center text-[13px] text-ink-muted">Arraste um lead para cá</p>
      )}
      {column.items.length > visible && (
        <Button variant="ghost" size="sm" onClick={() => setVisible((count) => count + PAGE_SIZE)}>
          Mostrar mais {Math.min(PAGE_SIZE, column.items.length - visible)}
        </Button>
      )}
    </section>
  )
}
