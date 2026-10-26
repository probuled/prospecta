import { Menu } from '@base-ui/react/menu'
import { Check, ChevronDown } from 'lucide-react'
import { LEAD_STATUSES, LEAD_STATUS_LABELS, type LeadStatus } from '@/domain/lead'
import { cn } from '@/lib/utils'

const MARK_CLASSES: Record<LeadStatus, string> = {
  novo: 'bg-transparent shadow-[inset_0_0_0_1.5px_var(--ink-muted)]',
  contatado: 'bg-info',
  respondeu: 'bg-ouro',
  negociando: 'bg-ameixa',
  fechado: 'bg-sucesso',
  perdido: 'bg-ink-faint',
}

/** Marcador quadrado de 8px: a única parte do status que carrega cor. */
export function StatusMark({ status, className }: { readonly status: LeadStatus; readonly className?: string }) {
  return <span aria-hidden className={cn('size-2 shrink-0 rounded-[2px]', MARK_CLASSES[status], className)} />
}

/** Status só para exibir. */
export function Status({ status }: { readonly status: LeadStatus }) {
  return (
    <span className="inline-flex items-center gap-2 text-[13px] font-medium whitespace-nowrap">
      <StatusMark status={status} />
      {LEAD_STATUS_LABELS[status]}
    </span>
  )
}

interface StatusMenuProps {
  readonly status: LeadStatus
  readonly onChange: (status: LeadStatus) => void
  readonly className?: string
}

/** Status como gatilho de menu (padrão do design system): marcador + palavra + seta. */
export function StatusMenu({ status, onChange, className }: StatusMenuProps) {
  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={`Status: ${LEAD_STATUS_LABELS[status]}. Mudar status`}
        className={cn(
          'inline-flex h-7 cursor-pointer items-center gap-2 rounded-md border border-transparent pr-1.5 pl-2 text-[13px] font-medium whitespace-nowrap text-ink transition-colors hover:border-line hover:bg-surface aria-expanded:border-line aria-expanded:bg-surface',
          className,
        )}
      >
        <StatusMark status={status} />
        {LEAD_STATUS_LABELS[status]}
        <ChevronDown className="size-3.5 text-ink-muted" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={4} align="end" className="z-50 outline-none">
          <Menu.Popup className="min-w-40 rounded-lg border border-line bg-surface p-1 text-ink shadow-[var(--shadow-overlay)] outline-none">
            <Menu.RadioGroup value={status} onValueChange={(next) => onChange(next as LeadStatus)}>
              {LEAD_STATUSES.map((option) => (
                <Menu.RadioItem
                  key={option}
                  value={option}
                  className="flex h-8 cursor-default items-center gap-2 rounded-md pr-2 pl-2.5 text-sm outline-none select-none data-highlighted:bg-surface-hover"
                >
                  <StatusMark status={option} />
                  <span className="flex-1">{LEAD_STATUS_LABELS[option]}</span>
                  <Menu.RadioItemIndicator>
                    <Check className="size-4 text-ink-muted" />
                  </Menu.RadioItemIndicator>
                </Menu.RadioItem>
              ))}
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}
