import { Loader2 } from 'lucide-react'
import type { SearchStatus as Status } from '@/domain/search'
import { cn } from '@/lib/utils'

const STATUS_VIEW: Record<Status, { readonly label: string; readonly mark: string }> = {
  working: { label: 'Buscando', mark: '' },
  ok: { label: 'Concluída', mark: 'bg-sucesso' },
  failed: { label: 'Falhou', mark: 'bg-quente' },
}

/** Mesmo padrão do Status de lead: marcador de 8px (ou spinner) + palavra. */
export function SearchStatus({ status }: { readonly status: Status }) {
  const { label, mark } = STATUS_VIEW[status]
  return (
    <span className="inline-flex items-center gap-2 text-[13px] font-medium whitespace-nowrap">
      {status === 'working' ? <Loader2 className="size-3.5 animate-spin text-ink-muted" /> : <span className={cn('size-2 rounded-[2px]', mark)} />}
      {label}
    </span>
  )
}
