import type { ReactNode } from 'react'

interface PageHeaderProps {
  readonly title: string
  readonly description?: ReactNode
  readonly actions?: ReactNode
}

/** `display` + subtítulo em `ink-muted`; ações à direita. */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-display">{title}</h1>
        {description && <p className="max-w-2xl text-pretty text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}
