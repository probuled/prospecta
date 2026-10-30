import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PanelProps {
  readonly title?: string
  /** Um Button ghost à direita do título. */
  readonly action?: ReactNode
  readonly children?: ReactNode
  readonly className?: string
  readonly bodyClassName?: string
}

/** Container com borda para conteúdo relacionado. Sem sombra; não aninhe painéis. */
export function Panel({ title, action, children, className, bodyClassName }: PanelProps) {
  return (
    <section className={cn('rounded-lg border border-line bg-surface', className)}>
      {(title || action) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          {title && <h2 className="text-title">{title}</h2>}
          {action}
        </header>
      )}
      <div className={cn('p-5', bodyClassName)}>{children}</div>
    </section>
  )
}
