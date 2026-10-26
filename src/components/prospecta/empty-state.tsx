import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  readonly icon: LucideIcon
  /** Diz o estado e o próximo passo: "Nenhum lead ainda. Faça uma busca." */
  readonly title: string
  readonly description?: string
  readonly action?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-line-strong px-6 py-14 text-center">
      <Icon className="size-6 text-ink-faint" />
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        {description && <p className="max-w-sm text-pretty text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}
