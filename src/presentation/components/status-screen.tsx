import type { ReactNode } from 'react'
import { Logo } from '@/components/prospecta/logo'

interface StatusScreenProps {
  /** Destaque grande acima do título (ex.: o 404 desenhado). */
  readonly hero: ReactNode
  readonly title: string
  readonly description: ReactNode
  readonly actions: ReactNode
}

/** Tela de estado (página não encontrada, erro inesperado): logo, destaque, texto e ações, centralizados. */
export function StatusScreen({ hero, title, description, actions }: StatusScreenProps) {
  return (
    <div className="flex flex-col items-center py-8 text-center sm:py-12">
      <Logo height={80} className="mb-10" />
      {hero}
      <h1 className="text-display mt-8 text-balance">{title}</h1>
      <div className="mt-3 max-w-lg text-pretty text-ink-muted">{description}</div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">{actions}</div>
    </div>
  )
}
