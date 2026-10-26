import logoDark from '@/assets/brand/prospecta-logo-dark.png'
import logoLight from '@/assets/brand/prospecta-logo.png'
import symbolDark from '@/assets/brand/prospecta-simbolo-dark.png'
import symbolLight from '@/assets/brand/prospecta-simbolo.png'
import { cn } from '@/lib/utils'

const LOGOS = {
  wordmark: { light: logoLight, dark: logoDark, ratio: 1469 / 434 },
  symbol: { light: symbolLight, dark: symbolDark, ratio: 1 },
} as const

interface LogoProps {
  /** `wordmark`: logo completa (sidebar, login). `symbol`: só o P (espaço curto, favicon, loading). */
  readonly variant?: keyof typeof LOGOS
  readonly height?: number
  readonly className?: string
}

/** Logo oficial. Troca sozinha para a versão de tinta clara no tema escuro. Nunca recolorir nem redesenhar. */
export function Logo({ variant = 'wordmark', height = 28, className }: LogoProps) {
  const { light, dark, ratio } = LOGOS[variant]
  const size = { height, width: Math.round(height * ratio) }

  return (
    <span role="img" aria-label="Prospecta" className={cn('inline-block shrink-0 leading-none', className)}>
      <img src={light} alt="" {...size} className="block dark:hidden" />
      <img src={dark} alt="" {...size} className="hidden dark:block" />
    </span>
  )
}
