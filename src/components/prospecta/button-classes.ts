import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'whatsapp'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonStyle {
  readonly variant?: ButtonVariant
  readonly size?: ButtonSize
  readonly iconOnly?: boolean
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  secondary: 'border-line bg-surface text-ink hover:bg-surface-hover',
  primary: 'border-ouro bg-ouro text-on-ouro hover:brightness-95',
  ghost: 'border-transparent bg-transparent text-ink-muted hover:text-ink',
  whatsapp:
    'border-whatsapp-brand bg-whatsapp-brand font-bold text-on-whatsapp-brand shadow-md transition-all hover:-translate-y-px hover:shadow-lg hover:brightness-105',
}

const SIZE_CLASSES: Record<ButtonSize, { readonly base: string; readonly icon: string }> = {
  sm: { base: 'h-7 gap-1 px-2 text-[13px]', icon: 'w-7 px-0' },
  md: { base: 'h-9 gap-2 px-3 text-sm', icon: 'w-9 px-0' },
  lg: { base: 'h-11 gap-2 px-5 text-sm', icon: 'w-11 px-0' },
}

/** Classes do botão do design system, reaproveitadas por links com cara de botão. */
export function buttonClasses({ variant = 'secondary', size = 'md', iconOnly = false }: ButtonStyle = {}): string {
  return cn(
    'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md border leading-5 font-medium whitespace-nowrap transition-[background-color,border-color,color,filter] [&_svg]:size-4 [&_svg]:shrink-0',
    'disabled:cursor-not-allowed disabled:border-surface-sunken disabled:bg-surface-sunken disabled:text-ink-faint disabled:brightness-100',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size].base,
    iconOnly && SIZE_CLASSES[size].icon,
  )
}
