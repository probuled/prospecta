import { cn } from '@/lib/utils'

interface TagListProps {
  readonly items: readonly string[]
  readonly label?: string
  readonly selected?: string
  readonly onSelect: (item: string) => void
  readonly className?: string
}

/** Tags retangulares; no máximo 2 linhas (o excedente é cortado, nunca vira nuvem de pílulas). */
export function TagList({ items, label, selected, onSelect, className }: TagListProps) {
  return (
    <div className={cn('flex max-h-16 flex-wrap items-center gap-2 overflow-hidden', className)}>
      {label && <span className="mr-1 text-[13px] text-ink-muted">{label}</span>}
      {items.map((item) => (
        <button
          key={item}
          type="button"
          aria-pressed={selected === item}
          onClick={() => onSelect(item)}
          className="h-7 cursor-pointer rounded-sm border border-line bg-transparent px-2 text-[13px] leading-4 text-ink transition-colors hover:border-line-strong hover:bg-surface aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-bg"
        >
          {item}
        </button>
      ))}
    </div>
  )
}
