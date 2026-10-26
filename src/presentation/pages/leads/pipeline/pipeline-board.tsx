import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { useMemo, useState } from 'react'
import { LEAD_STATUSES, type LeadStatus } from '@/domain/lead'
import { buildPipeline } from '@/domain/pipeline'
import type { LeadView } from '../lead-view'
import { LeadCardContent } from './lead-card'
import { PipelineColumn } from './pipeline-column'

interface PipelineBoardProps {
  readonly views: readonly LeadView[]
  readonly onSelect: (view: LeadView) => void
  readonly onMove: (leadId: string, status: LeadStatus) => void
}

const followUpTime = (view: LeadView) => (view.lead.followUpAt ? Date.parse(view.lead.followUpAt) : Number.POSITIVE_INFINITY)

/** Dentro de cada coluna, quem tem contato marcado vem primeiro (mais urgente no topo); o resto mantém a ordem por oportunidade. */
function byUrgency(a: LeadView, b: LeadView): number {
  return followUpTime(a) - followUpTime(b)
}

const isLeadStatus = (value: unknown): value is LeadStatus => LEAD_STATUSES.includes(value as LeadStatus)

export function PipelineBoard({ views, onSelect, onMove }: PipelineBoardProps) {
  const columns = useMemo(() => buildPipeline([...views].sort(byUrgency), (view) => view.lead), [views])
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = views.find((view) => view.lead.id === activeId)

  // Distância/atraso mínimos para o clique (abrir o lead) não virar arraste; no toque, segurar para arrastar.
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
    useSensor(KeyboardSensor),
  )

  const handleDragStart = ({ active }: DragStartEvent) => setActiveId(String(active.id))
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null)
    const lead = views.find((view) => view.lead.id === active.id)?.lead
    if (lead && over && isLeadStatus(over.id) && over.id !== lead.status) onMove(lead.id, over.id)
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={() => setActiveId(null)}>
      <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-12 lg:px-12">
        <div className="grid min-w-max auto-cols-[minmax(200px,1fr)] grid-flow-col items-start gap-3 xl:min-w-0">
          {columns.map((column) => (
            <PipelineColumn key={column.status} column={column} onSelect={onSelect} onMove={onMove} />
          ))}
        </div>
      </div>
      <DragOverlay dropAnimation={null}>{active ? <LeadCardContent view={active} dragging /> : null}</DragOverlay>
    </DndContext>
  )
}
