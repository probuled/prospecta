import { LEAD_STATUSES, type Lead, type LeadStatus } from './lead'

export interface PipelineColumn<T> {
  readonly status: LeadStatus
  readonly items: readonly T[]
  readonly totalValue: number
}

/** Agrupa itens por status do lead, uma coluna por etapa do funil, na ordem do funil. */
export function buildPipeline<T>(items: readonly T[], leadOf: (item: T) => Lead): PipelineColumn<T>[] {
  return LEAD_STATUSES.map((status) => {
    const columnItems = items.filter((item) => leadOf(item).status === status)
    return {
      status,
      items: columnItems,
      totalValue: columnItems.reduce((total, item) => total + (leadOf(item).dealValue ?? 0), 0),
    }
  })
}
