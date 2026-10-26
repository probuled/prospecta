import { cn } from '@/lib/utils'
import type { EngineStatus as Status } from '@/presentation/hooks/use-engine-status'

const STATUS_VIEW: Record<Status, { readonly label: string; readonly note: string; readonly mark: string }> = {
  checking: { label: 'Verificando motor', note: '', mark: 'bg-ink-faint' },
  online: { label: 'Motor online', note: ':8080', mark: 'bg-sucesso' },
  offline: { label: 'Motor parado', note: 'docker', mark: 'bg-quente' },
}

export function EngineStatusMark({ status }: { readonly status: Status }) {
  return <i title={STATUS_VIEW[status].label} className={cn('block size-1.5 rounded-[1px]', STATUS_VIEW[status].mark)} />
}

export function EngineStatus({ status }: { readonly status: Status }) {
  const { label, note } = STATUS_VIEW[status]
  return (
    <div className="flex items-center gap-2 px-2 text-[13px] whitespace-nowrap">
      <EngineStatusMark status={status} />
      {label}
      {note && <small className="ml-auto truncate font-mono text-xs text-ink-muted">{note}</small>}
    </div>
  )
}
