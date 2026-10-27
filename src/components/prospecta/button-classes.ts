import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'whatsapp' | 'instagram'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonStyle {
  readonly variant?: ButtonVariant
  readonly size?: ButtonSize
  readonly iconOnly?: boolean
}

/** Botão de marca (WhatsApp, Instagram): pílula em caixa alta, com degradê e sombra na cor da marca. */
const BRAND_PILL =
  'rounded-full border-0 font-extrabold tracking-wider uppercase shadow-cta transition-[translate,box-shadow,filter] duration-200 hover:-translate-y-0.5 hover:brightness-105'

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  secondary: 'border-line bg-surface text-ink hover:bg-surface-hover',
  primary: 'border-ouro bg-ouro text-on-ouro hover:brightness-95',
  ghost: 'border-transparent bg-transparent text-ink-muted hover:text-ink',
  whatsapp: `${BRAND_PILL} bg-linear-to-br from-whatsapp-brand to-whatsapp-brand-deep text-on-whatsapp-brand shadow-whatsapp-brand/40`,
  instagram: `${BRAND_PILL} bg-linear-to-r from-instagram-from via-instagram-via to-instagram-to text-on-instagram shadow-instagram-via/35`,
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
