import { ChevronDown, type LucideIcon } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DisclosureProps {
  readonly title: string
  /** Resumo do estado atual, sempre visível: diz o que vai acontecer. */
  readonly summary?: string
  readonly icon?: LucideIcon
  readonly defaultOpen?: boolean
  readonly children?: ReactNode
}

export function Disclosure({ title, summary, icon: Icon, defaultOpen = false, children }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="rounded-lg border border-line bg-surface">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex h-[52px] w-full cursor-pointer items-center gap-3 rounded-lg px-5 text-left"
      >
        {Icon && <Icon className="size-4 text-ink-muted" />}
        <span className="flex-1 font-medium">{title}</span>
        {summary && <span className="hidden text-[13px] text-ink-muted sm:inline">{summary}</span>}
        <ChevronDown className={cn('size-4 text-ink-muted transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="grid gap-8 border-t border-line p-5 md:grid-cols-2">{children}</div>}
    </section>
  )
}
