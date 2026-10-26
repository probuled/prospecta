import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SegmentOption<T extends string> {
  readonly value: T
  readonly label: string
  readonly icon?: LucideIcon
}

type SegmentedControlVariant = 'sunken' | 'outline'
type SegmentedControlSize = 'sm' | 'md'

interface SegmentedControlProps<T extends string> {
  readonly options: readonly SegmentOption<T>[]
  readonly value: T
  readonly onChange: (value: T) => void
  /** Rótulo vira tooltip e aria-label. */
  readonly iconOnly?: boolean
  /** Ocupa a largura disponível. */
  readonly block?: boolean
  readonly label?: string
  /** Mostra o `label` acima das opções, para quem não percebe que dá para trocar. */
  readonly showLabel?: boolean
  /** `outline` tem borda e destaca a opção ativa em `ink`: troca de visão que precisa ser notada. */
  readonly variant?: SegmentedControlVariant
  /** `md` acompanha a altura dos controles (36px). */
  readonly size?: SegmentedControlSize
  readonly className?: string
}

const VARIANT_CLASSES: Record<SegmentedControlVariant, { readonly group: string; readonly option: string }> = {
  sunken: {
    group: 'bg-surface-sunken',
    option: 'aria-pressed:bg-surface aria-pressed:text-ink aria-pressed:shadow-[0_0_0_1px_var(--line)]',
  },
  outline: {
    group: 'border border-line-strong bg-surface',
    option: 'aria-pressed:bg-ink aria-pressed:font-semibold aria-pressed:text-bg aria-pressed:[&_svg]:text-ouro',
  },
}

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
  variant = 'sunken',
  size = 'sm',
  className,
}: SegmentedControlProps<T>) {
  const group = (
    <div
      role="group"
      aria-label={label}
      className={cn(
        'gap-0.5 rounded-md p-0.5',
        VARIANT_CLASSES[variant].group,
        block ? 'flex' : 'inline-flex',
        !showLabel && className,
      )}
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
            VARIANT_CLASSES[variant].option,
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
    <div className={cn('inline-flex flex-col items-center gap-1.5', className)}>
      <span aria-hidden className="text-label text-ink-muted">
        {label}
      </span>
      {group}
    </div>
  )
}
