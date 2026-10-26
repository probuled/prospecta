import type { LucideIcon } from 'lucide-react'
import type { ButtonHTMLAttributes, ComponentProps } from 'react'
import { Link } from 'react-router'
import { cn } from '@/lib/utils'
import { buttonClasses, type ButtonStyle } from './button-classes'

export type { ButtonSize, ButtonVariant } from './button-classes'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyle {
  readonly icon?: LucideIcon
}

/** Primário (ouro) no máximo uma vez por tela. Com `iconOnly`, passe `aria-label`. */
export function Button({ variant, size, iconOnly, icon: Icon, className, children, type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonClasses({ variant, size, iconOnly }), className)} {...props}>
      {Icon && <Icon />}
      {!iconOnly && children}
    </button>
  )
}

/** Navegação interna com aparência de botão, mantendo a semântica de link. */
export function ButtonLink({ variant, size, iconOnly, className, ...props }: ComponentProps<typeof Link> & ButtonStyle) {
  return <Link className={cn(buttonClasses({ variant, size, iconOnly }), className)} {...props} />
}

/** Link externo (WhatsApp, Maps, e-mail) com aparência de botão. */
export function ExternalButtonLink({ variant, size, iconOnly, className, ...props }: ComponentProps<'a'> & ButtonStyle) {
  return <a target="_blank" rel="noreferrer" className={cn(buttonClasses({ variant, size, iconOnly }), className)} {...props} />
}
