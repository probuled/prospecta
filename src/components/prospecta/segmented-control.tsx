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
  /** Mostra o `label` antes das opções, para quem não percebe que dá para trocar. */
  readonly showLabel?: boolean
  /** `md` acompanha a altura dos botões (36px) no cabeçalho. */
  readonly size?: SegmentedControlSize
  readonly className?: string
}

type SegmentedControlSize = 'sm' | 'md'

const SIZE_CLASSES: Record<SegmentedControlSize, { readonly base: string; readonly icon: string }> = {
  sm: { base: 'h-[30px] px-3 text-[13px]', icon: 'w-[30px]' },
  md: { base: 'h-8 px-3.5 text-sm', icon: 'w-8' },
}

/** Alterna entre 2–4 visualizações (Lista/Pipeline, tema). Filtro não é segmented: é Select. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  iconOnly,
  block,
  label,
  showLabel,
  size = 'sm',
  className,
}: SegmentedControlProps<T>) {
  const group = (
    <div
      role="group"
      aria-label={label}
      className={cn('gap-0.5 rounded-md bg-surface-sunken p-0.5', block ? 'flex' : 'inline-flex', !showLabel && className)}
    >
      {options.map(({ value: option, label: optionLabel, icon: Icon }) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          aria-label={iconOnly ? optionLabel : undefined}
          title={iconOnly ? optionLabel : undefined}
          onClick={() => onChange(option)}
          className={cn(
            'inline-flex cursor-pointer items-center gap-2 rounded-sm font-medium text-ink-muted transition-colors hover:text-ink',
            'aria-pressed:bg-surface aria-pressed:text-ink aria-pressed:shadow-[0_0_0_1px_var(--line)]',
            SIZE_CLASSES[size].base,
            iconOnly && cn(SIZE_CLASSES[size].icon, 'justify-center px-0'),
            block && 'flex-1 justify-center',
          )}
        >
          {Icon && <Icon className="size-[15px]" />}
          {!iconOnly && optionLabel}
        </button>
      ))}
    </div>
  )

  if (!showLabel || !label) return group
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span aria-hidden className="text-label text-ink-muted">
        {label}
      </span>
      {group}
    </div>
  )
}
