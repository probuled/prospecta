import type { LucideIcon } from 'lucide-react'
import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly icon?: LucideIcon
  readonly width?: number | string
}

/** Campo de linha única. O placeholder descreve o conteúdo; não substitui o rótulo. */
export function Input({ icon: Icon, width, className, ...props }: InputProps) {
  return (
    <label
      style={width !== undefined ? { width } : undefined}
      className={cn(
        'inline-flex h-9 min-w-0 items-center gap-2 rounded-md border border-line-strong bg-surface px-3 text-sm text-ink-muted focus-within:shadow-[var(--focus-ring)]',
        className,
      )}
    >
      {Icon && <Icon className="size-4 shrink-0" />}
      <input data-focus-inner className="min-w-0 flex-1 bg-transparent p-0 text-ink outline-none placeholder:text-ink-muted" {...props} />
    </label>
  )
}

/** Mesmo visual para campos soltos (valor, data) sem ícone. */
export const fieldClasses =
  'h-9 w-full min-w-0 rounded-md border border-line-strong bg-surface px-3 text-sm text-ink outline-none placeholder:text-ink-muted'
