import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SegmentOption<T extends string> {
  readonly value: T
  readonly label: string
  readonly icon?: LucideIcon
}

interface SegmentedControlProps<T extends string> {
  readonly options: readonly SegmentOption<T>[]
  readonly value: T
  readonly onChange: (value: T) => void
  /** Rótulo vira tooltip e aria-label. */
  readonly iconOnly?: boolean
  /** Ocupa a largura disponível. */
  readonly block?: boolean
  readonly label?: string
  readonly className?: string
}

/** Alterna entre 2–4 visualizações (Lista/Pipeline, tema). Filtro não é segmented: é Select. */
export function SegmentedControl<T extends string>({ options, value, onChange, iconOnly, block, label, className }: SegmentedControlProps<T>) {
  return (
    <div role="group" aria-label={label} className={cn('gap-0.5 rounded-md bg-surface-sunken p-0.5', block ? 'flex' : 'inline-flex', className)}>
      {options.map(({ value: option, label: optionLabel, icon: Icon }) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          aria-label={iconOnly ? optionLabel : undefined}
          title={iconOnly ? optionLabel : undefined}
          onClick={() => onChange(option)}
          className={cn(
            'inline-flex h-[30px] cursor-pointer items-center gap-2 rounded-sm px-3 text-[13px] font-medium text-ink-muted transition-colors hover:text-ink',
            'aria-pressed:bg-surface aria-pressed:text-ink aria-pressed:shadow-[0_0_0_1px_var(--line)]',
            iconOnly && 'w-[30px] justify-center px-0',
            block && 'flex-1 justify-center',
          )}
        >
          {Icon && <Icon className="size-[15px]" />}
          {!iconOnly && optionLabel}
        </button>
      ))}
    </div>
  )
}
