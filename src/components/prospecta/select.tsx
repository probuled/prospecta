import { Select as SelectPrimitive } from '@base-ui/react/select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption<T extends string> {
  readonly value: T
  readonly label: string
}

interface SelectProps<T extends string> {
  readonly value: T
  readonly options: readonly SelectOption<T>[]
  readonly onChange: (value: T) => void
  /** Prefixo opcional ("Status:"). O gatilho sempre mostra o valor atual, não o nome do filtro. */
  readonly label?: string
  /** Filtro diferente do padrão: borda em `ink`. */
  readonly active?: boolean
  readonly size?: 'sm' | 'md'
  readonly className?: string
  readonly 'aria-label'?: string
}

/** Gatilho de filtro do design system com a lista do Base UI por baixo. */
export function Select<T extends string>({ value, options, onChange, label, active, size = 'md', className, ...rest }: SelectProps<T>) {
  const current = options.find((option) => option.value === value)

  return (
    <SelectPrimitive.Root items={options} value={value} onValueChange={(next) => next !== null && onChange(next as T)}>
      <SelectPrimitive.Trigger
        aria-label={rest['aria-label']}
        data-active={active || undefined}
        className={cn(
          'inline-flex cursor-pointer items-center gap-2 rounded-md border border-line-strong bg-surface pr-2 pl-3 text-sm whitespace-nowrap text-ink data-[active]:border-ink',
          size === 'sm' ? 'h-7 text-[13px]' : 'h-9',
          className,
        )}
      >
        {label && <span className="text-ink-muted">{label}</span>}
        <span className="truncate">{current?.label}</span>
        <ChevronDown className="size-3.5 shrink-0 text-ink-muted" />
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner sideOffset={4} alignItemWithTrigger={false} className="z-50 outline-none">
          <SelectPrimitive.Popup className="max-h-(--available-height) min-w-(--anchor-width) overflow-y-auto rounded-lg border border-line bg-surface p-1 text-ink shadow-[var(--shadow-overlay)] outline-none">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className="flex h-8 cursor-default items-center gap-2 rounded-md pr-2 pl-2.5 text-sm outline-none select-none data-highlighted:bg-surface-hover"
              >
                <SelectPrimitive.ItemText className="flex-1">{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator>
                  <Check className="size-4 text-ink-muted" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
